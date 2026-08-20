import { log } from "../logger/logger.js";
import { saveResult, getResult, writeRun, clearRun } from "../state/state.js";
import { heatSheet } from "../config/heatSheet.js";
import { openLane } from "../drivers/driver.js";

export async function runAudit(): Promise<void> {
  clearRun();
    for (const path of heatSheet.paths) {
    const overflow = await openLane(path);
      saveResult({
        url: heatSheet.baseUrl + path,
        passed: overflow === false,
        notes: overflow === true ? "overflow"  : "ok",
        shot: path === "/about" ? "about.png" : "home.png",
      });
      log(getResult().url);
      log(getResult().notes);
    }
    writeRun();
  }