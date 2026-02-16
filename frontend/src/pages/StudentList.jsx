import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const params = {};
        if (branch) params.branch = branch;
        if (section) params.section = section;

        const response = await apiService.getAllStudents(params);
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (err) {
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [branch, section]);

  const uniqueBranches = [...new Set(students.map(s => s.branch).filter(Boolean))];
  const uniqueSections = [...new Set(students.map(s => s.section).filter(Boolean))];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div>;
  if (error) return <div className="container" style={{ padding: '40px' }}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>👨‍🎓 Student List</h1>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Branch</label>
            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
              <option value="">All Branches</option>
              {uniqueBranches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Section</label>
            <select value={section} onChange={(e) => setSection(e.target.value)}>
              <option value="">All Sections</option>
              {uniqueSections.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Total Students: {filteredStudents.length}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Branch</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Section</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student._id} style={{ borderBottom: '1px solid #eee', hover: true }}>
                <td style={{ padding: '15px' }}>{student.name}</td>
                <td style={{ padding: '15px' }}>{student.email}</td>
                <td style={{ padding: '15px' }}>{student.branch || '-'}</td>
                <td style={{ padding: '15px' }}>{student.section || '-'}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => navigate(`/admin/student/${student._id}`)}
                  >
                    👁️ View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
