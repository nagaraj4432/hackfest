import express from 'express';
import {
  logActivity,
  getActivities,
  getActivityByDate,
  getWeeklyDashboard,
  deleteActivity
} from '../controllers/activityController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/log', authMiddleware, logActivity);
router.get('/all', authMiddleware, getActivities);
router.get('/date/:date', authMiddleware, getActivityByDate);
router.get('/dashboard/weekly', authMiddleware, getWeeklyDashboard);
router.delete('/:id', authMiddleware, deleteActivity);

export default router;
