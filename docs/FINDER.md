# Finder

If you leave `exampleUrls` empty, `src/find/find.ts` asks OpenRouter
to **search** (their web search tool, not me scraping Google) for 3
live https homepages that match `product` + `goal`.

Writes `logs/examples.json`. Then Playwright opens those URLs the
same way as your site, tagged `kind: "example"`. Example PNGs are
named `ex-<timestamp>.png` and gitignored so runs do not flood git.

Cap is 3 on purpose. Cost and time.

School district news sites showed up when `product` was just "school".
The prompt is supposed to ask for club/product sites, not the district
homepage. If search returns nothing, Compare stays empty — usually the
model cannot use tools, or the key failed. Check the `examples found:`
line in the log.
