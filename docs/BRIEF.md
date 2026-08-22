# Fresp — product brief

What the repo **actually runs** as of 21 Aug 2026 (day 2 + wave A).

Clip is **not** wired. Git is **0.2.0**. npm publish still needs `npm login`.

## What it is

A local TypeScript CLI. Real Chromium. It measures overflow on the live DOM, screenshots pages, optionally judges design with a vision model (`docs/taste.md`), finds up to 3 example sites, then writes a rebuild plan (full CSS + HTML). HTML report on disk. Server on 7373 or the next free port. Apply writes `fixtures/demo` with a backup.

Not a hosted app. Not VS Code. Not RAG.

**Judge line:** Fresp measures overflow in Chrome, optionally steals from 3 live sites, writes a full-file plan, and serves a report where Apply only touches the demo fixture.

## Run

`npm run log` or `npx fresp-ai-tester` (cwd = the folder you ran from).

No `fresp.json` → packaged club demo, and the log says so.  
`fresp.json` with `"demo": true` → same fixture.  
`"demo": false` + `baseUrl` → their localhost/https paths.

`FRESP_SKIP_AI=1` skips taste, plan, finder. Facts still run.

## Facts vs taste

Facts today: overflow only (`scrollWidth > clientWidth`). Clip / overlap / contrast not coded.  
`passed` / `notes` follow overflow. Taste can skip.

## Do not claim

Clip as a measured fact. Apply-to-real-repo. Published 0.2.0 until npm login. npx always testing *their* app unless they added `fresp.json`.
