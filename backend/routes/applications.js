const router = require('express').Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Apply for a job
router.post('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Seekers only' });
  const { job_id } = req.body;
  db.query(
    'INSERT INTO applications (job_id, seeker_id) VALUES (?,?)',
    [job_id, req.user.id],
    (err) => {
      if (err) return res.status(400).json({ message: 'Already applied' });
      res.json({ message: 'Applied successfully!' });
    }
  );
});

// Seeker: see my applications
router.get('/my', authMiddleware, (req, res) => {
  db.query(
    'SELECT applications.*, jobs.title FROM applications JOIN jobs ON applications.job_id = jobs.id WHERE seeker_id = ?',
    [req.user.id], (err, results) => res.json(results)
  );
});

// Employer: see applicants for their job
router.get('/job/:jobId', authMiddleware, (req, res) => {
  db.query(
    'SELECT applications.*, users.name, users.email FROM applications JOIN users ON applications.seeker_id = users.id WHERE job_id = ?',
    [req.params.jobId], (err, results) => res.json(results)
  );
});

// Employer: update application status
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body; // 'shortlisted', 'rejected', 'selected'
  db.query('UPDATE applications SET status = ? WHERE id = ?',
    [status, req.params.id], () => res.json({ message: 'Status updated!' }));
});

module.exports = router;