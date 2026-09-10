import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Starting point per plan §4.2 — expected to grow as rewriting surfaces new
// drift; extend this list, don't just fix the one instance.
const BANNED_TERMS = [
  "systems engineering",
  "root-cause analysis",
  "root cause",
  "regression check",
  "regression test",
  "manual override",
  "subsystem",
  "runtime",
  "deploy",
  "merge conflict",
  "tcp/ip",
  "handshake",
  "handshake protocol",
  "cache invalidation",
  "technical debt",
  "protocol",
  "debug",
  "debugging",
  "debuggable",
  "interface call",
  "supply chain",
  "reorder point",
  "telemetry",
  "unscheduled downtime",
  "retry logic",
  "coordination mechanism",
  "social debugging",
  "resource allocation",
];

const FRAMING_PHRASES = [
  "taught as",
  "framed as",
  "presented as",
  "in the style of",
  "assessed like a",
];

const GENDERED_TERMS = ["girlfriend", "boyfriend", "the girl you like", "the guy you like"];

interface RenderedPage {
  path: string;
  id: string;
}

/** Every rendered page except the slide decks (a different markdown chain) and the 404 page. */
function renderedContentPages(): RenderedPage[] {
  const pages: RenderedPage[] = [];
  const root = resolve("dist");
  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        if (path === resolve("dist/decks")) continue;
        walk(path);
      } else if (name === "index.html") {
        pages.push({ path, id: relative(root, path) });
      }
    }
  }
  walk(root);
  return pages;
}

/**
 * Locates a heading whose visible text starts with `text` — headings render
 * with a trailing anchor-link element (`<h2 id="...">Text<a ...>#</a></h2>`),
 * so this matches the opening tag through the start of `text` and then finds
 * the corresponding closing tag, rather than requiring an exact `</hN>`
 * immediately after the text. Local copy of spec/weekly-structure.test.ts's
 * helper — not exported there, so it can't be imported.
 */
function findHeading(html: string, text: string): { start: number; end: number } {
  const openMatch = html.match(new RegExp(`<h[1-6][^>]*>${text}<`));
  if (!openMatch || openMatch.index === undefined) return { start: -1, end: -1 };
  const start = openMatch.index;
  const closeStart = html.indexOf("</h", start);
  if (closeStart === -1) return { start, end: start };
  const closeEnd = html.indexOf(">", closeStart) + 1;
  return { start, end: closeEnd };
}

function nextHeadingIndex(html: string, fromIndex: number): number {
  const rest = html.slice(fromIndex);
  const match = rest.match(/<h[1-6][^>]*>/);
  return match && match.index !== undefined ? fromIndex + match.index : html.length;
}

/** Slices out just the named section's body (between its heading and the next heading). */
function sectionBody(html: string, heading: string): string {
  const { start, end } = findHeading(html, heading);
  if (start === -1) return "";
  const next = nextHeadingIndex(html, end);
  return html.slice(end, next);
}

/** The policies page's sincere disclosure section is exempt from F1-F3; strip it before checking. */
function stripDisclosure(html: string): string {
  const { start } = findHeading(html, "Content and disclosure");
  if (start === -1) return html;
  return html.slice(0, start);
}

describe("voice — banned terms (F2)", () => {
  const pages = renderedContentPages();

  it.each(pages)("$id carries no banned jargon term", ({ path, id }) => {
    const html = readFileSync(path, "utf8");
    const scoped = id === "policies/index.html" ? stripDisclosure(html) : html;
    const lower = scoped.toLowerCase();
    for (const term of BANNED_TERMS) {
      expect(lower.includes(term), `${id} contains banned term "${term}"`).toBe(false);
    }
  });
});

describe("voice — no code-styled spans (F3)", () => {
  const pages = renderedContentPages();

  it.each(pages)("$id has no <code> element", ({ path, id }) => {
    const html = readFileSync(path, "utf8");
    expect(/<code[^>]*>/.test(html), `${id} contains a <code> element`).toBe(false);
  });
});

describe("voice — framing narration (F4)", () => {
  it("homepage never narrates its own premise", () => {
    const html = readFileSync(resolve("dist/index.html"), "utf8");
    const lower = html.toLowerCase();
    for (const phrase of FRAMING_PHRASES) {
      expect(lower.includes(phrase), `homepage contains framing phrase "${phrase}"`).toBe(false);
    }
  });

  const lecturePages = renderedContentPages().filter(
    (page) => page.id.startsWith("lectures/week-") && page.id.endsWith("/index.html"),
  );

  it.each(lecturePages)("$id's Overview section never narrates its own premise", ({ path, id }) => {
    const html = readFileSync(path, "utf8");
    const overview = sectionBody(html, "Overview").toLowerCase();
    for (const phrase of FRAMING_PHRASES) {
      expect(overview.includes(phrase), `${id}'s Overview contains framing phrase "${phrase}"`).toBe(
        false,
      );
    }
  });
});

describe("voice — gendered pairing (F5)", () => {
  it("week 9's lecture uses gender-neutral relationship language only", () => {
    const html = readFileSync(resolve("dist/lectures/week-09/index.html"), "utf8");
    const lower = html.toLowerCase();
    for (const term of GENDERED_TERMS) {
      expect(lower.includes(term), `lectures/week-09 contains gendered term "${term}"`).toBe(false);
    }
  });

  it("week 9's Lab uses gender-neutral relationship language only", () => {
    const html = readFileSync(resolve("dist/sessions/week-09/index.html"), "utf8");
    const lower = html.toLowerCase();
    for (const term of GENDERED_TERMS) {
      expect(lower.includes(term), `sessions/week-09 contains gendered term "${term}"`).toBe(false);
    }
  });
});
