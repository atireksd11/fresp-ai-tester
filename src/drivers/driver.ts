import type { Browser } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { log } from "../logger/logger.js";
import { hasOverflow } from "../vision/facts.js";
import { capture, captureSections } from "../vision/capture.js";

export type LaneResult = {
  overflow: boolean;
  shot: string;
  sections: string[];
};

async function snap(browser: Browser, url: string, shot: string, pageName: string): Promise<LaneResult> {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await capture(page, shot);
    const sections = await captureSections(page, pageName);
    const overflow = await hasOverflow(page);
    log("overflow: " + overflow);
    return { overflow: overflow, shot: shot, sections: sections };
  } finally {
    await page.close();
  }
}

export async function openLane(
  browser: Browser,
  path: string,
  usingDemo: boolean,
  baseUrl: string,
  demoRoot: string
): Promise<LaneResult> {
  if (!usingDemo) {
    const url = baseUrl.replace(/\/$/, "") + path;
    return openRemote(browser, url);
  }
  const files: Record<string, string> = {
    "/": "home.html",
    "/about": "about.html",
    "/events": "events.html",
    "/join": "join.html",
  };
  const name = files[path] ?? "home.html";
  const fileUrl = pathToFileURL(resolve(demoRoot, "fixtures/demo", name)).href;
  log("opening " + fileUrl);
  const pageName = name.replace(".html", "");
  return snap(browser, fileUrl, pageName + ".png", pageName);
}

export async function openRemote(browser: Browser, url: string): Promise<LaneResult> {
  log("opening " + url);
  const pageName = "ex-" + String(Date.now());
  return snap(browser, url, pageName + ".png", pageName);
}
