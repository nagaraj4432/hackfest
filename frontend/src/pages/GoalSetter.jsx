import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const GoalSetter = () => {
  const [goals, setGoals] = useState(null);
  const [formData, setFormData] = useState({
    codingGoal: 20,
    aptitudeGoal: 10,
    mockInterviewGoal: 2,
    coreSubjectsGoal: 5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await apiService.getWeeklyGoals();
        setGoals(response.data);
        setFormData({
          codingGoal: response.data.codingGoal.target,
          aptitudeGoal: response.data.aptitudeGoal.target,
          mockInterviewGoal: response.data.mockInterviewGoal.target,
          coreSubjectsGoal: response.data.coreSubjectsGoal.target
        });
      } catch (err) {
        setError('Failed to load goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await apiService.setWeeklyGoals(formData);
      setSuccess('✅ Goals set successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set goals');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div>;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '700px' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>🎯 Weekly Goals</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Set Your Weekly Targets</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>💻 Coding Problems Goal (per week)</label>
            <input
              type="number"
              name="codingGoal"
              value={formData.codingGoal}
              onChange={handleChange}
              min="1"
              required
            />
            <small style={{ color: '#666' }}>Target number of coding problems</small>
          </div>

          <div className="form-group">
            <label>🧠 Aptitude Study Hours Goal (per week)</label>
            <input
              type="number"
              name="aptitudeGoal"
              value={formData.aptitudeGoal}
              onChange={handleChange}
              min="1"
              required
            />
            <small style={{ color: '#666' }}>Target hours for aptitude practice</small>
          </div>

          <div className="form-group">
            <label>🎤 Mock Interviews Goal (per week)</label>
            <input
              type="number"
              name="mockInterviewGoal"
              value={formData.mockInterviewGoal}
              onChange={handleChange}
              min="1"
              required
            />
            <small style={{ color: '#666' }}>Target number of mock interviews</small>
          </div>

          <div className="form-group">
            <label>📚 Core Subjects Study Hours (per week)</label>
            <input
              type="number"
              name="coreSubjectsGoal"
              value={formData.coreSubjectsGoal}
              onChange={handleChange}
              min="1"
              required
            />
            <small style={{ color: '#666' }}>Target hours for OS, DBMS, CN, OOPS</small>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            💾 Save Goals
          </button>
        </form>
      </div>

      {goals && (
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>📊 Progress Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>💻 Coding</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {goals.codingGoal.completed}/{goals.codingGoal.target}
              </p>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(goals.codingGoal.completed / goals.codingGoal.target) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#007bff' 
                }}></div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>🧠 Aptitude</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {goals.aptitudeGoal.completed}/{goals.aptitudeGoal.target}
              </p>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(goals.aptitudeGoal.completed / goals.aptitudeGoal.target) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#28a745' 
                }}></div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>🎤 Mock</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {goals.mockInterviewGoal.completed}/{goals.mockInterviewGoal.target}
              </p>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(goals.mockInterviewGoal.completed / goals.mockInterviewGoal.target) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#ffc107' 
                }}></div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>📚 Core</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                {goals.coreSubjectsGoal.completed}/{goals.coreSubjectsGoal.target}
              </p>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(goals.coreSubjectsGoal.completed / goals.coreSubjectsGoal.target) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#17a2b8' 
                }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSetter;
