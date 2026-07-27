import { useState } from 'react';
import API from '../api/axios';

export default function ResumeBuilder() {
  const [rawNotes, setRawNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!rawNotes.trim()) {
      setError('Please type a few details about your experience first.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post('/resume-builder', { rawNotes });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong, please try again.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    const text = `${result.summary}\n\n${result.bullets.map(b => `• ${b}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 700 }}>
      <h2> AI Resume Builder</h2>
      <p className="text-muted">
        Type your role, skills, and a few achievements in your own words — we'll turn it into polished resume content.
      </p>

      <textarea
        className="form-control mb-2"
        rows={6}
        placeholder="e.g. I worked as a backend intern for 2 months, built REST APIs with Node and Express, fixed bugs, worked with a team of 4, used Git for version control..."
        value={rawNotes}
        onChange={(e) => setRawNotes(e.target.value)}
      />

      <button className="btn btn-primary mb-3" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Resume Content'}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card p-3 bg-light border-0">
          <h5>Professional Summary</h5>
          <p>{result.summary}</p>
          <h5>Resume Bullets</h5>
          <ul>
            {result.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleCopy} style={{ width: 'fit-content' }}>
            {copied ? '✅ Copied!' : '📋 Copy to clipboard'}
          </button>
        </div>
      )}
    </div>
  );
}