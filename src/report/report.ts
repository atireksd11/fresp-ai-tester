import { writeFileSync } from "node:fs";
import type { PageAudit } from "../types/audit.js";

export function writeReport(results: PageAudit[]): void {
    let rows = "";
    for (const r of results) {
        rows =
        rows +
        "<p>" +
        r.url +
        " — " +
        r.notes +
        "</p>" +
        '<img src="../fixtures/baselines/' +
        r.shot +
        '" width="400">';
    }
    const html = 
    "<!DOCTYPE html><html><body><h1>Fresp report</h1>" + 
    rows +
    "</body></html>";
    writeFileSync("logs/report.html",html);
}