import { appendFileSync } from "node:fs"; 


export function log(message: string): void {
    const time = new Date().toISOString();
    const line = time + " " + message;
    console.log(line);
    appendFileSync("logs/run.txt", line + "\n");
}