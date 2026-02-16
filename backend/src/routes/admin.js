import express from 'express';
import {
  getAllStudents,
  getStudentProfile,
  getDashboardStats,
  createAnnouncement,
  getAnnouncements,
  exportStudentReport
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All authenticated users can see announcements
router.get('/announcements', authMiddleware, getAnnouncements);

// Admin only routes
router.get('/students', authMiddleware, adminMiddleware, getAllStudents);
router.get('/student/:studentId', authMiddleware, adminMiddleware, getStudentProfile);
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);
router.post('/announcement', authMiddleware, adminMiddleware, createAnnouncement);
router.get('/export/report', authMiddleware, adminMiddleware, exportStudentReport);

export default router;
