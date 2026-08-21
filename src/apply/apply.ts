import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import type { RebuildPlan } from "../types/plan.js";

const demo = "fixtures/demo";

function fileFor(route: string): string | null {
  if (route.includes("..") || route.includes("\\")) {
    return null;
  }
  if (route === "/" || route === "") {
    return "home.html";
  }
  if (!route.startsWith("/")) {
    return null;
  }
  const rest = route.slice(1).replace(/\/$/, "");
  if (!/^[a-z0-9-]+$/i.test(rest)) {
    return null;
  }
  return rest + ".html";
}

export function applyPlan(): void {
  const plan = JSON.parse(readFileSync("logs/last-plan.json", "utf8")) as RebuildPlan;
  if (plan.skipped || !plan.css || plan.pages.length === 0) {
    console.log("no plan to apply");
    return;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const bak = join("logs", "backups", stamp);
  mkdirSync(bak, { recursive: true });
  for (const name of readdirSync(demo)) {
    copyFileSync(join(demo, name), join(bak, name));
  }
  writeFileSync(join(demo, "style.css"), plan.css);
  for (const p of plan.pages) {
    const name = fileFor(p.route);
    if (!name || !p.html) {
      continue;
    }
    writeFileSync(join(demo, name), p.html);
  }
  console.log("applied plan. backup: " + bak);
}
