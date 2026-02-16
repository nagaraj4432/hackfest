import Activity from '../models/Activity.js';
import Goal from '../models/Goal.js';

export const calculateReadinessScore = async (userId) => {
  try {
    const activities = await Activity.find({ userId });
    const goals = await Goal.find({ userId });

    // Calculate coding consistency (based on days with coding activity)
    const uniqueDates = new Set(activities
      .filter(a => a.category === 'coding')
      .map(a => a.date.toDateString())
    );
    const codingDays = uniqueDates.size;
    const codingConsistency = Math.min((codingDays / 7) * 100, 100); // 7 days target

    // Calculate category coverage
    const categories = new Set(activities.map(a => a.category));
    const categoryScore = (categories.size / 9) * 100; // 9 categories total

    // Calculate time spent
    const totalTime = activities.reduce((sum, a) => sum + a.timeSpent, 0);
    const timeScore = Math.min((totalTime / 1200) * 100, 100); // 20 hours target

    // Calculate aptitude score
    const aptitudeActivities = activities.filter(a => a.category === 'aptitude');
    const aptitudeScore = Math.min(
      aptitudeActivities.reduce((sum, a) => sum + (a.difficultyLevel === 'hard' ? 10 : 5), 0),
      100
    );

    // Calculate mock interview score
    const mockActivities = activities.filter(a => a.category === 'mock_interview');
    const mockScore = Math.min(mockActivities.length * 10, 100);

    // Weighted calculation
    const readinessScore = Math.round(
      (codingConsistency * 0.3) +
      (categoryScore * 0.2) +
      (timeScore * 0.2) +
      (aptitudeScore * 0.15) +
      (mockScore * 0.15)
    );

    return {
      score: Math.min(readinessScore, 100),
      codingConsistency: Math.round(codingConsistency),
      categoryScore: Math.round(categoryScore),
      timeScore: Math.round(timeScore),
      aptitudeScore: Math.round(aptitudeScore),
      mockScore: Math.round(mockScore),
      status: getReadinessStatus(readinessScore),
      totalActivities: activities.length,
      codingDays: codingDays
    };
  } catch (err) {
    console.error('Error calculating readiness score:', err);
    return { score: 0, status: 'Not Started' };
  }
};

export const getReadinessStatus = (score) => {
  if (score >= 85) return 'Placement Ready';
  if (score >= 70) return 'Almost Ready';
  if (score >= 50) return 'In Progress';
  if (score >= 25) return 'Just Started';
  return 'Not Started';
};

export const getWeekNumber = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export const getCurrentWeekYear = () => {
  const now = new Date();
  return {
    week: getWeekNumber(now),
    year: now.getFullYear()
  };
};
