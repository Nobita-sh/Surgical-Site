const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || '60cc0645ff364a1d6324db3f1d1a037d35d68c533817979b918d2cd0399a4762';

/**
 * Verifies JWT token from Authorization: Bearer <token>
 * Attaches decoded user payload: { id, email, role, permissions, status }
 */
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Missing or invalid Authorization Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Real-time status & permission check from database (instant revocation upon deactivation/role changes)
    const Store = require('../data/store');
    const freshUser = await Store.getUserByEmail(decoded.email);

    if (!freshUser) {
      return res.status(401).json({
        error: 'User account no longer exists.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (freshUser.status === 'inactive') {
      return res.status(403).json({
        error: 'Your account has been deactivated. Please contact your administrator.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    req.user = {
      id: freshUser.id,
      email: freshUser.email,
      role: freshUser.role,
      permissions: Array.isArray(freshUser.permissions) ? freshUser.permissions : [],
      status: freshUser.status || 'active'
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid or forged token.', code: 'INVALID_TOKEN' });
  }
};

/**
 * Enforces Administrator-only access (e.g. staff management, CMS, global settings, audit logs)
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin' || req.user.status === 'inactive') {
    return res.status(403).json({ error: 'Access forbidden. Administrator privileges required.' });
  }
  next();
};

/**
 * Generic RBAC permission middleware for staff roles.
 * Allows access if user is 'admin' OR possesses the specified permission in their permissions array.
 * Valid permissions: 'orders', 'products', 'support', 'delivery'
 */
exports.requirePermission = (permissionName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (req.user.status === 'inactive') {
      return res.status(403).json({
        error: 'Account is deactivated. Please contact your administrator.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Admins hold universal access across all operations
    if (req.user.role === 'admin') {
      return next();
    }

    // Check granular permission array
    const userPermissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    if (userPermissions.includes(permissionName)) {
      return next();
    }

    return res.status(403).json({
      error: `Access denied. Operation requires '${permissionName}' permission.`,
      requiredPermission: permissionName
    });
  };
};

/**
 * Rate limiter for login endpoint to prevent brute-force attacks
 * Max 10 attempts per 15 minutes per IP
 */
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP address. Please try again after 15 minutes.' }
});

exports.JWT_SECRET = JWT_SECRET;
