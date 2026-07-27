import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const categoryIcons = {
  IT: '💻',
  Marketing: '📣',
  Finance: '💰',
  HR: '🧑‍💼',
  Design: '🎨',
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [returnshipOnly, setReturnshipOnly] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const res = await API.get('/jobs', {
      params: { search, category, location, is_returnship: returnshipOnly ? 'true' : '' }
    });
    setJobs(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ background: 'var(--nd-bg)', minHeight: '100vh' }}>
      <nav className="navbar navbar-dark nd-navbar shadow-sm px-4">
        <span className="navbar-brand fs-4 d-flex align-items-center gap-2">
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14.5" stroke="var(--nd-coral)" strokeWidth="2"/>
          <path d="M11 21L21 11M21 11H14M21 11V18" stroke="var(--nd-coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="nd-brand-text">NayiDisha</span>
      </span>
        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <span className="text-muted">Hi, <strong>{user.name}</strong> ({user.role})</span>
              {user.role === 'seeker' && <Link to="/my-applications" className="btn btn-outline-primary btn-sm">My Applications</Link>}
              {user.role === 'employer' && <Link to="/employer/dashboard" className="btn btn-outline-primary btn-sm">Dashboard</Link>}
              <Link to="/returnship" className="btn btn-outline-success btn-sm">Returnship</Link>
              {user.role === 'seeker' && <Link to="/resume-builder" className="btn btn-outline-warning btn-sm">Resume Builder</Link>}
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="container mt-4">
        <div className="nd-hero">
          <h1>Find work that fits your story</h1>
          <p>Verified employers, transparent pay, and returnship-friendly roles for a fresh start.</p>
        </div>

        <div className="card shadow-sm p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <input className="form-control" placeholder="🔍 Search job title..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="col-md-3">
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="📍 Location..."
                value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={fetchJobs}>Search</button>
            </div>
          </div>
          <div className="mt-2">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" checked={returnshipOnly}
                onChange={e => setReturnshipOnly(e.target.checked)} />
              <label className="form-check-label">Show Returnship Friendly jobs only</label>
            </div>
          </div>
        </div>

        <div className="row">
          {jobs.length === 0 && (
            <div className="text-center text-muted mt-5">
              <h5>No jobs found. Try different filters.</h5>
            </div>
          )}
          {jobs.map(job => (
            <div className="col-md-4 mb-3" key={job.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="nd-icon-badge">{categoryIcons[job.category] || '💼'}</div>
                  <h5 className="card-title">{job.title}</h5>
                  <p className="text-muted mb-1">🏢 {job.employer_name}</p>
                  <p className="mb-1">📍 {job.location}</p>
                  <p className="mb-2">💰 {job.salary}</p>
                  <span className="badge bg-secondary me-1">{job.category}</span>
                  {!!job.is_returnship && <span className="badge bg-success">Returnship Friendly</span>}
                </div>
                <div className="card-footer bg-white">
                  <Link to={`/jobs/${job.id}`} className="btn btn-primary w-100">View & Apply</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}