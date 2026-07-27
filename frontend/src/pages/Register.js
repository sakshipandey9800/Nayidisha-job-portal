import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh' }} className="nd-auth-page d-flex align-items-center justify-content-center">
      <div className="card shadow p-4" style={{ maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14.5" stroke="var(--nd-coral)" strokeWidth="2"/>
              <path d="M11 21L21 11M21 11H14M21 11V18" stroke="var(--nd-coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="nd-brand-text fs-4">NayiDisha</span>
          </div>
          <p className="text-muted">Create your account</p>
        </div>

        <div className="d-flex mb-4 gap-2">
          <button
            type="button"
            className={`btn w-50 ${form.role === 'seeker' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setForm({ ...form, role: 'seeker' })}>
            👤 Job Seeker
          </button>
          <button
            type="button"
            className={`btn w-50 ${form.role === 'employer' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setForm({ ...form, role: 'employer' })}>
            🏢 Employer
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <input className="form-control" placeholder="Enter your full name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input type="password" className="form-control" placeholder="Create a password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="alert alert-info py-2">
            Registering as: <strong>{form.role === 'seeker' ? '👤 Job Seeker' : '🏢 Employer'}</strong>
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <hr />
        <p className="text-center mb-0">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}