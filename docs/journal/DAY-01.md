# Day 1 — 20 Aug 2026

Started from an empty repo. Goal: local CLI that opens a real browser,
measures a layout fact, writes files. Not a hosted website.

## Setup
- Folders: src/core, drivers, vision, state, logger, report, types, config
- package.json (ESM), tsconfig.json, .gitignore
- docs: ARCHITECTURE, VISION, ENGINEERING, taste.md
- Demo pages in fixtures/demo (home broken with 4000px bar, about clean)
- GitHub: atireksd11/fresp-ai-tester ( public )
- npm: fresp-ai-tester@0.1.0 public. Stranger npx failed because tsx was
  only a devDependency. 0.1.1 not published yet.

## Code that runs
- Logger: timestamp to terminal + logs/run.txt
- State: PageAudit scorecard, stack, last-run.json
- Config: heatSheet baseUrl + paths
- Core: loop paths, save pass/fail from overflow
- Driver: Playwright Chromium, file:// demo HTML, 3s so you can see it
- Vision: full-page PNG in fixtures/baselines, hasOverflow
  (scrollWidth > clientWidth inside page.evaluate)
- Report: logs/report.html
- bin/fresp.mjs so npx fresp works inside this repo (path-with-spaces fix)

## Proof
Home: overflow true, notes overflow, passed false.
About: overflow false, notes ok, passed true.
Command: npm run log (or npx fresp in this folder).

## Not done
AI taste API, extra facts, npm 0.1.1, VS Code extension, RAG.