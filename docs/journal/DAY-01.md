# Day 1 — 20 Aug 2026

Empty folder this morning. I wanted a thing you run on your computer, not another website you log into. Open real Chrome, measure something real, leave files. That was the whole day.

I made the rooms first so I would not dump everything in one file: core, drivers, vision, state, logger, report, config. package.json ESM. Demo is two html pages. Home has a 4000px red bar on purpose. About is fine. That way I can see fail and pass in the same run.

Playwright opens the files as file://. Vision asks Chrome if scrollWidth is bigger than clientWidth. That is overflow. Not the AI looking at a png and guessing. Screenshots go in fixtures/baselines. Logger stamps the terminal and logs/run.txt. State writes last-run.json. Report was one logs/report.html.

Pushed atireksd11/fresp-ai-tester. Published fresp-ai-tester on npm. First npx from another folder died because tsx was only a devDependency. Annoying. That is a tomorrow publish problem.

Proof I actually have: home overflow true / fail. about ok / pass. `npm run log` in this repo.

I did not do taste, clip, overlap, or any of the RAG ideas people keep suggesting. I do not want a vector database. I want the next fact in Chrome.
