import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navBgColor = isDarkMode ? '#1e1e1e' : '#fff';
  const navTextColor = isDarkMode ? '#e0e0e0' : '#333';
  const linkColor = isDarkMode ? '#64b5f6' : '#007bff';

  const studentLinks = (
    <>
      <Link to="/dashboard" style={{ marginRight: '15px', color: linkColor, textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
      <Link to="/log-activity" style={{ marginRight: '15px', color: linkColor, textDecoration: 'none', fontWeight: '500' }}>Log Activity</Link>
      <Link to="/goals" style={{ marginRight: '15px', color: linkColor, textDecoration: 'none', fontWeight: '500' }}>Goals</Link>
    </>
  );

  const adminLinks = (
    <>
      <Link to="/admin/dashboard" style={{ marginRight: '15px', color: linkColor, textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
      <Link to="/admin/students" style={{ marginRight: '15px', color: linkColor, textDecoration: 'none', fontWeight: '500' }}>Students</Link>
    </>
  );

  return (
    <nav style={{
      backgroundColor: navBgColor,
      padding: '15px 40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: isDarkMode ? '1px solid #333' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: linkColor }}>📊 Aptitude Tracker</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ color: navTextColor }}>Hello, <strong>{user?.name}</strong></div>
        {user?.role === 'student' ? studentLinks : adminLinks}
        <Link to="/settings" style={{ color: linkColor, textDecoration: 'none', fontWeight: '500' }}>⚙️ Settings</Link>
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0'
          }}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 15px', cursor: 'pointer' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
