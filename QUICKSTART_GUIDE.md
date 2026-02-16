# Quick Start Guide - Aptitude & Placement Readiness Tracker v2.0

## 🚀 Get Started in 2 Minutes

### Step 1: Start Backend
```bash
cd backend
npm start
```
✅ You should see: `Server running on port 5000` and `MongoDB connected`

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
✅ You should see: `Local: http://localhost:3000/`

### Step 3: Open in Browser
Visit: **http://localhost:3000**

---

## 🔑 Test Credentials

Use any of these to login:

**Student Account:**
- Email: `student123@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`

---

## 🎯 What's New! (5 Advanced Features)

### 1. 🌙 Dark Mode
**How to use:**
- Click the 🌙 icon in the top navbar
- Theme persists across sessions

### 2. 🔐 Two-Factor Authentication (2FA)
**How to setup:**
1. Click ⚙️ Settings in navbar
2. Go to Security tab
3. Click "Enable 2FA"
4. Check your email for OTP code
5. Enter code to verify

### 3. 📧 Email Notifications
**How to enable:**
1. Go to Settings → Notifications tab
2. Toggle "Enable Email Notifications"
3. View recent notifications
4. Receive emails for achievements

### 4. 📱 Mobile Responsive Design
**How to test:**
1. Open DevTools (F12)
2. Click device toolbar (📱)
3. Test on different screen sizes
4. All features work on mobile!

### 5. ⚙️ Settings Page
**Access:**
- Click ⚙️ Settings in navbar
- Or navigate to: `/settings`

**Available Tabs:**
- **Profile**: Update name, branch, section
- **Security**: Change password, enable 2FA
- **Notifications**: Email & in-app notification preferences
- **Display**: Toggle dark mode

---

## 📊 Dashboard Features

### For Students
- **Dashboard**: View weekly progress, streak, readiness score
- **Activity Logger**: Log coding/interview practice
- **Goals**: Set and track weekly goals
- **Charts**: See visual progress trends

### For Admins
- **Dashboard**: Analytics for all students
- **Students**: Manage student accounts
- **Student Profile**: View detailed student performance
- **Announcements**: Post updates for students

---

## 🎨 Dark Mode Colors

**Light Theme:**
- Background: White
- Cards: Light white
- Text: Dark gray

**Dark Theme:**
- Background: Very dark (#1e1e1e)
- Cards: Dark gray (#2d2d2d)
- Text: Light gray (#e0e0e0)

Toggle with 🌙 button!

---

## 🔧 Configuration

### Email Setup Required

To enable email notifications and 2FA emails, create `.env` in backend folder:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/aptitude-tracker

# JWT Secret
JWT_SECRET=your-secret-key

# Email Config (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@aptitudetracker.com

# Server
PORT=5000
NODE_ENV=development
```

**For Gmail:**
1. Go to myaccount.google.com
2. Enable 2-Step Verification
3. Create App Password
4. Use that password in SMTP_PASSWORD

---

## 📝 Settings Page Walkthrough

### Profile Tab ✏️
```
Update your profile information:
- Full Name
- Branch (CSE, ECE, Mechanical, etc.)
- Section (A, B, C, etc.)
```

### Security Tab 🔐
```
Password Change:
- Enter current password
- Enter new password
- Confirm new password

2FA Setup:
- Click "Enable 2FA"
- Check email for OTP
- Enter OTP to verify
- Click "Disable 2FA" to turn off
```

### Notifications Tab 📬
```
Email Preferences:
- Toggle email notifications on/off
- Choose notification types

Recent Notifications:
- See last 10 notifications
- Click to mark as read
- View notification timestamps
```

### Display Tab 🎨
```
Theme Settings:
- Toggle "Enable Dark Mode"
- See live preview
- Changes apply instantly
- Preference saved to browser
```

---

## 🧪 Quick Testing Guide

### Test 1: Dark Mode
1. Click 🌙 in navbar → Theme changes
2. Refresh page → Theme persists ✅

### Test 2: Settings Access
1. Click ⚙️ Settings → Settings page opens
2. Try each tab → All functional ✅

### Test 3: 2FA Enable
1. Go to Settings → Security
2. Click "Enable 2FA"
3. Check email for code (may take 30-60 seconds)
4. Enter OTP in form ✅

### Test 4: Mobile View
1. F12 → Click 📱 device toolbar
2. Select iPhone/Android
3. Navigate pages → Layout adjusts ✅

### Test 5: Email Toggle
1. Settings → Notifications
2. Toggle "Enable Email Notifications"
3. Click "Save" ✅

---

## 📱 Responsive Breakpoints

| Screen Size | Type | Layout |
|------------|------|--------|
| < 768px | Mobile | Single column, stacked cards |
| 768px - 1024px | Tablet | 2 columns, adjusted spacing |
| > 1024px | Desktop | Full multi-column grid |

---

## 🚨 Troubleshooting

### Frontend won't start
```bash
# Port 3000 may be in use
cd frontend
npm run dev -- --port 3001
```

### Backend won't start
```bash
# Port 5000 may be in use
# Kill all node processes:
Get-Process node | Stop-Process -Force

# Then restart
cd backend && npm start
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
mongosh

# Or start MongoDB service
net start MongoDB
```

### Email not working
- Check .env file in backend
- Verify Gmail app password (not regular password)
- Check spam folder
- Wait 30-60 seconds after requesting OTP

### Dark mode not working
- Check browser DevTools console (F12)
- Clear browser cache (Ctrl+Shift+Delete)
- Make sure ThemeContext is imported

---

## 📊 Project Structure

```
shriti-2/
├── backend/
│   ├── src/
│   │   ├── controllers/    (Business logic)
│   │   ├── models/        (Database schemas)
│   │   ├── routes/        (API endpoints)
│   │   ├── utils/         (Helper functions)
│   │   └── middleware/    (Auth, validation)
│   ├── package.json
│   ├── .env              (Configuration)
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── pages/        (Page components)
│   │   ├── components/   (Reusable components)
│   │   ├── context/      (State management)
│   │   ├── services/     (API calls)
│   │   └── App.jsx       (Main app)
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
│
├── INTEGRATION_GUIDE.md       (Detailed guide)
├── FEATURES_SUMMARY.md        (Feature overview)
├── QUICKSTART_GUIDE.md        (This file)
└── README.md                  (Project info)
```

---

## 🎓 Understanding Each Feature

### Dark Mode
Uses **React Context API** to manage theme state globally. Colors change throughout the app in real-time. Browser localStorage saves your preference.

### 2FA
Uses **OTP (One-Time Password)** system. When enabled, sensitive operations require email verification. OTP codes expire after 10 minutes for security.

### Email Notifications
Uses **Nodemailer** to send HTML emails. Notifications track in database and can be toggled. Three templates: Score updates, Announcements, Milestones.

### Mobile Responsive
Uses **CSS Grid with media queries**. Layouts automatically adjust for different screen sizes. Mobile-first design approach ensures quality on all devices.

### Settings Page
Centralizes all user settings in one place. Four tabs handle different aspects: Profile, Security, Notifications, Display. Form validation and error handling included.

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Bcrypt Password Hashing** - Industry standard
✅ **2FA/OTP** - Extra security layer
✅ **CORS Protection** - Prevents cross-origin attacks
✅ **Email Verification** - Validates email changes
✅ **Session Management** - Automatic token refresh

---

## 📈 API Overview

### Main Endpoints
```
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/profile

Activities:
  POST   /api/activity/log
  GET    /api/activity/all
  GET    /api/activity/dashboard

Settings (NEW):
  GET    /api/settings/notifications
  POST   /api/settings/email-notifications/toggle
  POST   /api/settings/2fa/enable
  POST   /api/settings/2fa/verify
  PUT    /api/settings/profile
  POST   /api/settings/password
```

---

## 🎉 You're Ready!

1. ✅ Backend running on localhost:5000
2. ✅ Frontend running on localhost:3000
3. ✅ All 5 features implemented and working
4. ✅ Documentation available (see README)
5. ✅ Ready for testing and deployment

**Have fun exploring your enhanced Aptitude Tracker!** 🚀

---

## 📞 Need Help?

1. **Settings not working?** - Check localStorage (F12 → Application)
2. **Email not sending?** - Verify .env SMTP settings
3. **Dark mode broken?** - Clear cache (Ctrl+Shift+Delete)
4. **2FA code expired?** - Request new code (expires in 10 min)
5. **Mobile layout weird?** - Test in Chrome DevTools

---

**Version**: 2.0 (Advanced Features)
**Last Updated**: February 2025
**Status**: ✅ Production Ready
