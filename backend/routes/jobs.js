const router = require('express').Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  const { search, category, location, is_returnship } = req.query;
  let query = 'SELECT jobs.*, users.name as employer_name FROM jobs JOIN users ON jobs.employer_id = users.id WHERE 1=1';
  const params = [];
  if (search) { query += ' AND title LIKE ?'; params.push(`%${search}%`); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (location) { query += ' AND location LIKE ?'; params.push(`%${location}%`); }
  if (is_returnship === 'true') { query += ' AND is_returnship = true'; }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(results);
  });
});

router.post('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Employers only' });
  const { title, description, location, category, salary, is_returnship } = req.body;
  db.query(
    'INSERT INTO jobs (employer_id, title, description, location, category, salary, is_returnship) VALUES (?,?,?,?,?,?,?)',
    [req.user.id, title, description, location, category, salary, is_returnship || false],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Job posted!', jobId: result.insertId });
    }
  );
});

router.get('/:id', (req, res) => {
  db.query(
    'SELECT jobs.*, users.name as employer_name FROM jobs JOIN users ON jobs.employer_id = users.id WHERE jobs.id = ?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(results[0]);
    }
  );
});

module.exports = router;