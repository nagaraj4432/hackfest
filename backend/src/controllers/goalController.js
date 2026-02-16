import Goal from '../models/Goal.js';
import { getCurrentWeekYear } from '../utils/readinessScore.js';

export const setWeeklyGoals = async (req, res) => {
  try {
    const { codingGoal, aptitudeGoal, mockInterviewGoal, coreSubjectsGoal } = req.body;
    const { week, year } = getCurrentWeekYear();

    let goal = await Goal.findOne({ userId: req.userId, weekNumber: week, year });

    if (!goal) {
      goal = new Goal({
        userId: req.userId,
        weekNumber: week,
        year
      });
    }

    if (codingGoal) goal.codingGoal.target = codingGoal;
    if (aptitudeGoal) goal.aptitudeGoal.target = aptitudeGoal;
    if (mockInterviewGoal) goal.mockInterviewGoal.target = mockInterviewGoal;
    if (coreSubjectsGoal) goal.coreSubjectsGoal.target = coreSubjectsGoal;

    goal.updatedAt = new Date();
    await goal.save();

    res.json({ message: 'Goals set successfully', goal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyGoals = async (req, res) => {
  try {
    const { week, year } = getCurrentWeekYear();

    let goal = await Goal.findOne({ userId: req.userId, weekNumber: week, year });

    if (!goal) {
      goal = new Goal({
        userId: req.userId,
        weekNumber: week,
        year
      });
      await goal.save();
    }

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGoalProgress = async (req, res) => {
  try {
    const { week, year } = getCurrentWeekYear();

    const goal = await Goal.findOne({ userId: req.userId, weekNumber: week, year });

    if (!goal) {
      return res.status(404).json({ error: 'Goals not found for this week' });
    }

    const progressData = {
      coding: {
        target: goal.codingGoal.target,
        completed: goal.codingGoal.completed,
        percentage: Math.round((goal.codingGoal.completed / goal.codingGoal.target) * 100)
      },
      aptitude: {
        target: goal.aptitudeGoal.target,
        completed: goal.aptitudeGoal.completed,
        percentage: Math.round((goal.aptitudeGoal.completed / goal.aptitudeGoal.target) * 100)
      },
      mockInterview: {
        target: goal.mockInterviewGoal.target,
        completed: goal.mockInterviewGoal.completed,
        percentage: Math.round((goal.mockInterviewGoal.completed / goal.mockInterviewGoal.target) * 100)
      },
      coreSubjects: {
        target: goal.coreSubjectsGoal.target,
        completed: goal.coreSubjectsGoal.completed,
        percentage: Math.round((goal.coreSubjectsGoal.completed / goal.coreSubjectsGoal.target) * 100)
      }
    };

    res.json(progressData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
