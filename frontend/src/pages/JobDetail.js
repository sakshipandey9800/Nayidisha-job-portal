import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [msg, setMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState(localStorage.getItem('candidateSkills') || '');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchError, setMatchError] = useState('');

  useEffect(() => {
    API.get(`/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await API.post('/applications', { job_id: id });
      setMsg('✅ Applied successfully!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Already applied or error.');
    }
  };

  const handleCheckFit = async () => {
    if (!skills.trim()) {
      setMatchError('Please enter a few of your skills first.');
      return;
    }
    localStorage.setItem('candidateSkills', skills);
    setMatchError('');
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const res = await API.post('/match-score', {
        skills,
        jobTitle: job.title,
        jobDescription: job.description
      });
      setMatchResult(res.data);
    } catch (err) {
      setMatchError('Could not check fit right now, please try again.');
    }
    setMatchLoading(false);
  };

  if (!job) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: 700 }}>
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/jobs')}>← Back</button>
      <h2>{job.title}</h2>
      <p className="text-muted">Posted by: {job.employer_name}</p>
      <hr />
      <p>📍 <strong>Location:</strong> {job.location}</p>
      <p>💰 <strong>Salary:</strong> {job.salary}</p>
      <p>🏷️ <strong>Category:</strong> {job.category}</p>
      {!!job.is_returnship && <span className="badge bg-success mb-3">Returnship Friendly</span>}
      <h5 className="mt-3">Job Description</h5>
      <p>{job.description}</p>

      {user?.role === 'seeker' && (
        <div className="nd-ai-box mb-3">
          <label className="form-label mb-2 fw-bold"> Check how well you match this role</label>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Your skills, e.g. React, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={handleCheckFit} disabled={matchLoading}>
              {matchLoading ? 'Checking...' : 'Check My Fit'}
            </button>
          </div>
          {matchError && <small className="text-danger">{matchError}</small>}

          {matchResult && (
            <div className="mt-2">
              <strong>{matchResult.score}% Match</strong>
              <div className="progress mb-2 mt-1" style={{ height: 8 }}>
                <div className="progress-bar" style={{ width: `${matchResult.score}%`, backgroundColor: 'var(--nd-coral)' }} />
              </div>
              <ul className="mb-1 ps-3">
                {matchResult.reasons?.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              {matchResult.missingSkills?.length > 0 && (
                <small className="text-warning">
                  Consider learning: {matchResult.missingSkills.join(', ')}
                </small>
              )}
            </div>
          )}
        </div>
      )}

      {msg && <div className="alert alert-info">{msg}</div>}
      {user?.role === 'seeker' && (
        <button className="btn btn-primary w-100 mt-3" onClick={handleApply}>Apply Now</button>
      )}
      {!user && (
        <button className="btn btn-primary w-100 mt-3" onClick={() => navigate('/login')}>Login to Apply</button>
      )}
    </div>
  );
}