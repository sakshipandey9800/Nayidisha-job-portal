require('dotenv').config();

async function testGemini() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hello in one short sentence.' }] }]
      })
    }
  );
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testGemini();