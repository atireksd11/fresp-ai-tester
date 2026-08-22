# Day 2 — 21 Aug 2026

Yesterday was overflow and two pages. Today I tried to make the rest of the loop real, the stuff vision.md still called “later.”

Dentist in the afternoon so the day is split. Morning / afternoon was the big product chunk. Night I only did Wave A because I have to wake up at 5:30.

## The long part

Demo is a club now: home, about, events, join. Heat sheet says school club / hackathon and walks those four paths. Extra html (projects, schedule) is sitting in fixtures but Chrome does not open them unless I add the path.

One Chromium for the whole run. New page per URL, then close it. Used to launch a new browser every time. Felt dumb.

If you do not pin example URLs, finder asks OpenRouter to search and we take 3 https homepages. Then we screenshot those first, steal sheet, write logs/learnings.json, then judge my pages with that plus a reference shot. No key = skip, overflow still runs. Empty issues is allowed. I got tired of the model inventing nits.

Planner used to spit 4 tiny sketches. Now it dumps a full style.css and full HTML per route. Apply copies that onto fixtures/demo after a backup in logs/backups. It does not touch some stranger’s real repo. Report Apply button POSTs to the local server.

Report is a site now, not one html file: Overview, Plan, Pages, Playbook, Examples, Compare. Light pill nav, Inter, Instrument Serif. CSS is on disk so file:// still paints. I wasted time on the logo. Old file had a black background. New 1.png / 2.png were transparent but padded so the mark looked tiny, then I cropped it and it was huge, then 28px. Whatever. It is fine.

One example site had a hidden section. Screenshot timed out and killed the whole audit. Now we skip hidden / 4s timeout and keep going.

Wrote docs so architecture and vision stop lying (“AI is not wired”). README has report screenshots. BRIEF.md is the honest product brief. Git commits are on main in normal language. package.json is 0.2.0. I still have to npm login to publish.

Commands: `npm run log` (Chrome + optional AI + server), `npm run report` (HTML from last JSON), `npm run apply`.

Proof: Chrome walked all four demo routes. Taste and plan ran when the key was there. Overflow is still the only measured fact. Report lives at the URL the terminal prints.

## Wave A (night, then sleep)

Voters would have hated three things: no setup doc, npx always auditing the packaged demo, port 7373 already taken.

So tonight:

- fresp.json in this repo (`demo: true`) so the club fixture stays the default here
- loadSheet: no fresp.json in the folder you ran from = packaged demo, and the log says so
- npx cwd is process.cwd(), not the npm cache
- server tries 7373 then the next ports instead of pretending the old process is fine
- Apply fetch is `/apply` so it follows whatever port actually bound
- FRESP_SKIP_AI=1 skips taste, plan, finder. Overview shows the skip line
- docs/SETUP.md: chromium, key, .env, how to point at YOUR localhost

I did not do clip tonight. That is Wave C tomorrow. Also still not: overlap, contrast, one-file planner, apply to a real app, GIFs.

~6.5 hours. Good enough. Sleep.
