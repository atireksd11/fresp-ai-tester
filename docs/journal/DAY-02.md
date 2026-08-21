# Day 2 — 21 Aug 2026

Day 1 was overflow + two demo pages + one HTML file. Day 2 is the rest of the loop
that the vision doc used to say “later”.

## What shipped

- Demo club site: home, about, events, join (plus extra html sitting in fixtures)
- Heat sheet: product `school club`, goal `hackathon`, those four paths
- One Chromium for the whole audit (new page per URL, then close)
- Finder: up to 3 live example homepages when `exampleUrls` is empty
- Taste: vision API, `docs/taste.md`, steal sheet on examples, learnings JSON,
  then judge yours (empty issues allowed)
- Rebuild plan: full `style.css` + full HTML per route, not 4 sketches
- Apply: backup demo → `logs/backups/`, write files, open demo
- Report **site**: Overview / Plan / Pages / Playbook / Examples / Compare
- Local server `127.0.0.1:7373` after `npm run log` or `npm run report`
- Section screenshots skip hidden nodes / timeouts so one example cannot kill the run
- Fresp mark in the pill nav (transparent crop, not the old black square)

## Commands

- `npm run log` — Chrome + API + write report + keep 7373
- `npm run report` — rebuild HTML from last JSON, keep 7373
- `npm run apply` — write last plan onto the demo

Published npm is still `0.1.4` (older). This git is ahead.

## Proof

Chrome walked the four demo routes. Overflow is still the only **measured** fact.
Taste and plan ran when the key was present. Report is
`http://127.0.0.1:7373/logs/report/index.html`.

## Not done

- Clip / overlap / contrast facts
- Planner as spec + one file per write (one-shot JSON is still meh)
- Apply to a real user repo
- GIFs on the README (screenshots for now)
