import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';

const StudentProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.getStudentProfile(id);
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load student profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div>;
  if (error) return <div className="container" style={{ padding: '40px' }}><div className="alert alert-error">{error}</div></div>;
  if (!profile) return null;

  const { student, readinessScore, totalActivities, activityHistory, weakCategories } = profile;

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
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>👤 Student Profile</h1>

      {/* Student Info */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>{student.name}</h2>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Branch:</strong> {student.branch || '-'}</p>
        <p><strong>Section:</strong> {student.section || '-'}</p>
        <p><strong>Registered:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Readiness Score */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>📊 Readiness Score</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: getReadinessColor(readinessScore.status) }}>
              {readinessScore.score}%
            </p>
            <p style={{ color: '#666' }}>{readinessScore.status}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Coding Consistency</p>
            <div style={{ width: '100%', height: '20px', backgroundColor: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${readinessScore.codingConsistency}%`, height: '100%', backgroundColor: '#007bff' }}></div>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>{readinessScore.codingConsistency}%</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Time Spent</p>
            <div style={{ width: '100%', height: '20px', backgroundColor: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${readinessScore.timeScore}%`, height: '100%', backgroundColor: '#28a745' }}></div>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>{readinessScore.timeScore}%</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Aptitude Score</p>
            <div style={{ width: '100%', height: '20px', backgroundColor: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${readinessScore.aptitudeScore}%`, height: '100%', backgroundColor: '#ffc107' }}></div>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>{readinessScore.aptitudeScore}%</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3>📈 Total Activities</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>{totalActivities}</p>
        </div>
        <div className="card">
          <h3>🔥 Coding Days</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff6b6b' }}>{readinessScore.codingDays}</p>
        </div>
      </div>

      {/* Weak Categories */}
      {weakCategories && weakCategories.length > 0 && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>⚠️ Weak Categories (Needs Attention)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Activities</th>
              </tr>
            </thead>
            <tbody>
              {weakCategories.map((cat, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{cat.category}</td>
                  <td style={{ padding: '10px' }}><span className="badge badge-danger">{cat.count} activities</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>📝 Recent Activities</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Time (min)</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {activityHistory.slice(0, 20).map((activity, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{activity.category}</td>
                <td style={{ padding: '10px' }}>{new Date(activity.date).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>{activity.timeSpent}</td>
                <td style={{ padding: '10px' }}>
                  <span className={`badge badge-${activity.difficultyLevel === 'hard' ? 'danger' : activity.difficultyLevel === 'medium' ? 'warning' : 'success'}`}>
                    {activity.difficultyLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProfile;
