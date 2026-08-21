import { writeFileSync } from "node:fs";
import { mkdirSync } from "node:fs";

function pickUrls(text: string): string[] {
  const found = text.match(/https:\/\/[^\s"'<>\]]+/g) ?? [];
  const out: string[] = [];
  for (const raw of found) {
    const u = raw.replace(/[.,)]+$/, "");
    if (!u.startsWith("https://")) {
      continue;
    }
    if (u.includes("google.com") || u.includes("youtube.com")) {
      continue;
    }
    if (out.indexOf(u) === -1) {
      out.push(u);
    }
    if (out.length === 3) {
      break;
    }
  }
  return out;
}

export async function findExamples(product: string, goal: string): Promise<string[]> {
  const key = process.env.FRESP_API_KEY;
  if (!key) {
    return [];
  }
  const base = process.env.FRESP_API_BASE ?? "https://openrouter.ai/api/v1";
  const model = process.env.FRESP_MODEL ?? "google/gemini-3.5-flash-lite";
  const res = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/atireksd11/fresp-ai-tester",
      "X-Title": "Fresp",
    },
    body: JSON.stringify({
      model: model,
      tools: [{ type: "openrouter:web_search" }],
      messages: [
        {
          role: "user",
          content:
            "Search the public web for 3 real live homepages of student club or school extra-curricular PRODUCT sites " +
            "(event signup, club OS, campus groups), goal: " +
            goal +
            ". Product label: " +
            product +
            ". Not K-12 district news homepages, not Wikipedia, not GitHub, not Google. " +
            "Reply with ONLY a JSON array of 3 https URLs.",
        },
      ],
    }),
  });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  const urls = pickUrls(text);
  mkdirSync("logs", { recursive: true });
  writeFileSync("logs/examples.json", JSON.stringify(urls, null, 2));
  return urls;
}