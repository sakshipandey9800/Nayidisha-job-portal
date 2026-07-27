const express = require('express');
const router = express.Router();

router.post('/match-score', async (req, res) => {
  const { skills, jobTitle, jobDescription } = req.body;

  const prompt = `You are a career-matching assistant. Compare this candidate's skills to the job below and respond in STRICT JSON only — no markdown, no extra text.

Candidate skills: ${skills}
Job title: ${jobTitle}
Job description: ${jobDescription}

Return JSON in exactly this format:
{"score": <0-100>, "reasons": ["reason 1", "reason 2"], "missingSkills": ["skill 1"]}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleaned));
  } catch (err) {
    console.error('Match score error:', err.message);
    res.status(500).json({ error: 'Could not calculate match score, please try again' });
  }
});

module.exports = router;