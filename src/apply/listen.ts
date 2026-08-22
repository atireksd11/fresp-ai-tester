import { createServer, type Server } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { exec } from "node:child_process";
import { applyPlan } from "./apply.js";
import { packageRoot } from "../config/load.js";

let bound = 7373;

export function reportUrl(): string {
  return "http://127.0.0.1:" + String(bound) + "/logs/report/index.html";
}

export function demoUrl(): string {
  return "http://127.0.0.1:" + String(bound) + "/fixtures/demo/home.html";
}

function mime(file: string): string {
  const ext = extname(file);
  if (ext === ".html") {
    return "text/html; charset=utf-8";
  }
  if (ext === ".css") {
    return "text/css; charset=utf-8";
  }
  if (ext === ".png") {
    return "image/png";
  }
  if (ext === ".js") {
    return "text/javascript; charset=utf-8";
  }
  if (ext === ".json") {
    return "application/json";
  }
  return "application/octet-stream";
}

function under(root: string, abs: string): boolean {
  const rel = abs.slice(root.length).replace(/\\/g, "/").replace(/^\//, "");
  return (
    rel === "logs/report" ||
    rel.startsWith("logs/report/") ||
    rel === "fixtures" ||
    rel.startsWith("fixtures/")
  );
}

function allowed(abs: string): boolean {
  return under(resolve("."), abs) || under(packageRoot, abs);
}

function pickFile(urlPath: string): string | null {
  const rel = decodeURIComponent(urlPath).replace(/^\//, "");
  const cwdHit = resolve(normalize(join(".", rel)));
  const pkgHit = resolve(normalize(join(packageRoot, rel)));
  if (existsSync(cwdHit) && allowed(cwdHit)) {
    return cwdHit;
  }
  if (existsSync(pkgHit) && allowed(pkgHit)) {
    return pkgHit;
  }
  return null;
}

export function openDemo(): void {
  exec('cmd /c start "" "' + demoUrl() + '"');
}

function attach(server: Server): void {
  server.on("request", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.method === "POST" && req.url === "/apply") {
      try {
        applyPlan();
        openDemo();
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("applied — demo opened");
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(String(err));
      }
      return;
    }
    let url = req.url ?? "/";
    const q = url.indexOf("?");
    if (q >= 0) {
      url = url.slice(0, q);
    }
    if (url === "/") {
      url = "/logs/report/index.html";
    }
    const abs = pickFile(url);
    if (!abs || !existsSync(abs) || statSync(abs).isDirectory()) {
      res.writeHead(404);
      res.end("nope");
      return;
    }
    res.writeHead(200, { "Content-Type": mime(abs) });
    res.end(readFileSync(abs));
  });
}

function listenAt(port: number, attempt: number): void {
  const server = createServer();
  attach(server);
  server.on("error", function (err: NodeJS.ErrnoException) {
    if (err.code === "EADDRINUSE" && attempt < 10) {
      listenAt(port + 1, attempt + 1);
      return;
    }
    throw err;
  });
  server.listen(port, function () {
    bound = port;
    console.log("report " + reportUrl());
    console.log("demo " + demoUrl());
  });
}

export function startReportServer(): void {
  const start = Number(process.env.FRESP_PORT) || 7373;
  listenAt(start, 0);
}

const argv1 = process.argv[1] ? process.argv[1].replace(/\\/g, "/") : "";
if (argv1.endsWith("/listen.ts") || argv1.endsWith("/listen.js")) {
  startReportServer();
}
