import { chromium } from "playwright";
import { log } from "../logger/logger.js";
import { saveResult, getResult, writeRun, clearRun } from "../state/state.js";
import { heatSheet } from "../config/heatSheet.js";
import { openLane } from "../drivers/driver.js";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { judgePage } from "../vision/taste.js";
import { loadEnv } from "../config/env.js";
import { openRemote } from "../drivers/driver.js";
import { findExamples } from "../find/find.js";
import { buildPlan } from "../vision/plan.js";
import { savePlan } from "../state/state.js";
import { getAll } from "../state/state.js";
import { saveLearnings } from "../learn/learnings.js";

export async function runAudit(): Promise<void> {
  loadEnv();
  clearRun();
  let exampleUrls = heatSheet.exampleUrls;
  if (exampleUrls.length === 0) {
    exampleUrls = await findExamples(heatSheet.product, heatSheet.goal);
  log("examples found: " + exampleUrls.join(" "));
  }
  const browser = await chromium.launch({ headless: false });
  try {
  for (const url of exampleUrls) {
    try {
      const lane = await openRemote(browser, url);
      const facts = JSON.stringify({ overflow: lane.overflow });
      const taste = await judgePage(
        url,
        heatSheet.product,
        heatSheet.goal,
        facts,
        join("fixtures", "baselines", lane.shot),
        lane.sections,
        true,
        "",
        ""
      );
      saveResult({
        url: url,
        passed: lane.overflow === false,
        notes: lane.overflow === true ? "overflow" : "ok",
        shot: lane.shot,
        sections: lane.sections,
        kind: "example",
        taste: taste,
      });
      log("example " + url);
    } catch (err) {
      log("example skip " + url + " " + String(err));
    }
  }
  const examples = getAll().filter(function (r) {
    return r.kind === "example";
  });
  const learnings = saveLearnings(heatSheet.product, heatSheet.goal, examples);
  log("learnings: logs/learnings.json");
  const refShot =
    examples[0] && examples[0].shot
      ? join("fixtures", "baselines", examples[0].shot)
      : "";
  for (const path of heatSheet.paths) {
    const lane = await openLane(browser, path);
    const overflow = lane.overflow;
    const shot = lane.shot;
    const facts = JSON.stringify({ overflow: overflow });
    const taste = await judgePage(
      heatSheet.baseUrl + path,
      heatSheet.product,
      heatSheet.goal,
      facts,
      join("fixtures", "baselines", shot),
      lane.sections,
      false,
      learnings,
      existsSync(refShot) ? refShot : ""
    );
    saveResult({
      url: heatSheet.baseUrl + path,
      passed: overflow === false,
      notes: overflow === true ? "overflow" : "ok",
      shot: shot,
      sections: lane.sections,
      taste: taste,
      kind: "yours",
    });
    log(getResult().url);
    log(getResult().notes);
    log("ai skipped: " + String(taste.skipped) + " " + taste.reason);
  }
  const all = getAll();
  const yours = all.filter(function (r) {
    return r.kind !== "example";
  });
  const plan = await buildPlan(heatSheet.product, heatSheet.goal, yours, examples);
  savePlan(plan);
  log("plan skipped: " + String(plan.skipped) + " " + plan.reason);
  writeRun();
  log("report: http://127.0.0.1:7373/logs/report/index.html");
  } finally {
    await browser.close();
  }
}
