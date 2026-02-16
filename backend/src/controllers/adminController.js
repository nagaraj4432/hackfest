import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Announcement from '../models/Announcement.js';
import { calculateReadinessScore } from '../utils/readinessScore.js';

export const getAllStudents = async (req, res) => {
  try {
    const { branch, section } = req.query;
    const filter = { role: 'student' };

    if (branch) filter.branch = branch;
    if (section) filter.section = section;

    const students = await User.find(filter).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await User.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const activities = await Activity.find({ userId: studentId });
    const readinessData = await calculateReadinessScore(studentId);

    // Get weak categories
    const categoryPerformance = {};
    activities.forEach(activity => {
      if (!categoryPerformance[activity.category]) {
        categoryPerformance[activity.category] = { count: 0, totalTime: 0 };
      }
      categoryPerformance[activity.category].count += 1;
      categoryPerformance[activity.category].totalTime += activity.timeSpent;
    });

    const weakCategories = Object.entries(categoryPerformance)
      .map(([cat, data]) => ({ category: cat, ...data }))
      .sort((a, b) => a.count - b.count)
      .slice(0, 3);

    res.json({
      student,
      readinessScore: readinessData,
      totalActivities: activities.length,
      activityHistory: activities.slice(0, 50),
      weakCategories,
      performanceTrend: getPerformanceTrend(activities)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const allActivities = await Activity.find();

    const readinessScores = await Promise.all(
      students.map(async (student) => ({
        studentId: student._id,
        name: student.name,
        score: await calculateReadinessScore(student._id)
      }))
    );

    const activeStudents = students.filter(student => {
      const hasRecentActivity = allActivities.some(activity => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return activity.userId.toString() === student._id.toString() && activity.date >= sevenDaysAgo;
      });
      return hasRecentActivity;
    }).length;

    const avgReadiness = readinessScores.length > 0
      ? Math.round(readinessScores.reduce((sum, s) => sum + s.score.score, 0) / readinessScores.length)
      : 0;

    const topPerformers = readinessScores
      .sort((a, b) => b.score.score - a.score.score)
      .slice(0, 10);

    const lowConsistency = readinessScores
      .filter(s => s.score.codingConsistency < 30)
      .slice(0, 10);

    res.json({
      totalStudents: students.length,
      activeStudents,
      averageReadinessScore: avgReadiness,
      topPerformers,
      lowConsistencyStudents: lowConsistency,
      readinessDistribution: getReadinessDistribution(readinessScores)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, type, important } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const announcement = new Announcement({
      title,
      description,
      type: type || 'other',
      createdBy: req.userId,
      important: important || false
    });

    await announcement.save();
    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name')
      .sort({ important: -1, date: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportStudentReport = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    
    const reportData = await Promise.all(
      students.map(async (student) => {
        const activities = await Activity.find({ userId: student._id });
        const readiness = await calculateReadinessScore(student._id);
        
        return {
          name: student.name,
          email: student.email,
          branch: student.branch,
          section: student.section,
          totalActivities: activities.length,
          readinessScore: readiness.score,
          status: readiness.status,
          codingDays: readiness.codingDays,
          registeredDate: student.createdAt
        };
      })
    );

    // Convert to CSV
    const csv = convertToCSV(reportData);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=student-report.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPerformanceTrend = (activities) => {
  const weekTrend = {};
  activities.forEach(activity => {
    const week = getWeekNumber(activity.date);
    if (!weekTrend[week]) {
      weekTrend[week] = { count: 0, totalTime: 0 };
    }
    weekTrend[week].count += 1;
    weekTrend[week].totalTime += activity.timeSpent;
  });
  return weekTrend;
};

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const getReadinessDistribution = (readinessScores) => {
  const distribution = {
    'Placement Ready': 0,
    'Almost Ready': 0,
    'In Progress': 0,
    'Just Started': 0,
    'Not Started': 0
  };

  readinessScores.forEach(s => {
    distribution[s.score.status] += 1;
  });

  return distribution;
};

const convertToCSV = (data) => {
  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];

  data.forEach(row => {
    csv.push(headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(','));
  });

  return csv.join('\n');
};
