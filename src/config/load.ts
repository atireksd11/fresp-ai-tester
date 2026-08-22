import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { heatSheet } from "./heatSheet.js";
import { log } from "../logger/logger.js";

export const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export type Sheet = {
  baseUrl: string;
  paths: string[];
  product: string;
  goal: string;
  exampleUrls: string[];
  name: string;
  usingDemo: boolean;
};

export function skipAi(): boolean {
  const v = (process.env.FRESP_SKIP_AI ?? "").toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function loadSheet(): Sheet {
  const file = join(process.cwd(), "fresp.json");
  if (!existsSync(file)) {
    log("no fresp.json in " + process.cwd() + " — packaged demo");
    return {
      baseUrl: heatSheet.baseUrl,
      paths: heatSheet.paths,
      product: heatSheet.product,
      goal: heatSheet.goal,
      exampleUrls: heatSheet.exampleUrls,
      name: "demo",
      usingDemo: true,
    };
  }
  const raw = JSON.parse(readFileSync(file, "utf8")) as {
    baseUrl?: string;
    paths?: string[];
    product?: string;
    goal?: string;
    exampleUrls?: string[];
    name?: string;
    demo?: boolean;
  };
  const usingDemo = raw.demo === true;
  log(
    usingDemo
      ? "fresp.json demo: true — packaged club pages"
      : "fresp.json — " + (raw.baseUrl ?? heatSheet.baseUrl)
  );
  return {
    baseUrl: raw.baseUrl ?? heatSheet.baseUrl,
    paths: raw.paths ?? heatSheet.paths,
    product: raw.product ?? heatSheet.product,
    goal: raw.goal ?? heatSheet.goal,
    exampleUrls: raw.exampleUrls ?? heatSheet.exampleUrls,
    name: raw.name ?? "",
    usingDemo: usingDemo,
  };
}
