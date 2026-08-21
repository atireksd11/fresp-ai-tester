# Fresp

A local CLI that opens your site in real Chrome, checks layout facts on the live page, and writes an HTML report on your disk. No cloud dashboard.

![Fresp demo home page](fixtures/baselines/home.png)

**Try it**

```bash
npx fresp-ai-tester@0.1.4
npx playwright install chromium
```

The package name is `fresp-ai-tester` (not `fresp`). **v0.1.4** is the first npx build that works from another folder. Demo: **home** fails horizontal overflow, **about** passes.

## Features (v0.1)

- Playwright Chromium, full-page screenshots
- Overflow check from the DOM (`scrollWidth` vs `clientWidth`), not from guessing at the PNG
- JSON results, a timestamp log, and an HTML report
- Modular layout: `core`, `drivers`, `vision`, `state`, `logger`, `report`
- Demo pages included (broken home, clean about)

Not in v0.1: AI taste, clip/overlap/contrast, a VS Code extension.

## Run from this repo

Needs Node 20+.

```bash
git clone https://github.com/atireksd11/fresp-ai-tester.git
cd fresp-ai-tester
npm install
npx playwright install chromium
npm run log
```

Then open `logs/report.html` and `logs/last-run.json`.

Inside this repo you can also run `npx fresp`.

## How it works

The driver opens the page. Vision asks Chrome whether the document is wider than the window, then saves a PNG. State writes a scorecard per URL. The report is a local HTML file. Facts still run if a later AI key is missing. Product taste lives in `docs/taste.md` and is not a vector database.

## Docs

- [Product vision](docs/VISION.md)
- [Engineering](docs/ENGINEERING.md)
- [Taste bible](docs/taste.md)
- [Architecture](docs/ARCHITECTURE.md)

## License / credits

Playwright. Built in the open for Hack Club Stardance.
