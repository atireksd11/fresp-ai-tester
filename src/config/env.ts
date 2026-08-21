import { existsSync, readFileSync } from "node:fs";

export function loadEnv(): void {
    if (!existsSync(".env")) {
        return;
    }
    const text = readFileSync(".env", "utf8");
    const lines = text.split("\n");
    for (const line of lines) {
        const t = line.trim();;
        if (!t || t.startsWith("#")) {
            continue;
        }
        const i = t.indexOf("=");
        if (i < 1) {
            continue;
        }
        const k = t.slice(0, i).trim();
        const v = t.slice(i + 1).trim();
        if (!process.env[k]) {
            process.env[k] = v;
        }
    }
}
