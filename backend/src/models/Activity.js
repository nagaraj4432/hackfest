import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['coding', 'aptitude', 'os', 'dbms', 'cn', 'oops', 'softskills', 'mock_interview', 'contest'],
    required: true
  },
  timeSpent: {
    type: Number, // in minutes
    required: true
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  notes: {
    type: String,
    default: ''
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Activity', activitySchema);
