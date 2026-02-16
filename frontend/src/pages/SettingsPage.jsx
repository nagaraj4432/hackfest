import { useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    branch: user?.branch || '',
    section: user?.section || ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 2FA and notifications
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const bgColor = isDarkMode ? '#2d2d2d' : '#fff';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const cardBg = isDarkMode ? '#1e1e1e' : '#f8f9fa';
  const inputBg = isDarkMode ? '#3d3d3d' : '#fff';
  const borderColor = isDarkMode ? '#444' : '#ddd';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [twoFAResponse, notificationsResponse] = await Promise.all([
        apiService.getTwoFactorStatus(),
        apiService.getNotifications()
      ]);
      setTwoFactorEnabled(twoFAResponse.data.twoFactorEnabled);
      setNotifications(notificationsResponse.data);
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.updateProfile(profileForm);
      setSuccess('✅ Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setSuccess('✅ Password changed successfully!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      await apiService.enable2FA();
      setSuccess('OTP sent to your email');
      
      const otp = prompt('Enter OTP from your email:');
      if (otp) {
        await apiService.verify2FA({ otp });
        setTwoFactorEnabled(true);
        setSuccess('✅ Two-factor authentication enabled!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (confirm('Are you sure you want to disable 2FA?')) {
      setLoading(true);
      try {
        await apiService.disable2FA();
        setTwoFactorEnabled(false);
        setSuccess('✅ Two-factor authentication disabled');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to disable 2FA');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmailNotifications = async (enabled) => {
    try {
      await apiService.enableEmailNotifications({ emailNotifications: enabled });
      setEmailNotifications(enabled);
      setSuccess('✅ Notification settings updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update notification settings');
    }
  };

  return (
    <div style={{ backgroundColor: cardBg, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: textColor, marginBottom: '30px' }}>⚙️ Settings</h1>

        {error && <div className="alert alert-error" style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ color: '#155724', backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>{success}</div>}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: `2px solid ${borderColor}`, flexWrap: 'wrap' }}>
          {['profile', 'security', 'notifications', 'display'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? '#fff' : textColor,
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0',
                textTransform: 'capitalize',
                fontWeight: activeTab === tab ? 'bold' : 'normal'
              }}
            >
              {tab === 'profile' && '👤'} {tab === 'security' && '🔐'} {tab === 'notifications' && '🔔'} {tab === 'display' && '🌙'} {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: bgColor, padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2 style={{ color: textColor, marginBottom: '20px' }}>👤 Profile Information</h2>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: textColor, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '6px', backgroundColor: inputBg, color: textColor }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: textColor, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Branch</label>
                <input
                  type="text"
                  name="branch"
                  placeholder="e.g., CSE, ECE"
                  value={profileForm.branch}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '6px', backgroundColor: inputBg, color: textColor }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: textColor, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Section</label>
                <input
                  type="text"
                  name="section"
                  placeholder="e.g., A, B"
                  value={profileForm.section}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '6px', backgroundColor: inputBg, color: textColor }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Updating...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div style={{ backgroundColor: bgColor, padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
            {/* Change Password */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ color: textColor, marginBottom: '20px' }}>🔑 Change Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: textColor, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    style={{ width: '100%', padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '6px', backgroundColor: inputBg, color: textColor }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: textColor, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    style={{ width: '100%', padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '6px', backgroundColor: inputBg, color: textColor }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: textColor, display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    style={{ width: '100%', padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '6px', backgroundColor: inputBg, color: textColor }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Updating...' : '🔄 Change Password'}
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div>
              <h3 style={{ color: textColor, marginBottom: '20px' }}>🔐 Two-Factor Authentication</h3>
              <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '6px', border: `1px solid ${borderColor}` }}>
                <p style={{ color: textColor, marginBottom: '15px' }}>
                  Status: <strong>{twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}</strong>
                </p>
                <p style={{ color: textColor, marginBottom: '20px', fontSize: '14px' }}>
                  Two-factor authentication adds an extra layer of security to your account.
                </p>
                {twoFactorEnabled ? (
                  <button onClick={handleDisable2FA} className="btn btn-danger" disabled={loading}>
                    Disable 2FA
                  </button>
                ) : (
                  <button onClick={handleEnable2FA} className="btn btn-success" disabled={loading}>
                    Enable 2FA
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div style={{ backgroundColor: bgColor, padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ color: textColor, marginBottom: '20px' }}>🔔 Notification Settings</h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: textColor, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => handleEmailNotifications(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span>📧 Email Notifications (Announcements, Milestones)</span>
              </label>
            </div>

            <h3 style={{ color: textColor, marginTop: '30px', marginBottom: '20px' }}>📬 Recent Notifications</h3>
            {notifications.length > 0 ? (
              <div>
                {notifications.slice(0, 10).map(notif => (
                  <div key={notif._id} style={{ backgroundColor: cardBg, padding: '15px', borderRadius: '6px', marginBottom: '10px', borderLeft: `4px solid ${notif.read ? '#ccc' : '#007bff'}` }}>
                    <h4 style={{ color: textColor, margin: '0 0 10px 0' }}>{notif.title}</h4>
                    <p style={{ color: textColor, margin: '0 0 10px 0', fontSize: '14px' }}>{notif.message}</p>
                    <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                      {new Date(notif.sentAt).toLocaleDateString()} {new Date(notif.sentAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: textColor }}>No notifications yet</p>
            )}
          </div>
        )}

        {/* Display Tab */}
        {activeTab === 'display' && (
          <div style={{ backgroundColor: bgColor, padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ color: textColor, marginBottom: '20px' }}>🎨 Display Settings</h3>
            <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '6px', border: `1px solid ${borderColor}` }}>
              <label style={{ color: textColor, display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '16px' }}>
                  {isDarkMode ? '🌙 Dark Mode (Enabled)' : '☀️ Light Mode (Active)'}
                </span>
              </label>
              <p style={{ color: '#666', marginTop: '15px', fontSize: '14px' }}>
                {isDarkMode 
                  ? 'Enjoy the dark theme for better readability in low-light environments.'
                  : 'Use the light theme for better visibility in bright environments.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
