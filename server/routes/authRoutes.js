const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin, loginLimiter } = require('../middleware/auth');

// Public auth routes
router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/mfa/verify', authController.verifyMfa);

// Two-Factor Authentication (MFA/TOTP) user management
router.get('/mfa/status', verifyToken, authController.getMfaStatus);
router.post('/mfa/setup', verifyToken, authController.setupMfa);
router.post('/mfa/enable', verifyToken, authController.enableMfa);
router.post('/mfa/disable', verifyToken, authController.disableMfa);

// Authenticated customer/staff profile
router.get('/me', verifyToken, authController.getMe);
router.put('/profile', verifyToken, authController.updateProfile);

// Admin-only user directory endpoints
router.get('/users', verifyToken, requireAdmin, authController.getUsers);
router.delete('/users/:id', verifyToken, requireAdmin, authController.deleteUser);

// Admin-only staff account management endpoints
router.get('/staff', verifyToken, requireAdmin, authController.getStaffUsers);
router.post('/staff', verifyToken, requireAdmin, authController.createStaff);
router.put('/staff/:id/permissions', verifyToken, requireAdmin, authController.updateStaffPermissions);
router.patch('/staff/:id/status', verifyToken, requireAdmin, authController.toggleStaffStatus);
router.post('/staff/:id/reset-password', verifyToken, requireAdmin, authController.resetStaffPassword);

module.exports = router;
