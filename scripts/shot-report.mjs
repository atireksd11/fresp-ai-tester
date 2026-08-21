import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

mkdirSync("docs/screens", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
const shots = [
  ["index.html", "overview.png"],
  ["plan.html", "plan.png"],
  ["compare.html", "compare.png"],
];
for (const [file, out] of shots) {
  await page.goto(pathToFileURL(resolve("logs/report", file)).href, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForTimeout(1800);
  await page.screenshot({
    path: resolve("docs/screens", out),
    fullPage: file === "index.html" || file === "compare.html",
  });
  console.log("wrote docs/screens/" + out);
}
await browser.close();
