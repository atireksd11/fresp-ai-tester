# Setup

## 1. Chromium

npx playwright install chromium

## 2. Run this repo

npm install
npm run log

Leave the terminal open. It prints a report URL
(127.0.0.1:7373 or the next free port).

## 3. API key (optional)

Taste + plan + example search need a key.
Facts and screenshots work without one.

Create .env in the folder you run from:

FRESP_API_KEY=sk-or-...
FRESP_API_BASE=https://openrouter.ai/api/v1
FRESP_MODEL=google/gemini-3.5-flash-lite

PowerShell for one session:

$env:FRESP_API_KEY="sk-or-..."

Skip all AI:

$env:FRESP_SKIP_AI="1"

## 4. Audit YOUR site (not the demo)

In that project folder, add fresp.json:

{
  "name": "my app",
  "demo": false,
  "baseUrl": "http://localhost:3000",
  "paths": ["/", "/about"],
  "product": "school club",
  "goal": "hackathon",
  "exampleUrls": []
}

Then from THAT folder:

npx fresp-ai-tester@0.2.0

No fresp.json = packaged club demo. The log will say so.

## 5. Other commands (clone)

npm run report — rebuild HTML from last JSON
npm run apply — write last plan onto fixtures/demo (backup first)