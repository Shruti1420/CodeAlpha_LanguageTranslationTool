// server.js
// A tiny backend whose only job is to keep the Gemini API key out of the
// browser. The frontend calls OUR /api/translate endpoint; this server is
// the only thing that ever talks to Google, using the key loaded from
// .env (never sent to the client). We use Gemini's generateContent to do
// the translation via a prompt.

require('dotenv').config();
const dns = require('dns');
const express = require('express');
const path = require('path');

// Fix for Windows machines where IPv6 routes to Google time out —
// prefer IPv4 when resolving hostnames like generativelanguage.googleapis.com
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

const LANGUAGE_NAMES = {
  auto: 'the source language (detect it automatically)',
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  zh: 'Chinese',
  ar: 'Arabic'
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/translate', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY in .env' });
  }

  const { text, source, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: '"text" and "target" are required' });
  }

  const sourceName = LANGUAGE_NAMES[source] || source;
  const targetName = LANGUAGE_NAMES[target] || target;

  const prompt = `Translate the following text from ${sourceName} to ${targetName}. ` +
    `Respond with ONLY the translated text and nothing else — no quotes, no explanation, no labels.\n\nText: ${text}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || `Gemini API request failed (${response.status})`;
      return res.status(response.status).json({ error: message });
    }

    const translatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!translatedText) {
      return res.status(502).json({ error: 'Gemini returned an empty response' });
    }

    res.json({ translatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Translator server running at http://localhost:${PORT}`);
});