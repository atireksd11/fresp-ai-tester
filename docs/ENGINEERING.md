# Fresp engineering

How it works **now**, and what is still a later upgrade.

Day 2 in this repo: facts (overflow) + screenshots + taste + plan + apply-to-demo + `logs/report/` on port 7373.

npm `fresp-ai-tester@0.2.0` matches this git: facts (overflow) + screenshots + taste + plan + apply-to-demo + `logs/report/` on port 7373.

## Layers

1. Config — paths, product, goal, optional example URLs. Secrets in `.env` (gitignored).
2. Driver — one Chrome, many pages, `file://` demo or https examples.
3. Facts — `src/vision/facts.ts`. Overflow only. Clip / overlap / contrast next.
4. Capture — full-page PNG. Section shots skip hidden nodes and 4s timeouts so one bad site cannot freeze the run.
5. Taste — vision model + `docs/taste.md` + facts JSON + screenshots. Skip if no key.
6. Finder — OpenRouter search, cap 3, `logs/examples.json`.
7. Learnings — example steal notes written before yours is judged.
8. Plan — one extra model call, full CSS + full HTML per route. Skip if no key.
9. State — `logs/last-run.json`, `logs/last-plan.json`.
10. Report — HTML pages + `src/report/report.css` (no Tailwind CDN; `file://` still paints).
11. Apply — backup `fixtures/demo` → `logs/backups/<time>/`, write files, open demo.
12. Logger — timestamps, including `ai skipped`.

If the API key is missing, layers 1–4 and 9–12 still run.

## Driver

Launch Chromium once in `runAudit`. `newPage` per URL. `page.close()`. `browser.close()` in `finally`.

Demo map in `openLane`: `/` → `home.html`, `/about`, `/events`, `/join`. Extra html in `fixtures/demo` is not in the heat sheet until you add the path.

Examples: `openRemote`, shot name `ex-<timestamp>.png`. Those PNGs are gitignored so the repo does not eat every run.

## Facts

Each check is a function: `page.evaluate`, ask the DOM, return yes/no.

Facts run on every page before AI. They are the floor.

Ban: `overflow-x: hidden` as the overflow fix. Name the wide child.

## Taste / AI

Not RAG. Not a vector DB. Not a graph DB.

Per page (examples vs yours use different prompts in `src/vision/prompts.ts`):

- System: short rules + full `docs/taste.md`
- User: product, goal, URL, facts JSON
- Images: this page PNG; yours also gets learnings JSON + first example PNG

Output is typed JSON (`src/types/taste.ts`). Issues may be `[]`.

The model must not invent overflow if facts say false.

Skip AI if there is no key. No local hash cache yet (that is still a cost upgrade). No prompt-cache headers yet.

Retries are not fancy: if the call throws, that page’s taste is skipped.

## Plan

`src/vision/plan.ts`. `RebuildPlan` in `src/types/plan.ts`.

Still one shot (big JSON). Quality is meh when the model is flash-lite. Later: spec call, then one file per write. Not tonight’s leftover.

Apply does **not** write a user’s real repo. Demo only.

## Report

Open **http://127.0.0.1:7373/logs/report/index.html** after `npm run log` or `npm run report`.

`npm run report` rebuilds HTML from last JSON (no Chrome, no API) and starts 7373 again.

## What we will not build in this sprint

Vector database, graph database, LangChain, unsupervised crawl, VS Code writing production files.

## Next to code

1. Clip fact (same shape as overflow)
2. Plant a clip bug in the demo
3. Contrast, then overlap
4. Split planner into spec + one write per file
