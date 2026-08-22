import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const outDir = resolve("docs/devlog/tmp");
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

async function shot(url, name, fullPage) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: resolve(outDir, name), fullPage: !!fullPage });
  console.log("wrote " + name);
}

const report = (f) => pathToFileURL(resolve("logs/report", f)).href;
const demo = (f) => pathToFileURL(resolve("fixtures/demo", f)).href;

if (existsSync(resolve("logs/report/index.html"))) {
  await shot(report("index.html"), "01-overview.png", true);
  await shot(report("plan.html"), "02-plan.png", false);
  await shot(report("compare.html"), "03-compare.png", true);
  await shot(report("yours.html"), "04-pages.png", true);
}

await shot(demo("home.html"), "05-demo-home.png", false);
await shot(demo("about.html"), "06-demo-about.png", false);
await shot(demo("events.html"), "07-demo-events.png", false);

try {
  await shot(
    "https://github.com/atireksd11/fresp-ai-tester/commits/main",
    "08-github-commits.png",
    false
  );
} catch (err) {
  console.log("skip github: " + String(err));
}

await browser.close();
