import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    API.get('/applications/my').then(res => setApplications(Array.isArray(res.data) ? res.data : []));
  }, []);
  
  const statusColor = (status) => {
    if (status === 'selected') return 'success';
    if (status === 'shortlisted') return 'primary';
    if (status === 'rejected') return 'danger';
    return 'secondary';
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>My Applications</h2>
        <Link to="/jobs" className="btn btn-outline-secondary">← Back to Jobs</Link>
      </div>
      {applications.length === 0 && <p className="text-muted">You haven't applied to any jobs yet.</p>}
      <div className="row">
        {applications.map(app => (
          <div className="col-md-6 mb-3" key={app.id}>
            <div className="card">
              <div className="card-body">
                <h5>{app.title}</h5>
                <p>Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                <span className={`badge bg-${statusColor(app.status)}`}>{app.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}