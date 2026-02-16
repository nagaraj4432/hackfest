import express from 'express';
import {
  setWeeklyGoals,
  getWeeklyGoals,
  getGoalProgress
} from '../controllers/goalController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/set', authMiddleware, setWeeklyGoals);
router.get('/current', authMiddleware, getWeeklyGoals);
router.get('/progress', authMiddleware, getGoalProgress);

export default router;
