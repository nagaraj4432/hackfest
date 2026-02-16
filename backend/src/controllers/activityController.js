import Activity from '../models/Activity.js';
import { calculateReadinessScore, getCurrentWeekYear } from '../utils/readinessScore.js';

export const logActivity = async (req, res) => {
  try {
    const { category, timeSpent, notes, difficultyLevel, problemsSolved, date } = req.body;

    if (!category || !timeSpent) {
      return res.status(400).json({ error: 'Category and timeSpent are required' });
    }

    const activity = new Activity({
      userId: req.userId,
      category,
      timeSpent,
      notes: notes || '',
      difficultyLevel: difficultyLevel || 'medium',
      problemsSolved: problemsSolved || 0,
      date: date ? new Date(date) : new Date()
    });

    await activity.save();
    res.status(201).json({ message: 'Activity logged successfully', activity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const filter = { userId: req.userId };

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const activities = await Activity.find(filter).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActivityByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const activities = await Activity.find({
      userId: req.userId,
      date: { $gte: startDate, $lt: endDate }
    });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyDashboard = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const activities = await Activity.find({
      userId: req.userId,
      date: { $gte: weekStart, $lt: weekEnd }
    });

    // Calculate daily consistency
    const dailyData = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    days.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateStr = date.toDateString();
      const dayActivities = activities.filter(a => a.date.toDateString() === dateStr);
      dailyData[day] = {
        date: date.toISOString().split('T')[0],
        count: dayActivities.length,
        totalTime: dayActivities.reduce((sum, a) => sum + a.timeSpent, 0)
      };
    });

    // Category-wise breakdown
    const categoryData = {};
    activities.forEach(activity => {
      if (!categoryData[activity.category]) {
        categoryData[activity.category] = { count: 0, totalTime: 0 };
      }
      categoryData[activity.category].count += 1;
      categoryData[activity.category].totalTime += activity.timeSpent;
    });

    // Calculate readiness score
    const readinessData = await calculateReadinessScore(req.userId);

    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    while (true) {
      const dateStr = currentDate.toDateString();
      const hasActivity = activities.some(a => a.date.toDateString() === dateStr);
      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({
      dailyData,
      categoryData,
      readinessScore: readinessData,
      streak,
      totalHours: activities.reduce((sum, a) => sum + a.timeSpent, 0) / 60,
      totalActivities: activities.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
