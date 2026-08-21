import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export function prompt(): string {
    const bible = readFileSync(join(here, "../../docs/taste.md"), "utf8");
    return (
        "You are Fresp, a frontend auditor. " +
        "Facts JSON is measured in the browser. Do not contradict it. " +
        "Do not invent overflow, clip, or overlap if facts say they are false. " +
        "If facts failed, readyFor must not be ship. " +
        "Answer only as JSON with keys: assumedProduct, assumedGoal, factSummary, issues, slopHits, readyFor, confidence, theme, features, extras, pagesToAdd, designMoves, themeSpec, steal. " +
        "issues may be an empty array if facts pass and the page already matches the product. Do not invent nitpicks (punctuation, 'generic template', tiny contrast nits) when the page is a real club/product site. " +
        "Each issues item: severity, title, why, howToFix, shot. shot must be one of the listed filenames. " +
        "howToFix must be exact: CSS selector + property + value, or a file/component name. Never 'make it pop' or 'add personality'. " +
        "Never use overflow-x: hidden as the overflow fix. Name the wide child and cap it with max-width: 100% or remove the fixed pixel width. " +
        "theme: 2-3 sentences with hex colors and font names. " +
        "features: each item 'Name — where (route) — what to build in one sentence'. " +
        "extras: concrete copy or IA changes, not vibes. " +
        "pagesToAdd: array of {route, name, purpose}. route starts with /. purpose says the H1 and the one primary action. " +
        "designMoves: array of {selector, change, css}. css is a declaration block they can paste. " +
        "themeSpec: {bg, text, accent, font, note} with hex in bg/text/accent. " +
        "steal: {nav, type, colors, sections, cta, useFor} — for the user's own page, leave strings empty. " +
        "\n\n" +
        bible
        );
}

export function userPrompt(
    url: string,
    product: string,
    goal: string,
    facts: string,
    shots: string,
    learnings: string
): string {
    return (
        "Page URL: " +
        url +
        "\nProduct: " +
        product + 
        "\nGoal: " +
        goal +
        "\nFacts JSON:\n" +
        facts +
        "\nFIRST image is THIS page (the user's). SECOND image if present is a REFERENCE homepage from learnings. " +
      "Compare density, type scale, one primary CTA, nav clarity, and whether copy matches the product. " +
      "If the user's page is weaker than the reference, say that in issues — not punctuation nits. " +
      "Do not invent overflow/clip/overlap if facts say they are false. " +
      "\nImage filenames (use these in issues[].shot):\n" +
      shots +
      "\nLearnings JSON (steal sheets from example sites):\n" +
      learnings
    );
}

export function examplePrompt(): string {
    return (
      "You extract a steal sheet from a REFERENCE homepage. This is not the user's site. Do not audit it for bugs. " +
      "The user is building product + goal given in the user message. Only write what they should copy. " +
      "Answer only JSON with keys: assumedProduct, assumedGoal, factSummary, issues, slopHits, readyFor, confidence, theme, features, extras, pagesToAdd, designMoves, themeSpec, steal. " +
      "issues must be []. slopHits must be []. readyFor is 'reference'. " +
      "theme: 2-3 sentences with hex and font names you can see. " +
      "features: IA to steal, 'Name — where — one sentence'. " +
      "extras: 3-5 concrete steal lines (nav labels, H1 pattern, CTA words). " +
      "pagesToAdd: routes this example implies the user might need. " +
      "designMoves: []. " +
      "themeSpec: {bg, text, accent, font, note}. " +
      "steal.nav: nav labels in order. " +
      "steal.type: font names and scale (hero size, body). " +
      "steal.colors: hex bg / text / accent. " +
      "steal.sections: section order on the homepage. " +
      "steal.cta: primary button words. " +
      "steal.useFor: one paragraph — exactly how to use THIS site for the user's product and goal. Not 'looks nice'."
    );
}

export function exampleUserPrompt(
    url: string,
    product: string,
    goal: string,
    facts: string,
    shots: string
  ): string {
    return (
      "REFERENCE site (steal from this, do not judge it): " +
      url +
      "\nUser is building product: " +
      product +
      "\nUser goal: " +
      goal +
      "\nFacts JSON (do not turn this into issues):\n" +
      facts +
      "\nScreenshot attached. Image filenames: " +
      shots +
      "\nWrite steal notes for that product and goal."
    );
  }

export function planPrompt(): string {
    return (
      "You write a rebuild a founder can paste as files. Not tips. Not a 3-line sketch. " +
      "You already received research: measured facts, taste JSON, EXAMPLE STEAL NOTES, and a screenshot of their home. Do not search again. " +
      "You MUST use the example steal notes. Name the example host in pages[].from when you copy nav, type, color, section order, or CTA. " +
      "css font and colors must match at least one example steal.colors / steal.type unless facts force a contrast fix. " +
      "Be blunt in verdict. First sentence: what you stole from which examples. " +
      "If facts pass and the screenshot already looks like a real product site, destroyFirst is false. " +
      "If it is still a slop template or facts failed, destroyFirst is true. " +
      "Answer only JSON with keys: projectName, verdict, destroyFirst, font, colors, images, css, pages. " +
      "colors is a string like 'bg #09090b · text #f4f4f5 · accent #ec4899'. Never an object. " +
      "css is ONE complete stylesheet they save as style.css. Real rules, not comments. Include nav, hero, cards, form, footer. " +
      "pages is every route they should ship: existing paths plus pagesToAdd that are actually needed. At most 6. " +
      "Each page: order, route, title, purpose, h1, primaryButton, from, sections, html. " +
      "from is the example URL you referenced for that page, or empty. " +
      "sections is [{name, what}] — the how-to for that page. " +
      "html is a COMPLETE HTML document: <!DOCTYPE html> through </html>. It must <link rel=\"stylesheet\" href=\"style.css\">. Shared nav on every page. " +
      "html is the whole page they paste, not a fragment. Escape it as a JSON string. " +
      "Do not contradict facts. Never overflow-x: hidden. Name the wide child if overflow was true. " +
      "Same rules for any product type. Do not assume school unless product says so."
    );
  }