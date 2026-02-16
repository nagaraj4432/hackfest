import { useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';
import ThemeContext from '../context/ThemeContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiService.getWeeklyDashboard();
        setDashboard(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Dark mode colors
  const bgColor = isDarkMode ? '#1e1e1e' : '#f8f9fa';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const cardBgColor = isDarkMode ? '#2d2d2d' : '#fff';
  const cardBorderColor = isDarkMode ? '#444' : '#ddd';
  const labelColor = isDarkMode ? '#b0b0b0' : '#666';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: textColor }}><h2>Loading...</h2></div>;
  if (error) return <div className="container" style={{ padding: '40px' }}><div className="alert alert-error">{error}</div></div>;
  if (!dashboard) return null;

  const chartData = {
    labels: Object.keys(dashboard.dailyData),
    datasets: [
      {
        label: 'Hours Spent',
        data: Object.values(dashboard.dailyData).map(d => d.totalTime / 60),
        borderColor: isDarkMode ? '#64b5f6' : '#007bff',
        backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : 'rgba(0, 123, 255, 0.1)',
        tension: 0.4
      }
    ]
  };

  const categoryChartData = {
    labels: Object.keys(dashboard.categoryData),
    datasets: [
      {
        label: 'Time Spent (hours)',
        data: Object.values(dashboard.categoryData).map(c => c.totalTime / 60),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
        ]
      }
    ]
  };

  const getReadinessColor = (status) => {
    switch(status) {
      case 'Placement Ready': return '#28a745';
      case 'Almost Ready': return '#ffc107';
      case 'In Progress': return '#17a2b8';
      case 'Just Started': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: bgColor, color: textColor, transition: 'all 0.3s ease' }}>
      <h1 style={{ marginBottom: '30px', color: textColor }}>📊 Your Progress Dashboard</h1>

      {/* Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', backgroundColor: cardBgColor, borderRadius: '8px', border: `1px solid ${cardBorderColor}`, transition: 'all 0.3s ease' }}>
          <h3 style={{ color: textColor }}>🔥 Streak</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b' }}>{dashboard.streak} Days</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: cardBgColor, borderRadius: '8px', border: `1px solid ${cardBorderColor}`, transition: 'all 0.3s ease' }}>
          <h3 style={{ color: textColor }}>⏱️ Total Hours This Week</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#4ecdc4' }}>{dashboard.totalHours.toFixed(1)} hrs</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: cardBgColor, borderRadius: '8px', border: `1px solid ${cardBorderColor}`, transition: 'all 0.3s ease' }}>
          <h3 style={{ color: textColor }}>📈 Total Activities</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#45b7d1' }}>{dashboard.totalActivities}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: cardBgColor, borderRadius: '8px', border: `1px solid ${cardBorderColor}`, transition: 'all 0.3s ease' }}>
          <h3 style={{ color: textColor }}>📍 Readiness Score</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: getReadinessColor(dashboard.readinessScore.status) }}>
            {dashboard.readinessScore.score}%
          </p>
          <p style={{ color: labelColor, fontSize: '14px' }}>{dashboard.readinessScore.status}</p>
        </div>
      </div>

      {/* Readiness Score Details */}
      <div style={{ padding: '20px', backgroundColor: cardBgColor, borderRadius: '8px', border: `1px solid ${cardBorderColor}`, marginBottom: '40px', transition: 'all 0.3s ease' }}>
        <h2 style={{ marginBottom: '20px', color: textColor }}>📊 Readiness Score Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ fontSize: '12px', color: labelColor, marginBottom: '5px' }}>Coding Consistency</p>
            <div style={{ width: '100%', height: '20px', backgroundColor: isDarkMode ? '#444' : '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${dashboard.readinessScore.codingConsistency}%`, height: '100%', backgroundColor: '#007bff' }}></div>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px', color: textColor }}>{dashboard.readinessScore.codingConsistency}%</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: labelColor, marginBottom: '5px' }}>Time Spent</p>
            <div style={{ width: '100%', height: '20px', backgroundColor: isDarkMode ? '#444' : '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${dashboard.readinessScore.timeScore}%`, height: '100%', backgroundColor: '#28a745' }}></div>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px', color: textColor }}>{dashboard.readinessScore.timeScore}%</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: labelColor, marginBottom: '5px' }}>Aptitude Score</p>
            <div style={{ width: '100%', height: '20px', backgroundColor: isDarkMode ? '#444' : '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${dashboard.readinessScore.aptitudeScore}%`, height: '100%', backgroundColor: '#ffc107' }}></div>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px', color: textColor }}>{dashboard.readinessScore.aptitudeScore}%</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: labelColor, marginBottom: '5px' }}>Mock Interviews</p>
            <div style={{ width: '100%', height: '20px', backgroundColor: isDarkMode ? '#444' : '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${dashboard.readinessScore.mockScore}%`, height: '100%', backgroundColor: '#17a2b8' }}></div>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px', color: textColor }}>{dashboard.readinessScore.mockScore}%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', backgroundColor: cardBgColor, borderRadius: '8px', border: `1px solid ${cardBorderColor}`, transition: 'all 0.3s ease' }}>
          <h3 style={{ color: textColor }}>📅 Daily Consistency</h3>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div style={{ padding: '20px', backgroundColor: cardBgColor, borderRadius: '8px', border: `1px solid ${cardBorderColor}`, transition: 'all 0.3s ease' }}>
          <h3 style={{ color: textColor }}>📚 Category Breakdown</h3>
          <Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
