Day 2 - Devlog 2
Date - 21 August 2026
Worked - 6 hours and 30 minutes

If you missed day 1: Fresp is a command I run on my laptop. Playwright opens real Chrome, I measure something on the live page, files land in the repo. Not a website you log into.

Today I started from that overflow-only toy (two html pages, one report.html) and tried to finish the loop I wrote down in VISION.md.

First I rebuilt the demo into a fake club so Chrome has more than home/about. heatSheet.paths is now /, /about, /events, /join. There’s extra html in fixtures I didn’t wire yet (projects, schedule) because I didn’t want to fake a sitemap I don’t walk.

Then I noticed we launch Chromium per page. That’s slow and looks stupid. runAudit now launches once, newPage per URL, page.close(), browser.close() in finally.

After that I wired taste for real. I used to judge my pages first then look at examples, which is backwards. Order now: find 3 urls (or skip if no key), screenshot those, steal sheet into logs/learnings.json, then judge mine with that json + the first example png. I also let issues be []. The model was inventing “generic template” on pages that were already a club site.

Planner was 4 tiny html sketches. I changed the type to RebuildPlan: one full style.css and pages[].html as complete documents. apply.ts copies that onto fixtures/demo after dumping a backup in logs/backups. I am not writing into some other project yet on purpose. If the generated css is ugly, at least it only hits the fixture.

Report became six html files in logs/report/ with a shared report.css. file:// was breaking when I tried a CDN so the css is just a file. I spent way too long on the logo. The png I copied still had a black square. Then 1.png/2.png were transparent but padded so 32px looked like 12px. Cropped nav.png. Then 44px ate the pill. Landed on 28px. Don’t look at the git history for that part.

Around then an example site had a hidden <section>. locator.screenshot waited 30s and the whole npm run log died. capture.ts now skips not-visible and 4s timeout. Example loop is try/catch so one url can’t kill the run.

Dentist in the afternoon. Came back at 9:30, have to wake up at 5:30, so I only did the “a stranger will hate this” stuff. bin/fresp.mjs had cwd set to the package folder, so npx always audited MY demo. That’s load.ts + fresp.json now. No file = demo and we log it. Server used to print “already on 7373” and keep serving the OLD report. Now it binds 7374 etc. Apply fetch is /apply so it follows the port. FRESP_SKIP_AI actually does something. Wrote SETUP.md because I was tired of explaining the key in chat.

Overflow is still the only fact. Clip is tomorrow. I keep saying that.

Shots from the report and the demo are in docs/devlog/tmp. Repo is atireksd11/fresp-ai-tester. package.json says 0.2.0, I haven’t npm published yet because login is dead on this machine.

Next session: hasClip in facts.ts, same page.evaluate pattern, plant overflow:hidden + long text on about.
