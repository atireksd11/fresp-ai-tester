# Fresp architecture

Fresp is a local CLI frontend auditor 

## Rooms

- `core`- manager. Calls the others. Does not open Chrome.
- `drivers` - Playwright. Opens the site and reads the page. 
- `vision` - screenshots, layout measurements, then the ai scorecard. 
- `state` - saves results as JSON.
- `logger` - writes a dated diary of the run.
- `report` - writes logs/report.html
- `config` - heat sheet (URLs / paths)
- `bin` - npm command `fresp`

## Run loop

1. Driver opens the page.
2. Vision measures and screenshots.
3. AI grades. State and logger save.

## Facts vs taste

Facts (our code): overlap, clipped text, overflow, contrast, font/colors.

Taste (AI): hierarchy, consistency, slop, fit for the product.


## Not in v1

No VS Code extensions. No cloud dashboard. No Github bug finder. No auto detect of every framework. Pages come from a path list or sitemap.

## Folders

src/core
src/drivers
src/vision
src/state
src/logger
src/types
src/report
src/config
bin
tests
fixtures/baselines
docs

## Config a run needs

- baseUrl (example: http://localhost:3000)
- paths (example: / and /about)
- optional startCommand
