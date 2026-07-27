const express = require('express');
const router = express.Router();

router.post('/resume-builder', async (req, res) => {
  const { rawNotes } = req.body;

  if (!rawNotes || !rawNotes.trim()) {
    return res.status(400).json({ error: 'Please share some details first.' });
  }

  const prompt = `You are a professional resume writer. Based on the candidate's rough notes below, produce STRICT JSON only — no markdown, no extra text — in exactly this format:
{"summary": "a polished 2-3 sentence professional summary", "bullets": ["strong resume bullet 1", "strong resume bullet 2", "..."]}

Rules: Use strong action verbs, keep bullets concise (one line each), include 4-6 bullets, and quantify impact wherever the notes give you a hint of scale (numbers, team size, percentage, etc). Do not invent facts not implied by the notes.

Candidate's rough notes:
${rawNotes}`;

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
    console.log('Gemini raw response:', JSON.stringify(data));

    if (data.error) {
        return res.status(503).json({ error: 'AI is a bit busy right now — please try again in a few seconds.' });
        }
    console.log('Gemini raw response:', JSON.stringify(data));
    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleaned));
  } catch (err) {
    console.error('Resume builder error:', err.message);
    res.status(500).json({ error: 'Could not generate resume content, please try again' });
  }
});

module.exports = router;