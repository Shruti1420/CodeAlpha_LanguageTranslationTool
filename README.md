# Translate

A modern, minimal language translation app. Type text, pick a source and target language, and get an instant translation — powered by the Gemini API, with the API key kept safely on the server and never exposed to the browser.

![Node](https://img.shields.io/badge/node-%3E%3D18-3ecfb2)
![Express](https://img.shields.io/badge/express-4.x-f2a65a)

## Features

- 🌐 Translate between 8 languages, with auto-detect for the source language
- 🔒 API key stored server-side in `.env` — never shipped to the client
- ⚡ Powered by Google's Gemini API (`gemini-2.5-flash`)
- 🔁 Automatic retry with backoff if Gemini is temporarily overloaded
- 📋 One-click copy of the translated text
- 🔊 Text-to-speech playback of the translation (uses the browser's built-in speech synthesis — no extra API)
- 🎨 Custom UI with an animated "current" that flows between panes while translating

## Tech stack

| Layer    | Tech                                  |
|----------|----------------------------------------|
| Frontend | HTML, CSS, vanilla JavaScript          |
| Backend  | Node.js, Express                       |
| AI       | Gemini API (`generateContent`)         |
| Config   | dotenv                                 |

## Project structure
translator-app/
├── server.js          # Express server — the only thing that talks to Gemini
├── .env.example        # Template for your environment variables
├── .gitignore
├── package.json
└── public/
└── index.html      # Frontend UI

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd translator-app
npm install
```

### 2. Get a Gemini API key

Create a free key at [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Set up your environment variables

Copy the example file and add your key:

```bash
cp .env.example .env
```

Then open `.env` and fill in:
**give me code of the file u making chnagesHere's the full public/index.html — replace your existing file with this entire thing:Get final index.html to share with userGet final index.html to share with userhtml<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Translate</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-0: #0d0e18;
    --panel: #ffffff0d;
    --panel-solid: #1a1c2b;
    --line: #ffffff17;
    --line-strong: #ffffff2b;
    --ink: #eef0f8;
    --muted: #8b8fa3;
    --amber: #f2a65a;
    --teal: #3ecfb2;
    --gradient: linear-gradient(135deg, var(--amber), var(--teal));
    --font-display: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(circle at 15% 10%, #2a2450 0%, transparent 45%),
      radial-gradient(circle at 85% 90%, #1a3a3a 0%, transparent 45%),
      var(--bg-0);
    color: var(--ink);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 56px 20px;
  }

  header {
    text-align: center;
    margin-bottom: 40px;
  }

  header .eyebrow {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--teal);
  }

  header h1 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 44px;
    margin: 10px 0 0;
    letter-spacing: -0.01em;
  }

  header p {
    color: var(--muted);
    font-size: 15px;
    margin: 10px 0 0;
  }

  .app {
    width: 100%;
    max-width: 960px;
    background: var(--panel);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--line);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 30px 80px -30px #00000090;
  }

  .lang-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    border-bottom: 1px solid var(--line);
  }

  .lang-select-wrap {
    padding: 18px 24px;
  }

  .lang-select-wrap label {
    display: block;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .select-shell {
    position: relative;
  }

  select {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background: transparent;
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 500;
    color: var(--ink);
    padding: 4px 20px 4px 0;
    cursor: pointer;
  }

  select option {
    background: var(--panel-solid);
    color: var(--ink);
  }

  .select-shell::after {
    content: '';
    position: absolute;
    right: 2px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--muted);
    border-bottom: 2px solid var(--muted);
    transform: translateY(-70%) rotate(45deg);
    pointer-events: none;
  }

  select:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 4px;
    border-radius: 4px;
  }

  .swap-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid var(--line-strong);
    background: var(--panel-solid);
    color: var(--teal);
    font-size: 17px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.35s cubic-bezier(.2,.8,.2,1), background 0.2s ease, border-color 0.2s ease;
  }

  .swap-btn:hover {
    border-color: var(--teal);
    background: #ffffff10;
  }

  .swap-btn.spun { transform: rotate(180deg); }
  .swap-btn:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }

  .panes {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* the animated "current" running down the middle */
  .panes::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: var(--line);
    transform: translateX(-50%);
  }

  .current {
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: 100%;
    transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, var(--teal), var(--amber), transparent);
    background-size: 100% 200%;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .current.active {
    opacity: 1;
    animation: flow 1.4s linear infinite;
  }

  @keyframes flow {
    0% { background-position: 0 0; }
    100% { background-position: 0 100%; }
  }

  .pane {
    padding: 26px 28px 20px;
    position: relative;
  }

  textarea, .output-text {
    width: 100%;
    min-height: 230px;
    border: none;
    resize: none;
    font-family: var(--font-body);
    font-size: 17px;
    line-height: 1.6;
    color: var(--ink);
    background: transparent;
  }

  textarea::placeholder {
    color: var(--muted);
  }

  textarea:focus { outline: none; }

  .output-text.placeholder {
    color: var(--muted);
  }

  .char-count {
    position: absolute;
    bottom: 20px;
    left: 28px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
  }

  .pane-actions {
    position: absolute;
    bottom: 18px;
    right: 24px;
    display: flex;
    gap: 8px;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    border: 1px solid var(--line-strong);
    background: #ffffff08;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    font-size: 15px;
  }

  .icon-btn:hover {
    color: var(--ink);
    border-color: var(--teal);
    background: #ffffff10;
  }

  .icon-btn.on {
    color: var(--teal);
    border-color: var(--teal);
  }

  .icon-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .icon-btn:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }

  .actions-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    padding: 18px 24px;
    border-top: 1px solid var(--line);
    background: #ffffff05;
  }

  .status {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    margin-right: auto;
  }

  .status.error { color: #ff8a8a; }

  button.primary {
    background: var(--gradient);
    color: #14162b;
    border: none;
    padding: 13px 30px;
    border-radius: 10px;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 8px 24px -8px #f2a65a55;
  }

  button.primary:hover { transform: translateY(-1px); box-shadow: 0 10px 28px -8px #3ecfb266; }
  button.primary:active { transform: translateY(0); }
  button.primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  button.primary:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

  @media (max-width: 640px) {
    .panes { grid-template-columns: 1fr; }
    .panes::before, .current { display: none; }
    .pane:first-child { border-bottom: 1px solid var(--line); }
    header h1 { font-size: 32px; }
  }
</style>
</head>
<body>

<header>
  <div class="eyebrow">Connected via secure server</div>
  <h1>Translate</h1>
  <p>Type on one shore, arrive on the other.</p>
</header>

<div class="app">
  <div class="lang-bar">
    <div class="lang-select-wrap">
      <label for="sourceLang">From</label>
      <div class="select-shell">
        <select id="sourceLang">
          <option value="auto">Auto-detect</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
    </div>

    <button class="swap-btn" id="swapBtn" title="Swap languages" aria-label="Swap languages">⇄</button>

    <div class="lang-select-wrap">
      <label for="targetLang">To</label>
      <div class="select-shell">
        <select id="targetLang">
          <option value="en">English</option>
          <option value="hi" selected>Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
    </div>
  </div>

  <div class="panes">
    <div class="current" id="current"></div>

    <div class="pane">
      <textarea id="sourceText" placeholder="Type or paste text here..." maxlength="1000"></textarea>
      <div class="char-count"><span id="charCount">0</span> / 1000</div>
    </div>

    <div class="pane">
      <div class="output-text placeholder" id="outputText">Translation will appear here.</div>
      <div class="pane-actions">
        <button class="icon-btn" id="copyBtn" title="Copy translation" aria-label="Copy translation" disabled>⧉</button>
        <button class="icon-btn" id="speakBtn" title="Listen to translation" aria-label="Listen to translation" disabled>🔊</button>
      </div>
    </div>
  </div>

  <div class="actions-bar">
    <span class="status" id="status"></span>
    <button class="primary" id="translateBtn">Translate</button>
  </div>
</div>

<script>
  const sourceText = document.getElementById('sourceText');
  const outputText = document.getElementById('outputText');
  const sourceLang = document.getElementById('sourceLang');
  const targetLang = document.getElementById('targetLang');
  const translateBtn = document.getElementById('translateBtn');
  const swapBtn = document.getElementById('swapBtn');
  const charCount = document.getElementById('charCount');
  const status = document.getElementById('status');
  const current = document.getElementById('current');
  const copyBtn = document.getElementById('copyBtn');
  const speakBtn = document.getElementById('speakBtn');

  // Live character counter
  sourceText.addEventListener('input', () => {
    charCount.textContent = sourceText.value.length;
  });

  // Swap source/target languages (skips if source is "auto")
  swapBtn.addEventListener('click', () => {
    if (sourceLang.value === 'auto') return;
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
    swapBtn.classList.add('spun');
    setTimeout(() => swapBtn.classList.remove('spun'), 350);
  });

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle('error', isError);
  }

  // No API key here anymore — the browser calls OUR server,
  // and the server holds the real key from .env.
  async function translateText() {
    const text = sourceText.value.trim();

    if (!text) {
      setStatus('Enter some text first.', true);
      return;
    }

    setStatus('Translating...', false);
    translateBtn.disabled = true;
    current.classList.add('active');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          source: sourceLang.value,
          target: targetLang.value
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      outputText.textContent = data.translatedText;
      outputText.classList.remove('placeholder');
      copyBtn.disabled = false;
      speakBtn.disabled = false;
      setStatus('', false);
    } catch (err) {
      setStatus(`Error: ${err.message}`, true);
      outputText.textContent = 'Translation failed. See status message above.';
      outputText.classList.add('placeholder');
      copyBtn.disabled = true;
      speakBtn.disabled = true;
    } finally {
      translateBtn.disabled = false;
      current.classList.remove('active');
    }
  }

  // Copy translated text to clipboard
  copyBtn.addEventListener('click', async () => {
    if (outputText.classList.contains('placeholder')) return;
    try {
      await navigator.clipboard.writeText(outputText.textContent);
      copyBtn.classList.add('on');
      setTimeout(() => copyBtn.classList.remove('on'), 1000);
    } catch {
      setStatus('Could not copy to clipboard.', true);
    }
  });

  // Text-to-speech for translated text
  speakBtn.addEventListener('click', () => {
    if (outputText.classList.contains('placeholder')) return;
    const utterance = new SpeechSynthesisUtterance(outputText.textContent);
    utterance.lang = targetLang.value;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    speakBtn.classList.add('on');
    utterance.onend = () => speakBtn.classList.remove('on');
  });

  translateBtn.addEventListener('click', translateText);
</script>

</body>
</html>
Save this over your public/index.html, refresh the page (no need to restart the server for frontend-only changes), and you should see two small icon buttons in the output pane that light up once a translation comes through.yes its workingNice — that's the full task done: modern UI, secure server-side API key, Gemini-powered translation with retry handling, and copy/text-to-speech on the output. Nice project to have working end to end.
If you want to take it further later, a few natural next steps would be adding more languages to the dropdowns, deploying it somewhere like Render or Railway so it's live on the internet instead of just localhost, or adding a "recent translations" history. Just let me know if you want to tackle any of that.a good readme for it to write in gitArchitected comprehensive README structure with essential documentation sectionsArchitected comprehensive README structure with essential documentation sectionsJust drop README.md into the root of your translator-app folder alongside server.js and package.json — GitHub will render it automatically on your repo's homepage. It covers setup, project structure, how the server/Gemini flow works, and a troubleshooting table for the issues we already hit (Windows IPv6, missing key, overload retries).ReadmeDocument · MD Translator appZIP in textInterpreted request to deliver content inlineInterpreted request to deliver content inlinemarkdown# Translate

A modern, minimal language translation app. Type text, pick a source and target language, and get an instant translation — powered by the Gemini API, with the API key kept safely on the server and never exposed to the browser.

![Node](https://img.shields.io/badge/node-%3E%3D18-3ecfb2)
![Express](https://img.shields.io/badge/express-4.x-f2a65a)

## Features

- 🌐 Translate between 8 languages, with auto-detect for the source language
- 🔒 API key stored server-side in `.env` — never shipped to the client
- ⚡ Powered by Google's Gemini API (`gemini-2.5-flash`)
- 🔁 Automatic retry with backoff if Gemini is temporarily overloaded
- 📋 One-click copy of the translated text
- 🔊 Text-to-speech playback of the translation (uses the browser's built-in speech synthesis — no extra API)
- 🎨 Custom UI with an animated "current" that flows between panes while translating

## Tech stack

| Layer    | Tech                                  |
|----------|----------------------------------------|
| Frontend | HTML, CSS, vanilla JavaScript          |
| Backend  | Node.js, Express                       |
| AI       | Gemini API (`generateContent`)         |
| Config   | dotenv                                 |

## Project structure
translator-app/
├── server.js          # Express server — the only thing that talks to Gemini
├── .env.example        # Template for your environment variables
├── .gitignore
├── package.json
└── public/
└── index.html      # Frontend UI

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd translator-app
npm install
```

### 2. Get a Gemini API key

Create a free key at [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Set up your environment variables

Copy the example file and add your key:

```bash
cp .env.example .env
```

Then open `.env` and fill in:
GEMINI_API_KEY=your_actual_key_here
PORT=3000**
`.env` is already listed in `.gitignore`, so it will never be committed.

### 4. Run the server

```bash
npm start
```

You should see:
Translator server running at http://localhost:3000

### 5. Open the app

Visit **http://localhost:3000** in your browser.

## How it works

The frontend never talks to Gemini directly. Instead:

1. The browser sends `{ text, source, target }` to your own `/api/translate` endpoint.
2. `server.js` builds a translation prompt and calls Gemini's `generateContent` endpoint using the key from `.env`.
3. If Gemini responds with a "temporarily overloaded" error, the server automatically retries up to 3 times with increasing delays.
4. The translated text is sent back to the browser and displayed.

This keeps your API key private and gives you a single place to add rate limiting, logging, or caching later if you need it.

## Troubleshooting

| Problem | Likely cause |
|---|---|
| `ConnectTimeoutError` on Windows | IPv6 routing issue — already patched via `dns.setDefaultResultOrder('ipv4first')` in `server.js` |
| `Server is missing GEMINI_API_KEY` | `.env` file missing or not filled in — check step 3 above |
| "This model is currently experiencing high demand" | Gemini is temporarily overloaded; the server retries automatically, but very heavy load can still fail after 3 attempts — just try again shortly |

## Roadmap ideas

- [ ] Deploy to Render/Railway so it's live on the internet
- [ ] Add more languages
- [ ] Save recent translations to local history
- [ ] Add a dark/light theme toggle

## License

MIT — do whatever you like with it.
