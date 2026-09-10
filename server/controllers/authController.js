const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Store = require('../data/store');
const { JWT_SECRET } = require('../middleware/auth');
const totp = require('../utils/totp');

const VALID_PERMISSIONS = ['orders', 'products', 'support', 'delivery'];

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, hospitalClinicName, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await Store.getUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password with bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Store.createUser({
      name,
      email: cleanEmail,
      phone,
      password: hashedPassword,
      password_hash: hashedPassword,
      role: role === 'admin' ? 'admin' : 'customer',
      permissions: [],
      status: 'active',
      hospitalClinicName,
      city
    });

    const { password: _, password_hash: __, twoFactorSecret: ___, twoFactorRecoveryCodes: ____, ...safeUser } = user;

    // Issue cryptographically signed JWT token with 7-day expiration
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, permissions: [], status: 'active' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: { ...safeUser, twoFactorEnabled: false },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await Store.getUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check account status
    if (user.status === 'inactive') {
      return res.status(403).json({
        error: 'This staff account has been deactivated. Please contact your administrator.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    const storedHash = user.password_hash || user.password;
    let passwordMatches = false;

    // If stored password is a bcrypt hash (starts with $2)
    if (storedHash && storedHash.startsWith('$2')) {
      passwordMatches = await bcrypt.compare(password, storedHash);
    } else {
      // Legacy plaintext password migration / auto-upgrade
      passwordMatches = (storedHash === password);
      if (passwordMatches) {
        const newHash = await bcrypt.hash(password, 10);
        await Store.updateUser(user.id, { password: newHash, password_hash: newHash });
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // --- Two-Factor Authentication (MFA / TOTP) Challenge ---
    if (user.twoFactorEnabled) {
      const mfaToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          mfaPending: true
        },
        JWT_SECRET,
        { expiresIn: '5m' }
      );

      return res.json({
        mfaRequired: true,
        mfaToken,
        message: 'Multi-factor authentication required. Please enter your 6-digit authenticator code or backup recovery code.'
      });
    }

    const { password: _, password_hash: __, twoFactorSecret: ___, twoFactorRecoveryCodes: ____, ...safeUser } = user;
    await Store.addAuditLog({ action: 'User Authenticated', actor: user.email, origin: req.ip || 'API', status: 'SUCCESS' });

    // Issue cryptographically signed JWT token with 7-day expiration
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        status: user.status || 'active'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: { ...safeUser, twoFactorEnabled: false },
      token
    });
  } catch (err) {
    console.error('[Auth Controller Login Error]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }

    const user = await Store.getUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'Your account has been deactivated.', code: 'ACCOUNT_DEACTIVATED' });
    }

    const { password: _, password_hash: __, twoFactorSecret: ___, twoFactorRecoveryCodes: ____, ...safeUser } = user;
    res.json({
      user: {
        ...safeUser,
        twoFactorEnabled: !!user.twoFactorEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id, name, phone, hospitalClinicName, city } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const updated = await Store.updateUser(id, { name, phone, hospitalClinicName, city });
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password: _, password_hash: __, ...safeUser } = updated;
    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await Store.getUsers();
    const safeUsers = users.map(u => {
      const { password: _, password_hash: __, ...safe } = u;
      return safe;
    });
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Store.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    await Store.addAuditLog({ action: `User Deleted: ${id}`, actor: (req.user && req.user.email) || 'Admin', origin: req.ip || 'API' });
    res.json({ success: true, message: 'User account removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// Staff Account Management (Admin-Only)
// ==========================================

/**
 * Admin creates a new staff account with explicit permissions checklist
 */
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, permissions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Staff name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await Store.getUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // Filter permissions to valid set: ['orders', 'products', 'support', 'delivery']
    const cleanPermissions = Array.isArray(permissions)
      ? permissions.filter(p => VALID_PERMISSIONS.includes(p))
      : [];

    const hashedPassword = await bcrypt.hash(password, 10);

    const staffUser = await Store.createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '',
      password: hashedPassword,
      password_hash: hashedPassword,
      role: 'staff',
      permissions: cleanPermissions,
      status: 'active',
      hospitalClinicName: 'Surgicals.PK Operations',
      city: 'Lahore'
    });

    const { password: _, password_hash: __, ...safeStaff } = staffUser;

    await Store.addAuditLog({
      action: `Staff Account Created: ${staffUser.name} (${staffUser.email})`,
      actor: req.user.email,
      origin: req.ip || 'API',
      details: JSON.stringify({ permissions: cleanPermissions })
    });

    res.status(201).json({
      success: true,
      message: 'Staff account created successfully.',
      staff: safeStaff
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Admin retrieves list of all staff accounts
 */
exports.getStaffUsers = async (req, res) => {
  try {
    const allUsers = await Store.getUsers();
    const staffList = allUsers
      .filter(u => u.role === 'staff' || u.role === 'admin')
      .map(({ password, password_hash, ...safe }) => ({
        ...safe,
        permissions: Array.isArray(safe.permissions) ? safe.permissions : [],
        status: safe.status || 'active'
      }));

    res.json(staffList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Admin updates permissions for an existing staff member
 */
exports.updateStaffPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Permissions must be provided as an array.' });
    }

    const cleanPermissions = permissions.filter(p => VALID_PERMISSIONS.includes(p));

    const updated = await Store.updateUser(id, { permissions: cleanPermissions });
    if (!updated) {
      return res.status(404).json({ error: 'Staff account not found.' });
    }

    await Store.addAuditLog({
      action: `Staff Permissions Updated: ${updated.email}`,
      actor: req.user.email,
      origin: req.ip || 'API',
      details: JSON.stringify({ permissions: cleanPermissions })
    });

    const { password: _, password_hash: __, ...safeStaff } = updated;
    res.json({
      success: true,
      message: 'Staff permissions updated successfully.',
      staff: safeStaff
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Admin activates/deactivates a staff account (preserves account for audit trail)
 */
exports.toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'inactive'

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "active" or "inactive".' });
    }

    const updated = await Store.updateUser(id, { status });
    if (!updated) {
      return res.status(404).json({ error: 'Staff account not found.' });
    }

    await Store.addAuditLog({
      action: `Staff Account ${status === 'active' ? 'Reactivated' : 'Deactivated'}: ${updated.email}`,
      actor: req.user.email,
      origin: req.ip || 'API',
      details: `Status set to ${status}`
    });

    const { password: _, password_hash: __, ...safeStaff } = updated;
    res.json({
      success: true,
      message: `Staff account successfully ${status === 'active' ? 'reactivated' : 'deactivated'}.`,
      staff: safeStaff
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Admin resets password for a staff account
 */
exports.resetStaffPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await Store.updateUser(id, {
      password: hashedPassword,
      password_hash: hashedPassword
    });

    if (!updated) {
      return res.status(404).json({ error: 'Staff account not found.' });
    }

    await Store.addAuditLog({
      action: `Staff Password Reset: ${updated.name} (${updated.email})`,
      actor: req.user.email,
      origin: req.ip || 'API'
    });

    res.json({
      success: true,
      message: `Password reset successfully for ${updated.name}.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Verifies a 6-digit TOTP code or backup recovery code during MFA login challenge
 */
exports.verifyMfa = async (req, res) => {
  try {
    const { mfaToken, code } = req.body;
    if (!mfaToken || !code) {
      return res.status(400).json({ error: 'MFA session token and verification code are required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(mfaToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'MFA verification session has expired. Please sign in again.' });
    }

    if (!decoded || !decoded.mfaPending || !decoded.id) {
      return res.status(401).json({ error: 'Invalid MFA verification token.' });
    }

    const user = await Store.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        error: 'This account has been deactivated. Please contact your administrator.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ error: 'Two-factor authentication is not active on this account.' });
    }

    const cleanCode = String(code).trim();
    let isSuccess = false;
    let authMethod = 'TOTP';

    // 1. Verify standard 6-digit TOTP code
    if (/^\d{6}$/.test(cleanCode)) {
      if (totp.verifyTOTP(user.twoFactorSecret, cleanCode, { window: 1 })) {
        isSuccess = true;
        authMethod = 'TOTP';
      }
    }

    // 2. If TOTP failed, verify backup recovery code
    if (!isSuccess && user.twoFactorRecoveryCodes && user.twoFactorRecoveryCodes.length > 0) {
      const recCheck = totp.verifyRecoveryCode(user.twoFactorRecoveryCodes, cleanCode);
      if (recCheck.valid) {
        isSuccess = true;
        authMethod = 'Recovery Code';
        // Persist remaining single-use codes
        await Store.updateUser(user.id, {
          twoFactorRecoveryCodes: recCheck.remainingCodes
        });
      }
    }

    if (!isSuccess) {
      return res.status(401).json({
        error: 'Invalid authentication code or recovery code. Please check your authenticator app and try again.'
      });
    }

    await Store.addAuditLog({
      action: `User 2FA Authenticated (${authMethod})`,
      actor: user.email,
      origin: req.ip || 'API',
      status: 'SUCCESS'
    });

    const { password: _, password_hash: __, twoFactorSecret: ___, twoFactorRecoveryCodes: ____, ...safeUser } = user;

    // Issue cryptographically signed 7-day session token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        status: user.status || 'active'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        ...safeUser,
        twoFactorEnabled: true
      },
      token,
      message: `Two-factor verification successful (${authMethod}).`
    });
  } catch (err) {
    console.error('[Verify MFA Error]', err);
    res.status(500).json({ error: err.message || 'Internal server error during MFA verification.' });
  }
};

/**
 * Returns current Two-Factor Authentication status for logged-in user
 */
exports.getMfaStatus = async (req, res) => {
  try {
    const user = await Store.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      twoFactorEnabled: !!user.twoFactorEnabled,
      recoveryCodesCount: Array.isArray(user.twoFactorRecoveryCodes) ? user.twoFactorRecoveryCodes.length : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Generates setup secret, URI, and SVG QR Code for enabling Two-Factor Authentication
 */
exports.setupMfa = async (req, res) => {
  try {
    const user = await Store.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const secret = totp.generateSecret(20);
    const otpauthUrl = totp.generateOtpAuthUri({
      secret,
      accountName: user.email,
      issuer: 'Surgicals.PK'
    });

    const qrCodeSvg = totp.generateQrCodeSvg(otpauthUrl);
    const qrCodeDataUrl = totp.generateQrCodeDataUrl(otpauthUrl);

    res.json({
      secret,
      otpauthUrl,
      qrCodeSvg,
      qrCodeDataUrl,
      accountName: user.email,
      issuer: 'Surgicals.PK'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Verifies code and confirms activation of Two-Factor Authentication
 */
exports.enableMfa = async (req, res) => {
  try {
    const { secret, code } = req.body;
    if (!secret || !code) {
      return res.status(400).json({ error: 'Setup secret and verification code are required.' });
    }

    const cleanCode = String(code).trim();
    const isValid = totp.verifyTOTP(secret, cleanCode, { window: 1 });
    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid 6-digit code. Please ensure your device clock is accurate and try again.'
      });
    }

    const recoveryCodes = totp.generateRecoveryCodes(8);
    await Store.updateUser(req.user.id, {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
      twoFactorRecoveryCodes: recoveryCodes
    });

    await Store.addAuditLog({
      action: 'Two-Factor Authentication Enabled',
      actor: req.user.email,
      origin: req.ip || 'API',
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      message: 'Two-factor authentication has been successfully activated on your account.',
      recoveryCodes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Disables Two-Factor Authentication after password or code confirmation
 */
exports.disableMfa = async (req, res) => {
  try {
    const { password, code } = req.body;
    const user = await Store.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: 'Two-factor authentication is already disabled on this account.' });
    }

    let isAuthorized = false;

    // Check password if provided
    if (password) {
      const storedHash = user.password_hash || user.password;
      if (storedHash && storedHash.startsWith('$2')) {
        isAuthorized = await bcrypt.compare(password, storedHash);
      } else {
        isAuthorized = (storedHash === password);
      }
    }

    // Check TOTP code if provided
    if (!isAuthorized && code && user.twoFactorSecret) {
      isAuthorized = totp.verifyTOTP(user.twoFactorSecret, String(code).trim(), { window: 1 });
    }

    if (!isAuthorized) {
      return res.status(401).json({
        error: 'Authorization failed. Please enter your valid current password or authenticator code to disable 2FA.'
      });
    }

    await Store.updateUser(req.user.id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorRecoveryCodes: []
    });

    await Store.addAuditLog({
      action: 'Two-Factor Authentication Disabled',
      actor: req.user.email,
      origin: req.ip || 'API',
      status: 'WARNING'
    });

    res.json({
      success: true,
      message: 'Two-factor authentication has been disabled for your account.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
