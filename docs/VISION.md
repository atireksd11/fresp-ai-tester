# Fresp - product vision

## What it is

Fresp is a tool you run on your own computer. It opens your website in real Chrome, takes full page screenshots, checks the live page for layout problems, and uses an AI to judge the design against a written bible (`docs/taste.md`). When it is done, you get files in the project folder: pictures, JSON, a log, and an HTML report you click through.

It is not a website you log into, it is not a VS Code extension, and it is not a Github bug finder. It is a local CLI: you type a command, it does the work, it leaves files on disk.

Independent means we do not depend on Percy, Chromatic, or Applitools. Your screenshots and reports stay on your machine.

## Who it is for

Someone who shipped a frontend (including vibe coded sites) and does not know if it is good for launch. Pixel-only tools pass an ugly website that never changes. Fresp is supposed to measure what it can, roast the rest, and hand you a rebuild plan.

First customer is us: a small demo club site in this repo.

## How a full run works

1. Tiny config (`src/config/heatSheet.ts`): base url, paths, product, goal, optional example URLs.

2. Command: `npm run log` in this repo, or `npx fresp-ai-tester@0.2.0`.

3. Core reads the heat sheet and orchestrates. Core does not open Chrome itself.

4. Driver opens one Chromium for the whole run. Each URL gets a page, then that page closes.

5. Vision, before any AI:
    - full page PNG (+ up to 4 visible `<section>` crops)
    - facts from the live DOM: horizontal overflow today
      (`scrollWidth > clientWidth`)

    These are yes/no. If the AI is down, facts still work.

6. Vision, taste: screenshots + facts + taste.md + learnings from example sites. Structured JSON. Empty issues is allowed if the page already fits.

7. Finder (if you did not pin URLs): 3 live https homepages, steal sheet, then judge yours.

8. State: one result per page in `logs/last-run.json`. Plan in `logs/last-plan.json`.

9. Logger: timestamps to the terminal and `logs/run.txt`.

10. Report: `logs/report/` — Overview, Plan, Pages, Playbook, Examples, Compare. Open
    `http://127.0.0.1:7373/logs/report/index.html` (the process keeps 7373 up).

11. Apply (optional): POST `/apply` or `npm run apply`. Backs up demo HTML/CSS, writes the plan files, opens the demo.

## What "passed" means

A page fails if facts find a real layout bug. Taste issues are shown even when overflow passed. We do not fail the run only because the model nitpicked punctuation.

## What we have (day 2)

- Four demo routes, heat sheet sitemap
- One shared Chrome
- Overflow fact
- Taste + steal + learnings
- Finder cap 3
- Rebuild plan (full files, not sketches)
- Apply to demo with backup
- Report site + local server

## What we do not have yet

Clip, overlap, contrast as facts. Planner still one JSON dump (not one write per file). Apply does not push to your real app repo.

## What we will not build in this sprint

No cloud dashboard, no accounts, no VS Code extension, no “scan any github repo”, no vector DB / RAG.

## Why this is the product

Playwright screenshot compare = did it change. Lighthouse = scores. Fresp = measure the page, then taste, then a plan you can apply on the demo. Local, modular: break CSS, run, see fail on the report.
