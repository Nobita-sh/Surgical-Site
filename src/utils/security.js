/**
 * Security utilities for the Surgicals.pk platform
 */

/**
 * Sanitizes URLs to prevent javascript: or data: pseudo-protocol XSS execution
 * Allows only safe schemes: http:, https:, tel:, mailto:, or relative paths starting with /
 */
export const sanitizeUrl = (url = '') => {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  
  // Safe relative paths or explicitly safe protocols
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('mailto:')
  ) {
    return trimmed;
  }

  // Prepend https:// if user provided a bare domain (e.g. facebook.com/...)
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Block javascript:, data:, vbscript: or invalid protocols
  return '#';
};
