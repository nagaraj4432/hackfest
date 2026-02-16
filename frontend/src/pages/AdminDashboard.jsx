import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [announcement, setAnnouncement] = useState({ title: '', description: '', type: 'other', important: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleAnnouncementChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnnouncement(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createAnnouncement(announcement);
      setSuccess('✅ Announcement posted!');
      setAnnouncement({ title: '', description: '', type: 'other', important: false });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post announcement');
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await apiService.exportStudentReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Failed to export report');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div>;

  return (
    <div className="container" style={{ padding: '8px 5px', maxWidth: '1000px' }}>
      <h1 style={{ marginBottom: '8px', color: '#333', fontSize: '18px' }}>👨‍🏫 Admin Dashboard</h1>

      {error && <div className="alert alert-error" style={{ padding: '6px', fontSize: '11px' }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ padding: '6px', fontSize: '11px' }}>{success}</div>}

      {/* Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '12px' }}>
        <div className="card" style={{ padding: '8px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 4px 0' }}>👥 Total</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', margin: '0' }}>{stats?.totalStudents || 0}</p>
        </div>
        <div className="card" style={{ padding: '8px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 4px 0' }}>✅ Active</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745', margin: '0' }}>{stats?.activeStudents || 0}</p>
        </div>
        <div className="card" style={{ padding: '8px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 4px 0' }}>📊 Avg</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffc107', margin: '0' }}>{stats?.averageReadinessScore || 0}%</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '12px' }}>
        {stats?.readinessDistribution && (
          <div className="card" style={{ padding: '12px' }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>📈 Readiness Distribution</h3>
            <Pie 
              data={{
                labels: Object.keys(stats.readinessDistribution),
                datasets: [{
                  data: Object.values(stats.readinessDistribution),
                  backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#fd7e14', '#6c757d']
                }]
              }}
              options={{ responsive: true, maintainAspectRatio: true }}
            />
          </div>
        )}
      </div>

      {/* Top Performers */}
      <div className="card" style={{ marginBottom: '15px', padding: '12px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>🏆 Top 10 Performers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '6px', textAlign: 'left', fontSize: '12px' }}>Name</th>
              <th style={{ padding: '6px', textAlign: 'left', fontSize: '12px' }}>Readiness Score</th>
            </tr>
          </thead>
          <tbody>
            {stats?.topPerformers?.map((student, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '6px', fontSize: '12px' }}>{student.name}</td>
                <td style={{ padding: '6px', fontSize: '12px' }}><span className="badge badge-success">{student.score.score}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Consistency Students */}
      <div className="card" style={{ marginBottom: '15px', padding: '12px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>⚠️ Students Needing Attention (Low Consistency)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '6px', textAlign: 'left', fontSize: '12px' }}>Name</th>
              <th style={{ padding: '6px', textAlign: 'left', fontSize: '12px' }}>Consistency</th>
              <th style={{ padding: '6px', textAlign: 'left', fontSize: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.lowConsistencyStudents?.map((student, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '6px', fontSize: '12px' }}>{student.name}</td>
                <td style={{ padding: '6px', fontSize: '12px' }}>{student.score.codingConsistency}%</td>
                <td style={{ padding: '6px', fontSize: '12px' }}><span className="badge badge-danger">{student.score.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Post Announcement */}
      <div className="card" style={{ marginBottom: '15px', padding: '12px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>📢 Post Announcement</h3>
        <form onSubmit={handleAnnouncementSubmit}>
          <div className="form-group">
            <label style={{ fontSize: '12px' }}>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Announcement title"
              value={announcement.title}
              onChange={handleAnnouncementChange}
              required
              style={{ padding: '6px', fontSize: '12px' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px' }}>Description</label>
            <textarea
              name="description"
              placeholder="Announcement details"
              value={announcement.description}
              onChange={handleAnnouncementChange}
              rows="3"
              required
              style={{ padding: '6px', fontSize: '12px' }}
            ></textarea>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px' }}>Type</label>
            <select name="type" value={announcement.type} onChange={handleAnnouncementChange} style={{ padding: '6px', fontSize: '12px' }}>
              <option value="other">General</option>
              <option value="placement_drive">🏢 Placement Drive</option>
              <option value="test">📝 Test</option>
              <option value="interview_schedule">📅 Interview Schedule</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px' }}>
              <input
                type="checkbox"
                name="important"
                checked={announcement.important}
                onChange={handleAnnouncementChange}
              />
              {' '} Mark as Important
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginRight: '10px', padding: '6px 12px', fontSize: '12px' }}>
            📤 Post Announcement
          </button>
          <button type="button" className="btn btn-success" onClick={handleExportReport} style={{ padding: '6px 12px', fontSize: '12px' }}>
            📥 Export Report (CSV)
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
