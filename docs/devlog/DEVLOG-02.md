Day 2 - Devlog 2
Date - 21 August 2026
Worked - 6 hours and 30 minutes

Fresp is a local CLI. You run a command on your laptop. Real Chrome opens. It does not upload your site anywhere.

Most “AI design” tools stare at a screenshot and vibe. Fresp asks Chrome a yes/no first. Today that question is still just overflow: is the page wider than the window? (scrollWidth vs clientWidth.) If home is 4000px wide on purpose, it fails. If about is normal, it passes. The pictures are proof. The number is the test.

Day 1 was that one check, two stub pages, and a single HTML file. Today I tried to make it feel like a product you would actually open.

The demo is a fake school club now: home, about, events, join. Chrome walks all four. One Chromium for the whole run. I used to launch a new browser per page. That was embarrassing.

If you don’t pin example URLs, it searches for 3 live homepages in your niche, screenshots those first, writes a steal sheet, then judges YOUR pages against that. No API key? Fine. Overflow still runs. The model is also allowed to say “no issues” so it stops roasting punctuation.

The planner used to spit four tiny sketches. Useless. Now it writes a full style.css and full HTML per route. Apply pastes that onto the demo after a backup. It will not overwrite some stranger’s real repo. I don’t want a voter to click Apply and get slop in their actual project.

The report is a little website: Overview, Plan, Pages, Playbook, Examples, Compare. You click around. CSS is a real file so it still looks okay as file://. One example site had a hidden section. Screenshot timed out for 30 seconds and killed the whole audit. That was a fun hour. We skip dead sections now.

Night was shorter (dentist earlier, 5:30am tomorrow). Voters were going to hit three dumb traps: no setup doc, npx always auditing MY club demo, port 7373 already taken. So: fresp.json points at YOUR localhost. npx uses the folder you ran from. No config = demo, and the log says so. Busy port? Try the next ones. FRESP_SKIP_AI=1 if you only want facts. docs/SETUP.md is the “how do I run this” page.

Proof if you want to click instead of trust me: github.com/atireksd11/fresp-ai-tester (commits in normal English), docs/SETUP.md + BRIEF.md, screenshots in docs/devlog/tmp (overview, plan, compare, the demo). Chrome did walk all four routes. Taste ran when the key was there.

Git says 0.2.0. I still have to npm login before npx fresp-ai-tester@0.2.0 is real. Tonight: clone + npm run log.

What’s not done: clip / overlap / contrast (overflow is still the only measured fact, I know), apply to a real app, publishing.

Next: clip. Same idea as overflow. Text smashed inside a box should fail, even if the page doesn’t scroll sideways.
