# 📊 Aptitude & Placement Readiness Tracker

A comprehensive full-stack web application for tracking student progress, aptitude development, and placement readiness. Built with MERN stack (MongoDB, Express, React, Node.js).

## 🎯 Features

### 👨‍🎓 Student Features

#### 1. 🔐 Authentication
- Register / Login functionality
- Role selection (Student / Admin)
- JWT-based secure authentication
- Secure password hashing with bcryptjs

#### 2. 📅 Daily Activity Tracker
Students can log:
- 💻 **Coding practice** (DSA, LeetCode, etc.)
- 🧠 **Aptitude practice**
- 📘 **Core subjects** (OS, DBMS, CN, OOPS)
- 🎤 **Soft skills practice**
- 📝 **Mock interviews**
- 🏆 **Contests attempted**

Each activity includes:
- Date selection
- Category selection
- Time spent (in minutes)
- Difficulty level (Easy, Medium, Hard)
- Notes and comments
- Problems solved count

#### 3. 📊 Progress Dashboard (Student View)
- **Total hours this week** - Visual display of weekly commitment
- **Daily consistency graph** - Line chart showing daily activity patterns
- **Category-wise progress** - Pie chart breaking down practice areas
- **Streak counter** 🔥 - Continuous days of practice
- **Readiness score** - Automated calculation with detailed breakdown

#### 4. 🎯 Goal Setting
- Weekly coding goal (e.g., 20 problems)
- Aptitude study goal (e.g., 10 hours)
- Mock interview goal (e.g., 2 interviews)
- Core subjects goal (e.g., 5 hours)
- Progress bars showing completion percentage

#### 5. 🏅 Readiness Score (Advanced Algorithm)
System calculates based on:
- **Coding Consistency** (30%): Days with coding activity
- **Time Spent** (20%): Total practice hours
- **Category Coverage** (20%): Breadth of subjects studied
- **Aptitude Score** (15%): Difficulty and quantity of aptitude practice
- **Mock Interview Performance** (15%): Number of mock interviews

Status indicators:
- 🟢 **Placement Ready** (85-100%)
- 🟡 **Almost Ready** (70-84%)
- 🔵 **In Progress** (50-69%)
- 🟠 **Just Started** (25-49%)
- ⚪ **Not Started** (0-24%)

### 👨‍🏫 Trainer/Admin Features

#### 1. 📋 Student List
- View all registered students
- Filter by branch (CSE, ECE, etc.)
- Filter by section
- Quick access to individual profiles

#### 2. 📊 Admin Dashboard
- **Total students** - Overall enrollment
- **Active students** - Students active in past 7 days
- **Average readiness score** - Overall batch performance
- **Readiness distribution chart** - Visual breakdown of student statuses
- **Top performers list** - High achieving students
- **Low consistency students** - Students needing intervention

#### 3. 🔍 Individual Student Profile
Admin can view:
- Complete activity history
- Weak categories (needs improvement)
- Current readiness score with breakdown
- Performance trend analysis
- Recent activities (last 20)
- Recommendation status

#### 4. 📢 Announcements
- Post placement drives
- Announce tests and deadlines
- Schedule interviews
- Mark important announcements
- Auto-sent to all students

#### 5. 📥 Export Reports
- Download student progress as CSV
- Includes all relevant metrics
- Attendance-style tracking
- Batch download capability

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React-ChartJS-2** - React wrapper for Charts
- **Tailwind CSS** - Styling
- **Date-fns** - Date utilities

### Database
- **MongoDB** - Main database
- **Collections**: Users, Activities, Goals, Announcements

## 📁 Project Structure

```
shriti-2/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Activity.js
│   │   │   ├── Goal.js
│   │   │   └── Announcement.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── activityController.js
│   │   │   ├── goalController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── activity.js
│   │   │   ├── goals.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   └── readinessScore.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── ActivityLogger.jsx
│   │   │   ├── GoalSetter.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentList.jsx
│   │   │   └── StudentProfile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   Edit `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/aptitude-tracker
   JWT_SECRET=your_jwt_secret_key_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

3. **Start MongoDB** (if local)
   ```bash
   mongod
   ```

4. **Run the backend**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Build for production**
   ```bash
   npm run build
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Activity Tracking
- `POST /api/activity/log` - Log new activity
- `GET /api/activity/all` - Get all activities (with filters)
- `GET /api/activity/date/:date` - Get activities for specific date
- `GET /api/activity/dashboard/weekly` - Get weekly dashboard
- `DELETE /api/activity/:id` - Delete activity

### Goals
- `POST /api/goals/set` - Set weekly goals
- `GET /api/goals/current` - Get current week's goals
- `GET /api/goals/progress` - Get goal progress

### Admin
- `GET /api/admin/students` - Get all students (with filters)
- `GET /api/admin/student/:id` - Get specific student profile
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/announcement` - Create announcement
- `GET /api/admin/announcements` - Get all announcements
- `GET /api/admin/export/report` - Export student report as CSV

## 💡 Key Features Explained

### Readiness Score Algorithm
The readiness score is a weighted calculation that provides a comprehensive view of student preparation:

```
Readiness Score = 
  (Coding Consistency × 0.3) +
  (Category Coverage × 0.2) +
  (Time Spent × 0.2) +
  (Aptitude Score × 0.15) +
  (Mock Interview Score × 0.15)
```

This ensures students need balanced preparation across multiple areas.

### Daily Activity Tracking
- Students log activities immediately after practice
- System automatically tracks consistency
- Difficulty levels help identify strength areas
- Notes help track progress and issues

### Weekly Goals
- Motivate students with clear, measurable targets
- Progress bars provide visual feedback
- Goals reset weekly for fresh motivation
- Can be customized per student

### Admin Analytics
- Identify top performers for recognition
- Flag low-consistency students for intervention
- Monitor overall batch readiness
- Track progress over time

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs (10 rounds)
- Protected routes with middleware
- CORS enabled for secure cross-origin requests
- Role-based access control (Student/Admin)
- Sensitive data excluded from API responses

## 📈 Scalability Features

- MongoDB for scalable data storage
- Modular controller and route structure
- Efficient filtering and pagination
- Chart.js for lightweight visualizations
- Vite for optimized frontend builds

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify firewall settings

### CORS Errors
- Ensure backend is running on port 5000
- Check proxy settings in `vite.config.js`

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

## 📝 Sample Test Data

You can create test accounts:
- **Student Account**: Email: student@example.com, Pass: password123
- **Admin Account**: Email: admin@example.com, Pass: password123

## 🎨 UI Components

All UI is built with:
- Custom CSS with Tailwind utilities
- Responsive grid layouts
- Interactive charts and graphs
- Clean form designs
- Emoji-powered labels for quick identification

## 📚 Database Schemas

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'admin',
  branch: String,
  section: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Schema
```javascript
{
  userId: ObjectId,
  date: Date,
  category: String,
  timeSpent: Number (minutes),
  difficultyLevel: 'easy' | 'medium' | 'hard',
  notes: String,
  problemsSolved: Number,
  createdAt: Date
}
```

### Goal Schema
```javascript
{
  userId: ObjectId,
  weekNumber: Number,
  year: Number,
  codingGoal: { target, completed },
  aptitudeGoal: { target, completed },
  mockInterviewGoal: { target, completed },
  coreSubjectsGoal: { target, completed },
  createdAt: Date,
  updatedAt: Date
}
```

### Announcement Schema
```javascript
{
  title: String,
  description: String,
  type: 'placement_drive' | 'test' | 'interview_schedule' | 'other',
  createdBy: ObjectId,
  date: Date,
  important: Boolean
}
```

## 🚦 Future Enhancements

- Email notifications for announcements
- Mobile app with React Native
- Advanced analytics with machine learning
- Interview question recommendations
- Peer comparison (with privacy controls)
- Integration with coding platforms (LeetCode API)
- Video recording for mock interviews
- Real-time collaboration features

## 👥 Contributing

Contributions are welcome! Please follow the existing code structure and conventions.

## 📄 License

This project is open source and available for educational purposes.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Created with ❤️ for placements and aptitude enhancement**
