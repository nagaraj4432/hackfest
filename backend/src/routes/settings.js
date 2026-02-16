import express from 'express';
import {
  updateProfile,
  updateEmail,
  verifyEmailOTP,
  changePassword,
  getNotifications,
  markNotificationAsRead,
  getNotificationCount,
  enableEmailNotifications,
  getTwoFactorStatus,
  enable2FA,
  verify2FA,
  disable2FA
} from '../controllers/settingsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Profile settings
router.put('/profile', authMiddleware, updateProfile);
router.put('/email', authMiddleware, updateEmail);
router.post('/email/verify', authMiddleware, verifyEmailOTP);
router.post('/password', authMiddleware, changePassword);

// Notifications
router.get('/notifications', authMiddleware, getNotifications);
router.put('/notifications/:id/read', authMiddleware, markNotificationAsRead);
router.get('/notifications/count', authMiddleware, getNotificationCount);
router.put('/notifications/email', authMiddleware, enableEmailNotifications);

// Two-Factor Authentication
router.get('/2fa/status', authMiddleware, getTwoFactorStatus);
router.post('/2fa/enable', authMiddleware, enable2FA);
router.post('/2fa/verify', authMiddleware, verify2FA);
router.post('/2fa/disable', authMiddleware, disable2FA);

export default router;
