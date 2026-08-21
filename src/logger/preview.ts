import { readFileSync } from "node:fs";
import { writeReport } from "../report/report.js";
import type { PageAudit } from "../types/audit.js";
import type { RebuildPlan } from "../types/plan.js";
import { startReportServer } from "../apply/listen.js";

const results = JSON.parse(readFileSync("logs/last-run.json", "utf8")) as PageAudit[];
const plan = JSON.parse(readFileSync("logs/last-plan.json", "utf8")) as RebuildPlan;
writeReport(results, plan);
console.log("rewrote logs/report from last-run.json (no API, no Chrome)");
startReportServer();
