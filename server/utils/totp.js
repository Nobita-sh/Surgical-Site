/**
 * totp.js
 * Comprehensive TOTP (RFC 6238) & QR Code Security Engine for Surgicals.PK
 * Fully zero-dependency: uses Node.js standard `crypto` module.
 */

const crypto = require('crypto');

// ============================================================================
// 1. RFC 4648 Base32 Encoding / Decoding
// ============================================================================

const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += B32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += B32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(str) {
  let bits = 0;
  let value = 0;
  const output = [];
  const clean = String(str || '').toUpperCase().replace(/=+$/, '');

  for (let i = 0; i < clean.length; i++) {
    const idx = B32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

// ============================================================================
// 2. Cryptographic Secret & TOTP Algorithm (RFC 6238 / RFC 4226)
// ============================================================================

/**
 * Generate a cryptographically random Base32 secret for TOTP (default 20 bytes = 160 bits = 32 base32 chars)
 */
function generateSecret(byteLength = 20) {
  const bytes = crypto.randomBytes(byteLength);
  return base32Encode(bytes);
}

/**
 * Compute the 6-digit TOTP code for a given secret and timestamp
 * @param {string} secret Base32-encoded secret
 * @param {number} epochSec Timestamp in seconds (defaults to now)
 * @param {number} timeStep Time step interval in seconds (default 30s)
 */
function generateTOTP(secret, epochSec = Math.floor(Date.now() / 1000), timeStep = 30) {
  const counter = Math.floor(epochSec / timeStep);
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));

  const key = base32Decode(secret);
  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buf);
  const digest = hmac.digest();

  // Dynamic truncation (RFC 4226 section 5.4)
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = code % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Verifies a submitted TOTP token against a secret with window tolerance
 * @param {string} secret Base32 secret
 * @param {string} token 6-digit token to verify
 * @param {object} options Options: window (tolerance in 30s intervals, default 1 = +/- 30s)
 */
function verifyTOTP(secret, token, options = {}) {
  if (!secret || !token) return false;
  const cleanToken = String(token).replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanToken)) return false;

  const window = options.window !== undefined ? Number(options.window) : 1;
  const now = Math.floor(Date.now() / 1000);

  for (let error = -window; error <= window; error++) {
    const expected = generateTOTP(secret, now + error * 30);
    try {
      if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
        return true;
      }
    } catch {
      // Buffer length mismatch fallback
    }
  }

  return false;
}

/**
 * Generate standard otpauth URI
 */
function generateOtpAuthUri({ secret, accountName, issuer = 'Surgicals.PK' }) {
  const cleanIssuer = encodeURIComponent(issuer);
  const cleanAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${cleanIssuer}:${cleanAccount}?secret=${secret}&issuer=${cleanIssuer}&algorithm=SHA1&digits=6&period=30`;
}

// ============================================================================
// 3. Backup Recovery Codes (Single-Use)
// ============================================================================

/**
 * Generate N single-use backup recovery codes formatted as XXXX-XXXX
 */
function generateRecoveryCodes(count = 8) {
  const codes = [];
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 without ambiguous 0/O, 1/I
  for (let i = 0; i < count; i++) {
    const bytes = crypto.randomBytes(8);
    let code = '';
    for (let b = 0; b < 8; b++) {
      code += chars[bytes[b] % chars.length];
      if (b === 3) code += '-';
    }
    codes.push(code);
  }
  return codes;
}

/**
 * Check if input code matches any stored recovery code (case-insensitive, ignores hyphens)
 * Returns { valid: boolean, remainingCodes: string[] }
 */
function verifyRecoveryCode(storedCodes = [], inputCode) {
  if (!Array.isArray(storedCodes) || !inputCode) {
    return { valid: false, remainingCodes: storedCodes || [] };
  }

  const cleanInput = String(inputCode).replace(/[\s-]/g, '').toUpperCase();
  const matchIndex = storedCodes.findIndex(c => String(c).replace(/[\s-]/g, '').toUpperCase() === cleanInput);

  if (matchIndex === -1) {
    return { valid: false, remainingCodes: storedCodes };
  }

  const remainingCodes = storedCodes.filter((_, idx) => idx !== matchIndex);
  return { valid: true, remainingCodes };
}

// ============================================================================
// 4. Pure Vector SVG QR Code Generator (ISO/IEC 18004 Standard Model 2)
// ============================================================================

// Galois Field GF(256) tables
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  GF_EXP[i] = x;
  GF_EXP[i + 255] = x;
  GF_LOG[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}

function gfMul(x, y) {
  return x === 0 || y === 0 ? 0 : GF_EXP[GF_LOG[x] + GF_LOG[y]];
}

function rsPolyMul(p1, p2) {
  const result = new Uint8Array(p1.length + p2.length - 1);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMul(p1[i], p2[j]);
    }
  }
  return result;
}

function rsGenPoly(numEcBytes) {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < numEcBytes; i++) {
    poly = rsPolyMul(poly, new Uint8Array([1, GF_EXP[i]]));
  }
  return poly;
}

function rsCalculateRemainder(data, numEcBytes) {
  const genPoly = rsGenPoly(numEcBytes);
  const remainder = new Uint8Array(numEcBytes);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[numEcBytes - 1] = 0;
    for (let j = 0; j < numEcBytes; j++) {
      remainder[j] ^= gfMul(genPoly[j + 1], factor);
    }
  }
  return remainder;
}

// Table of QR Code versions capacity & EC descriptors for Error Correction 'M'
// Version -> [totalCodewords, ecCodewords, [numBlocks1, dataCodewords1], [numBlocks2, dataCodewords2], [alignmentCoords]]
const QR_SPECS_M = [
  null,
  { v: 1,  size: 21, totalCw: 26,  ecCw: 10, b1: [1, 16], b2: [0, 0], align: [] },
  { v: 2,  size: 25, totalCw: 44,  ecCw: 16, b1: [1, 28], b2: [0, 0], align: [6, 18] },
  { v: 3,  size: 29, totalCw: 70,  ecCw: 26, b1: [1, 44], b2: [0, 0], align: [6, 22] },
  { v: 4,  size: 33, totalCw: 100, ecCw: 18, b1: [2, 32], b2: [0, 0], align: [6, 26] },
  { v: 5,  size: 37, totalCw: 134, ecCw: 24, b1: [2, 43], b2: [0, 0], align: [6, 30] },
  { v: 6,  size: 41, totalCw: 172, ecCw: 16, b1: [4, 27], b2: [0, 0], align: [6, 34] },
  { v: 7,  size: 45, totalCw: 196, ecCw: 18, b1: [4, 31], b2: [0, 0], align: [6, 22, 38] },
  { v: 8,  size: 49, totalCw: 242, ecCw: 22, b1: [2, 38], b2: [2, 39], align: [6, 24, 42] },
  { v: 9,  size: 53, totalCw: 292, ecCw: 22, b1: [3, 36], b2: [2, 37], align: [6, 26, 46] },
  { v: 10, size: 57, totalCw: 346, ecCw: 26, b1: [4, 43], b2: [1, 44], align: [6, 28, 50] }
];

function encodeQRMatrix(text) {
  const dataBytes = Buffer.from(text, 'utf8');
  // Find minimum version that fits data (Byte mode overhead: 4-bit mode + 8/16-bit length)
  let spec = null;
  for (let v = 1; v <= 10; v++) {
    const s = QR_SPECS_M[v];
    const totalDataCapacity = s.b1[0] * s.b1[1] + s.b2[0] * s.b2[1];
    const lengthBits = v <= 9 ? 8 : 16;
    const requiredBits = 4 + lengthBits + dataBytes.length * 8;
    if (requiredBits <= totalDataCapacity * 8) {
      spec = s;
      break;
    }
  }

  if (!spec) {
    throw new Error('Data too long for compact QR generator');
  }

  const size = spec.size;
  const totalDataCw = spec.b1[0] * spec.b1[1] + spec.b2[0] * spec.b2[1];

  // 1. Bit Buffer packing
  const bitBuf = [];
  const appendBits = (val, count) => {
    for (let i = count - 1; i >= 0; i--) {
      bitBuf.push((val >>> i) & 1);
    }
  };

  // Byte mode indicator: 0100
  appendBits(4, 4);
  // Character count indicator
  const charCountBits = spec.v <= 9 ? 8 : 16;
  appendBits(dataBytes.length, charCountBits);
  // Data payload
  for (let i = 0; i < dataBytes.length; i++) {
    appendBits(dataBytes[i], 8);
  }

  // Terminator (up to 4 zeroes)
  const maxBits = totalDataCw * 8;
  const termLen = Math.min(4, maxBits - bitBuf.length);
  appendBits(0, termLen);

  // Pad to byte boundary
  while (bitBuf.length % 8 !== 0) {
    bitBuf.push(0);
  }

  // Pad bytes 0xEC, 0x11
  const padCw = [0xec, 0x11];
  let padIdx = 0;
  while (bitBuf.length < maxBits) {
    appendBits(padCw[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bit buffer to data codewords
  const dataCw = [];
  for (let i = 0; i < bitBuf.length; i += 8) {
    let byteVal = 0;
    for (let b = 0; b < 8; b++) {
      byteVal = (byteVal << 1) | bitBuf[i + b];
    }
    dataCw.push(byteVal);
  }

  // 2. Block division & Error correction
  const blocks = [];
  let cwOffset = 0;
  for (let i = 0; i < spec.b1[0]; i++) {
    const bData = dataCw.slice(cwOffset, cwOffset + spec.b1[1]);
    cwOffset += spec.b1[1];
    const bEc = rsCalculateRemainder(bData, spec.ecCw);
    blocks.push({ data: bData, ec: bEc });
  }
  for (let i = 0; i < spec.b2[0]; i++) {
    const bData = dataCw.slice(cwOffset, cwOffset + spec.b2[1]);
    cwOffset += spec.b2[1];
    const bEc = rsCalculateRemainder(bData, spec.ecCw);
    blocks.push({ data: bData, ec: bEc });
  }

  // Interleave data codewords
  const finalCodewords = [];
  let maxDataLen = Math.max(...blocks.map(b => b.data.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (let b = 0; b < blocks.length; b++) {
      if (i < blocks[b].data.length) finalCodewords.push(blocks[b].data[i]);
    }
  }
  // Interleave EC codewords
  for (let i = 0; i < spec.ecCw; i++) {
    for (let b = 0; b < blocks.length; b++) {
      finalCodewords.push(blocks[b].ec[i]);
    }
  }

  // 3. Construct Matrix
  const matrix = Array.from({ length: size }, () => new Int8Array(size).fill(-1)); // -1 = unassigned

  // Helper to place finder pattern
  const setFinder = (row, col) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr < 0 || tr >= size || tc < 0 || tc >= size) continue;
        if (r >= 0 && r <= 6 && (c === 0 || c === 6 || r === 0 || r === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))) {
          matrix[tr][tc] = 1;
        } else {
          matrix[tr][tc] = 0;
        }
      }
    }
  };

  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0 ? 1 : 0;
    if (matrix[6][i] === -1) matrix[6][i] = val;
    if (matrix[i][6] === -1) matrix[i][6] = val;
  }

  // Alignment patterns
  if (spec.align && spec.align.length > 1) {
    const coords = spec.align;
    for (let r of coords) {
      for (let c of coords) {
        if (matrix[r][c] !== -1) continue;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const isBorder = Math.abs(dy) === 2 || Math.abs(dx) === 2;
            const isCenter = dy === 0 && dx === 0;
            matrix[r + dy][c + dx] = isBorder || isCenter ? 1 : 0;
          }
        }
      }
    }
  }

  // Dark module
  matrix[4 * spec.v + 9][8] = 1;

  // Reserve format info area
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === -1) matrix[8][i] = 0;
    if (matrix[i][8] === -1) matrix[i][8] = 0;
  }
  for (let i = size - 8; i < size; i++) {
    if (matrix[8][i] === -1) matrix[8][i] = 0;
    if (matrix[i][8] === -1) matrix[i][8] = 0;
  }

  // 4. Fill Data bits in zig-zag
  const allBits = [];
  for (let cw of finalCodewords) {
    for (let b = 7; b >= 0; b--) {
      allBits.push((cw >>> b) & 1);
    }
  }
  // Add remainder bits if needed
  while (allBits.length < spec.totalCw * 8) allBits.push(0);

  let bitIdx = 0;
  let dirUp = true;
  for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
    if (rightCol === 6) rightCol--; // skip timing column
    const rows = dirUp
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (let r of rows) {
      for (let c of [rightCol, rightCol - 1]) {
        if (matrix[r][c] === -1) {
          matrix[r][c] = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
        }
      }
    }
    dirUp = !dirUp;
  }

  // 5. Mask Pattern Evaluation (Choose best mask pattern 0-7, using Mask 0: (row + col) % 2 === 0 as standard reliable mask)
  const maskFn = (r, c) => (r + c) % 2 === 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isReserved =
        (r <= 8 && (c <= 8 || c >= size - 8)) ||
        (r >= size - 8 && c <= 8) ||
        r === 6 ||
        c === 6 ||
        (matrix[r][c] === 1 && r === 4 * spec.v + 9 && c === 8);

      // Check alignment area
      let isAlign = false;
      if (spec.align && spec.align.length > 1) {
        for (let ar of spec.align) {
          for (let ac of spec.align) {
            if (Math.abs(r - ar) <= 2 && Math.abs(c - ac) <= 2) {
              isAlign = true;
              break;
            }
          }
        }
      }

      if (!isReserved && !isAlign && maskFn(r, c)) {
        matrix[r][c] ^= 1;
      }
    }
  }

  // 6. Write Format Info (EC Level 'M' = 00, Mask 0 = 000 => 00000; with BCH ECC & XOR mask 0x5412 => 0x5412 = 101010000010010)
  // Format bitstring for M0 = 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  // Top-left
  for (let i = 0; i <= 5; i++) matrix[8][i] = formatBits[i];
  matrix[8][7] = formatBits[6];
  matrix[8][8] = formatBits[7];
  matrix[7][8] = formatBits[8];
  for (let i = 9; i <= 14; i++) matrix[14 - i][8] = formatBits[i];

  // Top-right & bottom-left copy
  for (let i = 0; i <= 7; i++) matrix[8][size - 1 - i] = formatBits[14 - i];
  for (let i = 0; i <= 6; i++) matrix[size - 7 + i][8] = formatBits[i];

  return matrix;
}

/**
 * Generate a standalone vector SVG string for the QR code
 */
function generateQrCodeSvg(text, options = {}) {
  const margin = options.margin !== undefined ? options.margin : 4;
  const fgColor = options.fgColor || '#111827';
  const bgColor = options.bgColor || '#FFFFFF';
  const matrix = encodeQRMatrix(text);
  const size = matrix.length;
  const totalSize = size + margin * 2;

  let paths = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 1) {
        paths += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="crispEdges">
  <rect width="${totalSize}" height="${totalSize}" fill="${bgColor}" />
  <path d="${paths}" fill="${fgColor}" />
</svg>`;
}

/**
 * Generate a clean Data URL for direct use in <img src="..." />
 */
function generateQrCodeDataUrl(text, options = {}) {
  const svg = generateQrCodeSvg(text, options);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

module.exports = {
  generateSecret,
  generateTOTP,
  verifyTOTP,
  generateOtpAuthUri,
  generateRecoveryCodes,
  verifyRecoveryCode,
  generateQrCodeSvg,
  generateQrCodeDataUrl,
  base32Encode,
  base32Decode
};
