import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', category: '', salary: '', is_returnship: false });
  const [msg, setMsg] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const res = await API.get('/jobs');
    setJobs(res.data.filter(j => j.employer_id === user.id));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', form);
      setMsg('✅ Job posted!');
      fetchJobs();
      setForm({ title: '', description: '', location: '', category: '', salary: '', is_returnship: false });
    } catch { setMsg('Error posting job'); }
  };

  const viewApplicants = async (jobId) => {
    setSelectedJob(jobId);
    const res = await API.get(`/applications/job/${jobId}`);
    setApplicants(res.data);
  };

  const updateStatus = async (appId, status) => {
    await API.patch(`/applications/${appId}/status`, { status });
    viewApplicants(selectedJob);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Employer Dashboard</h2>
        <div>
          <Link to="/jobs" className="btn btn-outline-secondary me-2">Browse Jobs</Link>
          <button className="btn btn-outline-danger" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Post a New Job</h5>
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={handlePost}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <input className="form-control" placeholder="Job Title" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-6 mb-2">
                <input className="form-control" placeholder="Location" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="col-md-6 mb-2">
                <select className="form-control" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div className="col-md-6 mb-2">
                <input className="form-control" placeholder="Salary (e.g. 5-8 LPA)" value={form.salary}
                  onChange={e => setForm({ ...form, salary: e.target.value })} />
              </div>
              <div className="col-12 mb-2">
                <textarea className="form-control" placeholder="Job Description" rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="col-12 mb-2">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" checked={form.is_returnship}
                    onChange={e => setForm({ ...form, is_returnship: e.target.checked })} />
                  <label className="form-check-label">Mark as Returnship Friendly</label>
                </div>
              </div>
            </div>
            <button className="btn btn-primary">Post Job</button>
          </form>
        </div>
      </div>

      <h5>Your Posted Jobs</h5>
      {jobs.map(job => (
        <div className="card mb-2" key={job.id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6>{job.title}</h6>
              <small>{job.location} | {job.category}</small>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={() => viewApplicants(job.id)}>
              View Applicants
            </button>
          </div>
        </div>
      ))}

      {selectedJob && (
        <div className="mt-4">
          <h5>Applicants</h5>
          {applicants.length === 0 && <p className="text-muted">No applicants yet.</p>}
          {applicants.map(app => (
            <div className="card mb-2" key={app.id}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <strong>{app.name}</strong> — {app.email}
                  <br /><span className="badge bg-secondary">{app.status}</span>
                </div>
                <div>
                  <button className="btn btn-success btn-sm me-1" onClick={() => updateStatus(app.id, 'shortlisted')}>Shortlist</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}