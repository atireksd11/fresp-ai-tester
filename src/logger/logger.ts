import { appendFileSync, mkdirSync } from "node:fs";

export function log(message: string): void {
    mkdirSync("logs", { recursive: true });
    const time = new Date().toISOString();
    const line = time + " " + message;
    console.log(line);
    appendFileSync("logs/run.txt", line + "\n");
}