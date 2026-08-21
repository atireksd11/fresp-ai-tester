# Planner

After facts, screenshots, taste, and example sites, Fresp makes **one**
more model call: write files they can paste.

`RebuildPlan` lives in `src/types/plan.ts`. The call is
`src/vision/plan.ts`. It gets the full taste JSON (not just issue
titles) plus the home screenshot.

No API key → skip the plan, still write the rest of the report.

## Output

- `css` — complete `style.css`
- `pages[]` — every route to ship (existing + needed extras, max 6)
- each page: purpose, H1, button, `sections` (how to build it),
  `html` = a full HTML document that links `style.css`

Not a 3-line sketch. Fresp still does not write into the user's real repo.
`npm run apply` / the Plan button only write `fixtures/demo`
(backup under `logs/backups/`). A later "push with backup" can
do a real project.

`destroyFirst` is false if facts passed and the screenshot already
looks like a real product site.

Overflow fix cannot be `overflow-x: hidden`.

## Report

`logs/report/plan.html`: tokens + View style.css, then one card per
page with the how-to and View full HTML.
