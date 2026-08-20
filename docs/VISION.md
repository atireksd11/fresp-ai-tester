# Fresp - product vision

## What it is

Fresp is a tool you run on your own computer. It opens your website in real Chrome, takes full page screenshots, checks the live page for layout problems, and later uses an AI to judge the design based on some criteria. When it is done, you get files in the project folder: pictures, a JSON result, a log, and an HTML report you can open in the browser.

It is not a website you log into, it is not a VS Code extension, and it is not a Github Bug finder. It is a local CLI: you type a command, it does the work, it leaves files on disk.

Independent means we do not depend on Percy, CHromatic, or Applitools. Your screenshots and reports stay on your machine.

## Why is it for

Someone who shipped a frontend (including vibe coded sites) and doesn't know if its good for launch or not. Pixel only tools pass an ugly website that never changes. Fresp is supposed to critically analyze your website and confidently give you suggestions and ideas in the HTML report.

First customer is us: a small demo site in this repo, then a real site we own, when we are ready.

## How a full run will work

1. You have a tiny config: base url (localhost or https) and a list of paths (`/`, `/about`, ...). Later we can also read a sitemap. Optional: a start command if we need to boot the dev server.

2. You run the command ( today that is `npm run log`; we will rename it to something like `npm run fresp`).

3. Core needs the config and goes path by path. Core does not open Chrome itself. It only calls the other modules.

4. Driver (Playwright) opens Chome, goes to that page, waits until it is painted.

5. Vision, before any AI:
    - full page screeenshots, saved as a PNG
    - facts from the live DOM: horizontal overflow, overlapping elements, clipped text, weak contrast, messy font/colors

    These are numbers and yes/no. If the AI is down, facts still work.

6. Vision, after facts (not built yet): send the screenshots plus the fact list to a vision model with a fixed checklist: hierarchy, consistency, AI slop patterns, does this look like the right product. The model writes notes and scores. We do not let it be the only brain.

7. State stores one result per page: url, passed, notes, path to the screenshot. All pages in the run get written to `logs/last-run.json`.

8.Logger writes timestamped lines to the terminal and `logs/run.txt`.

9. Report writes `logs/report.html`: each page with notes and the screenshot. You open that file in Chrome. That is the "app UI".

10. Process can later exit 1 if anything failed, so CI can use it. Not required on day one.




## What "passed" means

A page fails if facts find a real layout bug (example: home has a 4000px-wide bar, overflow is true.) Later it can also fail if the AI score is below a threshold we choose. We will write that threshold down so it is not random vibes.

## What we already have (DAY 1)

- Folders split by job: core, drivers, vision, state, logger, report, types, config
- Demo pages: home (broken on purpose), about (fine)
- Playwright opens those files, waits, screenshots into `fixtures/baselines/`
- Overflow check: home fails, about passes 
- JSON + HTML report + text log


What we do not have yet: overlap/clip/contrast/fonts, AI taste, photos inside the HTML report, a real local server, sitemap, one shared browser instead of open/close per page.


## What we will not build in this sprint

No cloud dashboard, no accounts, no VS Code extension, no "scan any github repo for all bugs" no magic "understands every framework". Pages come from a list or a sitemap we can actually parse.


## Why this is the product

Playwright screenshot compare = did it change. Lighthouse = a11y-ish scores. Fresp = measure the page, then (later) tase. Local, modular, demoable: break CSS, run, see fail on the report.

## Important Message

There is a high possibility that we change the product vision, a lot, drastically, as we move on and get better ideas. It could possibly become much more advanced by time. For DAY 1 this is our Vision.