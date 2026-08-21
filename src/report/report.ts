import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RebuildPlan } from "../types/plan.js";
import type { PageAudit } from "../types/audit.js";
import type { DesignMove, PageToAdd, TasteResult } from "../types/taste.js";

const here = dirname(fileURLToPath(import.meta.url));

function copyCss(): void {
    mkdirSync("logs/report", { recursive: true });
    const css = readFileSync(join(here, "report.css"), "utf8");
    writeFileSync("logs/report/report.css", css);
    const mark = join(here, "../../logo/nav.png");
    const fav = join(here, "../../logo/1.png");
    if (existsSync(mark)) {
        copyFileSync(mark, join("logs/report", "fresp-mark.png"));
    }
    if (existsSync(fav)) {
        copyFileSync(fav, join("logs/report", "fresp-favicon.png"));
    }
}

function esc(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function shot(file: string, alt: string): string {
    return (
        '<img src="../../fixtures/baselines/' +
        esc(file) +
        '" alt="' +
        esc(alt) +
        '">'
    );
}

function pill(ok: boolean): string {
    const label = ok ? "pass" : "fail";
    return '<span class="fr-pill ' + label + '">' + label + "</span>";
}

function failN(pages: PageAudit[]): number {
    let n = 0;
    for (const r of pages) {
        if (!r.passed) {
            n = n + 1;
        }
    }
    return n;
}

function issueN(pages: PageAudit[]): number {
    let n = 0;
    for (const r of pages) {
        if (!r.taste.skipped) {
            n = n + r.taste.issues.length;
        }
    }
    return n;
}

function host(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
}

function steal(r: PageAudit): string {
    if (r.taste.skipped) {
        return r.taste.reason;
    }
    if (r.taste.steal && r.taste.steal.useFor) {
        return r.taste.steal.useFor;
    }
    if (r.taste.extras[0]) {
        return r.taste.extras[0];
    }
    return r.taste.theme;
}

function slop(r: PageAudit): string {
    if (r.taste.slopHits[0]) {
        return r.taste.slopHits[0];
    }
    return r.notes;
}

function live(pages: PageAudit[]): PageAudit[] {
    const out: PageAudit[] = [];
    for (const r of pages) {
        if (!r.taste.skipped) {
            out.push(r);
        }
    }
    return out;
}

function uniqAdds(pages: PageAudit[]): PageToAdd[] {
    const seen: Record<string, boolean> = {};
    const out: PageToAdd[] = [];
    for (const r of live(pages)) {
        for (const p of r.taste.pagesToAdd) {
            if (!seen[p.route]) {
                seen[p.route] = true;
                out.push(p);
            }
        }
    }
    return out;
}

function uniqMoves(pages: PageAudit[]): DesignMove[] {
    const seen: Record<string, boolean> = {};
    const out: DesignMove[] = [];
    for (const r of live(pages)) {
        for (const m of r.taste.designMoves) {
            const k = m.selector + m.css;
            if (!seen[k]) {
                seen[k] = true;
                out.push(m);
            }
        }
    }
    return out;
}

function themeOf(pages: PageAudit[]): TasteResult | null {
    const first = live(pages)[0];
    return first ? first.taste : null;
}

function mode(plan: RebuildPlan): string {
    if (plan.skipped) {
        return plan.reason;
    }
    if (plan.destroyFirst) {
        return "Start over. Do not polish the current pages.";
    }
    return "Keep the bones. Rebuild in this order.";
}

function colorsOf(plan: RebuildPlan): string {
    if (!plan.colors || plan.colors === "[object Object]") {
        return "see step CSS";
    }
    return plan.colors;
}

function nav(on: string): string {
    const item = (href: string, label: string) =>
        '<a href="' +
        href +
        '"' +
        (on === href ? ' class="is-on"' : "") +
        ">" +
        label +
        "</a>";
    return (
        '<nav class="fr-nav">' +
        item("index.html", "Overview") +
        item("plan.html", "Plan") +
        item("yours.html", "Pages") +
        item("suggest.html", "Playbook") +
        item("examples.html", "Examples") +
        item("compare.html", "Compare") +
        "</nav>"
    );
}

function shell(title: string, sub: string, body: string, on: string): string {
    return (
        "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        "<title>" +
        esc(title) +
        "</title>" +
        '<link rel="preconnect" href="https://fonts.googleapis.com">' +
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
        '<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">' +
        '<link rel="stylesheet" href="report.css">' +
        '<link rel="icon" href="fresp-favicon.png" type="image/png">' +
        "</head><body class=\"fr\">" +
        '<header class="fr-top"><a class="fr-brand" href="index.html"><img class="fr-logo" src="fresp-mark.png" alt="Fresp"><span class="fr-mark">Fresp</span></a>' +
        nav(on) +
        "</header><div class=\"fr-page\">" +
        '<p class="fr-kicker">Audit report</p>' +
        '<h1 class="fr-display">' +
        esc(title) +
        '</h1><p class="fr-lede">' +
        esc(sub) +
        "</p>" +
        body +
        "</div></body></html>"
    );
}

function issueList(r: PageAudit): string {
    if (r.taste.skipped) {
        return "";
    }
    let html = "";
    for (const issue of r.taste.issues) {
        const file =
            r.sections.includes(issue.shot) || issue.shot === r.shot ? issue.shot : r.shot;
        html =
            html +
            '<div class="fr-issue"><div><p class="fr-step-num">' +
            esc(issue.severity) +
            "</p><h3>" +
            esc(issue.title) +
            '</h3><p class="fr-muted">' +
            esc(issue.why) +
            '</p><pre class="fr-code">' +
            esc(issue.howToFix) +
            "</pre></div>" +
            shot(file, issue.title) +
            "</div>";
    }
    return html;
}



function card(r: PageAudit): string {
    return (
        '<article class="fr-card">' +
        "<h2>" +
        esc(r.url) +
        " " +
        pill(r.passed) +
        "</h2>" +
        '<p class="fr-muted">Facts: ' +
        esc(r.notes) +
        " · " +
        (r.taste.skipped ? "AI skipped — " + esc(r.taste.reason) : esc(r.taste.readyFor)) +
        "</p>" +
        issueList(r) +
        shot(r.shot, "full page") +
        "</article>"
    );
}

function bullets(items: string[]): string {
    let html = '<ul class="fr-list">';
    for (const item of items) {
        html = html + "<li>" + esc(item) + "</li>";
    }
    return html + "</ul>";
}

function suggestPage(yours: PageAudit[]): string {
    const t = themeOf(yours);
    if (!t) {
        return shell("Playbook", "No taste this run", "<p class=\"fr-muted\">AI skipped.</p>", "suggest.html");
    }
    const spec = t.themeSpec;
    let pages = "";
    for (const p of uniqAdds(yours)) {
        pages =
            pages +
            '<div class="fr-card"><b>' +
            esc(p.route) +
            "</b> · " +
            esc(p.name) +
            '<p class="fr-muted">' +
            esc(p.purpose) +
            "</p></div>";
    }
    let moves = "";
    for (const m of uniqMoves(yours)) {
        moves =
            moves +
            '<div class="fr-card"><code>' +
            esc(m.selector) +
            '</code><p class="fr-muted">' +
            esc(m.change) +
            '</p><pre class="fr-code">' +
            esc(m.css) +
            "</pre></div>";
    }
    const body =
        '<article class="fr-card"><h2>Theme</h2><p>bg ' +
        esc(spec.bg) +
        " · text " +
        esc(spec.text) +
        " · accent " +
        esc(spec.accent) +
        " · " +
        esc(spec.font) +
        "</p><p class=\"fr-muted\">" +
        esc(spec.note || t.theme) +
        "</p></article>" +
        "<h3>Pages to add</h3>" +
        (pages || "<p class=\"fr-muted\">None listed</p>") +
        "<h3>Paste-these CSS moves</h3>" +
        (moves || "<p class=\"fr-muted\">None listed</p>") +
        "<h3>Features</h3>" +
        bullets(t.features) +
        "<h3>Also</h3>" +
        bullets(t.extras);
    return shell("Playbook", "One steal sheet — tokens, pages, CSS", body, "suggest.html");
}


function comparePage(yours: PageAudit[], examples: PageAudit[]): string {
    if (examples.length === 0) {
        return shell(
            "Compare",
            "Pin https URLs in heatSheet.exampleUrls, then run again.",
            "<p class=\"fr-muted\">No example sites this run.</p>",
            "compare.html"
        );
    }
    const home = yours[0];
    if (!home) {
        return shell("Compare", "No pages audited", "<p class=\"fr-muted\">Nothing to compare.</p>", "compare.html");
    }
    let pairs = "";
    for (const ex of examples) {
        pairs =
            pairs +
            '<article class="fr-card"><h2>' +
            esc(host(ex.url)) +
            '</h2><div class="fr-shots"><figure>' +
            shot(home.shot, "yours") +
            "<figcaption>Yours</figcaption></figure><figure>" +
            shot(ex.shot, host(ex.url)) +
            "<figcaption>" +
            esc(ex.url) +
            "</figcaption></figure></div>" +
            '<p class="fr-muted"><b>They:</b> ' +
            esc(steal(ex)) +
            "</p><p class=\"fr-muted\"><b>You:</b> " +
            esc(slop(home)) +
            "</p></article>";
    }
    return shell("Compare", "Your home vs example homepages", pairs, "compare.html");
}

function codeDlg(id: string, label: string, code: string): string {
  return (
    '<button type="button" class="fr-cta" onclick="document.getElementById(\'' +
    id +
    '\').showModal()">' +
    label +
    '</button><dialog id="' +
    id +
    '"><form method="dialog"><button class="fr-ghost">Close</button></form><pre class="fr-code">' +
    esc(code) +
    "</pre></dialog>"
  );
}

function planPage(plan: RebuildPlan): string {
  if (plan.skipped) {
    return shell("Plan", "not run", "<p class=\"fr-muted\">" + esc(plan.reason) + "</p>", "plan.html");
  }
  const pages = plan.pages ?? [];
  let cards = "";
  let n = 0;
  for (const p of pages) {
    const id = "page-" + String(n);
    n = n + 1;
    let how = "";
    for (const s of p.sections) {
      how = how + "<li><b>" + esc(s.name) + "</b> — " + esc(s.what) + "</li>";
    }
    cards =
      cards +
      '<article class="fr-card"><p class="fr-step-num">Page 0' +
      String(p.order) +
      "</p><h2>" +
      esc(p.route) +
      " — " +
      esc(p.title) +
      "</h2><p class=\"fr-muted\">" +
      esc(p.purpose) +
      "</p><p><b>H1:</b> " +
      esc(p.h1) +
      " · <b>Button:</b> " +
      esc(p.primaryButton) +
      "</p>" +
      (p.from ? '<p class="fr-muted">From ' + esc(p.from) + "</p>" : "") +
      (how ? '<ul class="fr-list">' + how + "</ul>" : "") +
      codeDlg(id, "View full HTML", p.html) +
      "</article>";
  }
  const body =
    '<article class="fr-card"><p><b>Font:</b> ' +
    esc(plan.font) +
    " · <b>Colors:</b> " +
    esc(colorsOf(plan)) +
    " · <b>Images:</b> " +
    esc(plan.images) +
    "</p>" +
    (plan.css ? codeDlg("css-shared", "View style.css", plan.css) : "") +
    '<button type="button" class="fr-cta" id="fr-apply">Apply to demo</button>' +
    '<p class="fr-muted" id="fr-apply-msg">Writes fixtures/demo (backup in logs/backups/) and opens it in the browser.</p>' +
    "<script>document.getElementById('fr-apply').onclick=function(){var b=document.getElementById('fr-apply');var m=document.getElementById('fr-apply-msg');m.textContent='applying…';fetch('http://127.0.0.1:7373/apply',{method:'POST'}).then(function(r){return r.text()}).then(function(t){m.textContent=t;b.style.display='none'}).catch(function(){m.textContent='Keep this terminal open after npm run log or npm run report.'})}</script>" +
    "</article>" +
    cards;
  return shell("Rebuild", mode(plan), body, "plan.html");
}

export function writeReport(results: PageAudit[], plan: RebuildPlan): void {
    const yours = results.filter(function (r) {
        return r.kind !== "example";
    });
    const examples = results.filter(function (r) {
        return r.kind === "example";
    });
    let rows = "";
    let links = "";
    for (const r of yours) {
        rows = rows + card(r);
        links = links + "<li>" + esc(r.url) + " " + pill(r.passed) + "</li>";
    }
    const home = yours[0];
    copyCss();
    writeFileSync(
        "logs/report/yours.html",
        shell("Pages", String(failN(yours)) + " failed of " + String(yours.length), rows, "yours.html")
    );
    const indexBody =
        '<div class="fr-stats">' +
        '<div class="fr-stat"><b>' +
        String(failN(yours)) +
        "</b><span>fact fails</span></div>" +
        '<div class="fr-stat"><b>' +
        String(issueN(yours)) +
        "</b><span>taste issues</span></div>" +
        '<div class="fr-stat"><b>' +
        String(examples.length) +
        "</b><span>examples</span></div></div>" +
        '<a class="fr-cta" href="plan.html">Open rebuild plan</a>' +
        (home ? shot(home.shot, "home") : "") +
        '<ul class="fr-list">' +
        links +
        "</ul>";
    writeFileSync(
        "logs/report/index.html",
        shell(
            plan.projectName || "Overview",
            plan.verdict || "Fresp run",
            indexBody,
            "index.html"
        )
    );
    let exRows = "";
    for (const r of examples) {
      exRows =
        exRows +
        '<article class="fr-card"><h2>' +
        esc(host(r.url)) +
        "</h2>" +
        shot(r.shot, host(r.url)) +
        '<p class="fr-muted"><b>Use for:</b> ' +
        esc(steal(r)) +
        "</p><p class=\"fr-muted\"><b>Nav:</b> " +
        esc(r.taste.steal ? r.taste.steal.nav : "") +
        " · <b>CTA:</b> " +
        esc(r.taste.steal ? r.taste.steal.cta : "") +
        "</p></article>";
    }
    writeFileSync(
      "logs/report/examples.html",
      shell(
        "Examples",
        examples.length === 0 ? "Pin URLs in heatSheet.exampleUrls" : "What to steal",
        exRows === "" ? "<p class=\"fr-muted\">None this run.</p>" : exRows,
        "examples.html"
      )
    );
    writeFileSync("logs/report/compare.html", comparePage(yours, examples));
    writeFileSync("logs/report/suggest.html", suggestPage(yours));
    writeFileSync("logs/report/plan.html", planPage(plan));
}
