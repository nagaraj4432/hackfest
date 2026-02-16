import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  codingGoal: {
    target: {
      type: Number,
      default: 20  // number of problems
    },
    completed: {
      type: Number,
      default: 0
    }
  },
  aptitudeGoal: {
    target: {
      type: Number,
      default: 10  // time in hours
    },
    completed: {
      type: Number,
      default: 0
    }
  },
  mockInterviewGoal: {
    target: {
      type: Number,
      default: 2  // count
    },
    completed: {
      type: Number,
      default: 0
    }
  },
  coreSubjectsGoal: {
    target: {
      type: Number,
      default: 5  // hours
    },
    completed: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Goal', goalSchema);
