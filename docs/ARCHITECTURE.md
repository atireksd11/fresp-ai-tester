# Fresp architecture

Fresp is a local CLI frontend auditor. You run a command. Chrome opens.
Files land on disk. It is not a hosted site.

## Rooms

- `core` — manager. Calls the others. Does not open Chrome.
- `drivers` — Playwright. One shared browser. New page per URL, then close that page.
- `vision` — screenshots, layout facts, taste, rebuild plan.
- `find` — if you did not pin example URLs, ask search for 3 live homepages.
- `learn` — turn example taste into `logs/learnings.json` before judging yours.
- `state` — scorecards + last plan as JSON.
- `logger` — timestamps. `log` / `report` / `apply` entrypoints.
- `report` — HTML site under `logs/report/` (not one `report.html`).
- `apply` — write the last plan onto `fixtures/demo` (backup first). HTTP on 7373.
- `config` — heat sheet (URLs, product, goal) + `.env` loader.
- `bin` — npm command `fresp`

## Run loop (day 2)

1. Load `.env`. Clear last run.
2. Example URLs = heat sheet pins, or finder (cap 3).
3. Open those live sites. Screenshot + overflow fact + taste in **example** mode (steal sheet).
4. Save learnings.
5. Open your paths (`file://` demo mapped from `/`, `/about`, `/events`, `/join`).
6. Judge **yours** with learnings + first example screenshot.
7. One more model call: rebuild plan (full `style.css` + full HTML per route).
8. Write `logs/last-run.json`, `logs/last-plan.json`, `logs/report/*`.
9. Keep a tiny HTTP server on `127.0.0.1:7373` so Apply works (not `file://`).

No API key: skip taste and plan. Facts + PNGs + report still happen.

## Facts vs taste

Facts (our code in Chrome): overflow today. Clip, overlap, contrast still not coded.

Taste (AI): hierarchy, slop, fit for product + goal, what to steal from examples.

Taste must not invent overflow if the fact is false. Never fix overflow with `overflow-x: hidden`.

## Not in v1

No VS Code extension. No cloud dashboard. No writing into a stranger’s real repo.
Apply only touches `fixtures/demo`. Finder is capped search, not a crawler.
