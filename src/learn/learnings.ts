import { mkdirSync, writeFileSync } from "node:fs";
import type { PageAudit } from "../types/audit.js";

export function saveLearnings(
  product: string,
  goal: string,
  examples: PageAudit[]
): string {
  const body = {
    product: product,
    goal: goal,
    items: examples.map(function (r) {
      return {
        url: r.url,
        steal: r.taste.steal,
        themeSpec: r.taste.themeSpec,
        extras: r.taste.extras,
        features: r.taste.features,
      };
    }),
  };
  const text = JSON.stringify(body, null, 2);
  mkdirSync("logs", { recursive: true });
  writeFileSync("logs/learnings.json", text);
  return text;
}
