import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './context/AuthContext';
import ThemeContext from './context/ThemeContext';
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ActivityLogger from './pages/ActivityLogger';
import GoalSetter from './pages/GoalSetter';
import AdminDashboard from './pages/AdminDashboard';
import StudentList from './pages/StudentList';
import StudentProfile from './pages/StudentProfile';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { token, user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Loading...</h2>
    </div>;
  }

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={token ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
        
        {/* Student Routes */}
        <Route path="/dashboard" element={token && user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/log-activity" element={token && user?.role === 'student' ? <ActivityLogger /> : <Navigate to="/login" />} />
        <Route path="/goals" element={token && user?.role === 'student' ? <GoalSetter /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={token && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/students" element={token && user?.role === 'admin' ? <StudentList /> : <Navigate to="/login" />} />
        <Route path="/admin/student/:id" element={token && user?.role === 'admin' ? <StudentProfile /> : <Navigate to="/login" />} />

        {/* Settings Route (for both student and admin) */}
        <Route path="/settings" element={token ? <SettingsPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
