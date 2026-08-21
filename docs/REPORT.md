# Report

After a run, HTML lands in `logs/report/`. The terminal prints

`http://127.0.0.1:7373/logs/report/index.html`

Open that. `file://` still shows the pages, but **Apply** needs 7373.

## Pages (not the same dump everywhere)

- **Overview** — briefing: counts, CTA to plan, home shot, URL list
- **Plan** — tokens, shared CSS dialog, per-page how-to + full HTML, Apply
- **Pages** — yours only: facts, taste issues, full shot
- **Playbook** — steal sheet on your site (adds / moves / theme)
- **Examples** — swipe file, not pass/fail
- **Compare** — home vs each example

Look is light on purpose: `#F3F4F9`, Inter, Instrument Serif, Apple blue.
CSS is `src/report/report.css` so we do not depend on a Tailwind CDN.
Fonts still need internet once.

Nav mark is `logo/nav.png` (cropped from `logo/2.png`). Favicon is `logo/1.png`.

Screenshots live under `fixtures/baselines/`. From the report folder the img src is `../../fixtures/baselines/...`.

This is the product UI. It is not a second marketing website.
