# Fresp engineering vision

This is how Fresp should work when it is finished.
Day 1 / v0.1.4 has facts + screenshots + HTML + `npx fresp-ai-tester@0.1.4`.
The AI path is not coded yet. Logger creates the `logs/` folder if npm did not ship it.

## Layers

1. Config — what to open, what the product is, what the goal is, optional example URLs.
2. Driver — one Chrome, many pages, wait until paint, hand the page to vision.
3. Facts — code in Chrome (overflow, later clip, overlap, contrast, font/color counts). No API.
4. Capture — full-page PNG on disk.
5. Taste — vision model + docs/taste.md + facts JSON + screenshots.
6. State — one result object per page, then JSON for the whole run.
7. Report — HTML poster with facts, AI notes, images.
8. Logger — timestamps for every step, including skipped AI and cache hits.

If the API key is missing or the model is down, layers 1-4 and 6-8 still run.
Taste notes say "ai skipped". Facts still fail the page.

## Config shape (later)

heatSheet gets:

- baseUrl, paths (we have this)
- product (school | portfolio | saas | hackathon | other)
- goal (hackathon | web | play-store | class)
- exampleUrls (0-3, optional)
- startCommand (optional)

Secrets never go in git. API key lives in .env (already gitignored).

## Driver (later upgrade)

Today we launch and close Chrome per page. Finished system: launch once,
new tab per path, close at the end. Faster, cheaper, less flicker.

Still wait for network idle / fonts so screenshots are not blank.

file:// for the demo. http://localhost for real apps. startCommand if we must boot the app.

## Facts

Each check is a function in vision/facts.ts. Same idea as overflow:
page.evaluate, ask the DOM, return yes/no or a small list.

Facts run on EVERY page before AI. They are the floor.

## Taste / AI

Not RAG. Not a vector DB. Not a graph DB.

Inputs to one model call (per page, or per run — see cost):

- System text: docs/taste.md (stable)
- User text: product, goal, this page URL, facts JSON
- User images: this page PNG; if exampleUrls exist, those PNGs too (capped)

Output must be structured JSON we define, for example:

- assumedProduct, assumedGoal
- factSummary (copy our facts, do not contradict them)
- issues[]: severity, title, why it matters for THIS product, how to fix
- slopHits[] (names from the slop list if visible)
- readyFor: not-ready | hackathon | web-with-fixes | ship
- confidence (low if screenshot is blank or facts conflict)

The model must not invent overflow if facts say false.
The model must not say ship if facts failed.

### Prompts

Keep prompts in src/vision/prompts.ts (or similar), not scattered.
System prompt = short rules + full taste.md body.

### Two caches (this is the cost plan)

1. Provider prompt cache
   OpenAI/Anthropic can cache a long stable system prompt.
   taste.md changes rarely. Mark that block as cacheable.
   Per-page we only pay for new facts + new image.
   If the host does not support cache, still send the same system prompt;
   some providers cache automatically.

2. Local result cache (our disk)
   Folder like cache/taste/
   Key = hash of (taste.md + product + goal + facts JSON + screenshot bytes)
   If the key exists, do not call the API. Read JSON from disk.
   Logger writes "taste cache hit".
   Changing taste.md or the PNG invalidates that key.
   gitignore cache/ so we do not commit paid results.

Also shrink images before upload (max width e.g. 1280). Full PNG on disk for the report;
smaller copy for the API. Cuts image tokens.

Skip AI entirely if the user sets FRESP_SKIP_AI=1 (offline demo).

Retries: 2 retries on 429/500, then skip AI for that page, keep facts.

## Report

HTML still local. Each page: facts, readyFor, issue list, screenshot.
Example-site screenshots in a small row if present.
No login, no cloud.

## What we will not build in this sprint

Vector database, graph database, LangChain, auto-Google of all school sites,
VS Code writing files for you.

Example sites = URLs the user typed. We screenshot those. That is enough "industry".

## Order to code this

1. product + goal on heatSheet (no AI yet)
2. Read taste.md from disk in TypeScript
3. Resize + API client + structured JSON
4. Prompt cache headers if the provider supports them
5. Local hash cache
6. Wire notes into report.html
7. exampleUrls
8. One shared browser