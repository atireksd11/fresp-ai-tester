import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { exec } from "node:child_process";
import { applyPlan } from "./apply.js";

const port = 7373;
export const demoUrl = "http://127.0.0.1:" + String(port) + "/fixtures/demo/home.html";
export const reportUrl = "http://127.0.0.1:" + String(port) + "/logs/report/index.html";

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

function allowed(abs: string): boolean {
  const root = resolve(".");
  const rel = abs.slice(root.length).replace(/\\/g, "/").replace(/^\//, "");
  return (
    rel === "logs/report" ||
    rel.startsWith("logs/report/") ||
    rel === "fixtures" ||
    rel.startsWith("fixtures/")
  );
}

export function openDemo(): void {
  exec('cmd /c start "" "' + demoUrl + '"');
}

export function startReportServer(): void {
  const server = createServer(function (req, res) {
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
    const abs = resolve(normalize(join(".", decodeURIComponent(url))));
    if (!abs.startsWith(resolve(".")) || !allowed(abs) || !existsSync(abs)) {
      res.writeHead(404);
      res.end("nope");
      return;
    }
    if (statSync(abs).isDirectory()) {
      res.writeHead(404);
      res.end("nope");
      return;
    }
    res.writeHead(200, { "Content-Type": mime(abs) });
    res.end(readFileSync(abs));
  });
  server.on("error", function (err: NodeJS.ErrnoException) {
    if (err.code === "EADDRINUSE") {
      console.log("already on 7373 — " + reportUrl);
      return;
    }
    throw err;
  });
  server.listen(port, function () {
    console.log("report " + reportUrl);
    console.log("demo " + demoUrl);
  });
}

const argv1 = process.argv[1] ? process.argv[1].replace(/\\/g, "/") : "";
if (argv1.endsWith("/listen.ts") || argv1.endsWith("/listen.js")) {
  startReportServer();
}
