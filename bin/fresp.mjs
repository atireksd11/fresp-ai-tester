#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = join(root, "src", "logger", "run.ts");

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tsxRoot = dirname(require.resolve("tsx/package.json"));
const tsxCli = join(tsxRoot, "dist", "cli.mjs");

spawnSync(process.execPath, [tsxCli, run], {
  cwd: root,
  stdio: "inherit",
});