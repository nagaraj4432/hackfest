# 🚀 Quick Start Guide

## Installation & Running the Project

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd shriti-2
```

### Step 2: Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### Step 3: Configure Environment Variables

#### Backend Configuration
Create/Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/aptitude-tracker
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
PORT=5000
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` in production!

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `MONGODB_URI` in `.env`

### Step 5: Start the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Expected output: `Server running on port 5000`

#### Terminal 2 - Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
Expected output: `Local: http://localhost:3000`

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📝 First Time Usage

### Creating Test Accounts

#### Student Account
1. Click "Register" button
2. Fill in the form:
   - Name: John Doe
   - Email: student@test.com
   - Password: password123
   - Role: Student
   - Branch: CSE
   - Section: A
3. Click "Register"

#### Admin Account
1. Click "Register" button
2. Fill in the form:
   - Name: Admin User
   - Email: admin@test.com
   - Password: password123
   - Role: Admin
3. Click "Register"

### Testing Student Features

1. **Log Activity**
   - Go to "Log Activity"
   - Select category (e.g., "Coding Practice")
   - Enter time spent (e.g., 60 minutes)
   - Set difficulty level
   - Add notes if desired
   - Click "Log Activity"

2. **View Dashboard**
   - Go to "Dashboard"
   - See your weekly progress
   - Check your readiness score
   - View activity graphs

3. **Set Goals**
   - Go to "Goals"
   - Set weekly targets
   - Monitor progress with visual bars

### Testing Admin Features

1. **View Student List**
   - Go to "Students"
   - Filter by branch/section if needed
   - Click "View Profile" on any student

2. **Check Dashboard**
   - Go to "Dashboard"
   - See overall statistics
   - View top performers
   - Check low consistency students

3. **Post Announcement**
   - In Dashboard, scroll to "Post Announcement"
   - Fill in title and description
   - Select announcement type
   - Mark as important if needed
   - Click "Post Announcement"

4. **Export Reports**
   - Click "Export Student Report (CSV)"
   - CSV file will be downloaded

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:**
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Update connection string in .env
```

### Issue: Port 5000/3000 Already in Use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Issue: CORS Errors
**Solution:**
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000
- Check that `vite.config.js` has correct proxy settings

### Issue: Dependencies Not Installing
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📊 Testing the Readiness Score

1. Create a student account
2. Log multiple activities over several days:
   - Coding (with various difficulties)
   - Aptitude
   - Core subjects
   - Mock interviews
3. Go to Dashboard to see:
   - Readiness score calculation
   - Score breakdown
   - Daily consistency graph
   - Category breakdown

The score updates in real-time based on your activities!

## 🎯 Activity Categories Explained

| Category | What to Log | Example |
|----------|------------|---------|
| 💻 Coding | DSA problems, LeetCode | Solved 3 medium problems |
| 🧠 Aptitude | Quant, Reasoning, English | Solved 10 aptitude questions |
| 🖥️ OS | Operating Systems study | Studied process scheduling |
| 🗄️ DBMS | Database concepts | Learned about transactions |
| 🌐 CN | Computer Networks | Studied TCP/IP layers |
| 📦 OOPS | OOP concepts | Practiced inheritance |
| 🎤 Soft Skills | Communication, HR prep | Communication practice |
| 🎯 Mock Interview | Mock interviews | 45-min mock interview |
| 🏆 Contest | Programming contests | Participated in CodeChef |

## 📈 Understanding Your Readiness Score

**Score Ranges:**
- 🟢 85-100%: Placement Ready
- 🟡 70-84%: Almost Ready
- 🔵 50-69%: In Progress
- 🟠 25-49%: Just Started
- ⚪ 0-24%: Not Started

**Factors (with weights):**
- Coding Consistency: 30%
- Category Coverage: 20%
- Time Spent: 20%
- Aptitude Score: 15%
- Mock Interviews: 15%

**Tips to Improve:**
1. Log activities consistently (daily practice)
2. Practice across all categories
3. Spend more time on weak areas
4. Take more mock interviews
5. Attempt harder difficulty problems

## 🌐 API Testing with Postman

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123",
  "role": "student"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@test.com",
  "password": "password123"
}
```

### 3. Log Activity
```
POST http://localhost:5000/api/activity/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "coding",
  "timeSpent": 60,
  "difficultyLevel": "medium",
  "notes": "Solved 3 medium problems",
  "problemsSolved": 3
}
```

### 4. Get Weekly Dashboard
```
GET http://localhost:5000/api/activity/dashboard/weekly
Authorization: Bearer <token>
```

## 🔄 Development Workflow

### Make Changes to Backend
1. Edit files in `backend/src/`
2. Server auto-reloads with nodemon
3. Test with Postman or frontend

### Make Changes to Frontend
1. Edit files in `frontend/src/`
2. Hot reload happens automatically
3. Check browser console for errors

### Database Changes
1. Update models in `backend/src/models/`
2. MongoDB will auto-create collections
3. For schema changes, consider data migration

## 🚀 Deployment

### Deploy Backend (Heroku/Render)
```bash
# Install Heroku CLI
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Update Frontend API URL
In `frontend/src/services/api.js`, change:
```javascript
const API_BASE = 'https://your-backend-url/api'
```

## 📞 Need Help?

- Check the README.md for detailed documentation
- Review API endpoints in README.md
- Check browser console for frontend errors
- Check terminal for backend errors
- Ensure all ports are correct

---

**Happy Learning! 🎓**
