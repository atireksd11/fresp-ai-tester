import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { log } from "../logger/logger.js";
import { capture } from "../vision/capture.js";
import { hasOverflow } from "../vision/facts.js";

export async function openLane(path: string): Promise<boolean> {
    let name = "home.html";
    if (path === "/about") {
        name = "about.html";
    }
    const fileUrl = pathToFileURL(resolve("fixtures/demo", name)).href;
    log("opening " + fileUrl);
    const browser = await chromium.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto(fileUrl);
    await capture(page, name.replace(".html", ".png"));
    const overflow = await hasOverflow(page);
    log("overflow: " + overflow);
    await page.waitForTimeout(3000);
    await browser.close();
    return overflow;
}