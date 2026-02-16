import { useState } from 'react';
import { apiService } from '../services/api';

const ActivityLogger = () => {
  const [formData, setFormData] = useState({
    category: 'coding',
    timeSpent: '',
    difficultyLevel: 'medium',
    notes: '',
    problemsSolved: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'coding', label: '💻 Coding Practice' },
    { value: 'aptitude', label: '🧠 Aptitude' },
    { value: 'os', label: '🖥️ Operating Systems' },
    { value: 'dbms', label: '🗄️ Database Management' },
    { value: 'cn', label: '🌐 Computer Networks' },
    { value: 'oops', label: '📦 Object Oriented Programming' },
    { value: 'softskills', label: '🎤 Soft Skills' },
    { value: 'mock_interview', label: '🎯 Mock Interview' },
    { value: 'contest', label: '🏆 Contest' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        timeSpent: parseInt(formData.timeSpent),
        problemsSolved: formData.problemsSolved ? parseInt(formData.problemsSolved) : 0
      };

      await apiService.logActivity(submitData);
      setSuccess('✅ Activity logged successfully!');
      setFormData({
        category: 'coding',
        timeSpent: '',
        difficultyLevel: 'medium',
        notes: '',
        problemsSolved: '',
        date: new Date().toISOString().split('T')[0]
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>📝 Log Your Activity</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Time Spent (minutes)</label>
            <input
              type="number"
              name="timeSpent"
              placeholder="e.g., 60"
              value={formData.timeSpent}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty Level</label>
            <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange}>
              <option value="easy">😊 Easy</option>
              <option value="medium">😐 Medium</option>
              <option value="hard">😤 Hard</option>
            </select>
          </div>

          {formData.category === 'coding' && (
            <div className="form-group">
              <label>Problems Solved</label>
              <input
                type="number"
                name="problemsSolved"
                placeholder="Number of problems"
                value={formData.problemsSolved}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="What did you practice? Any challenges?"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-success" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging...' : '✅ Log Activity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivityLogger;
