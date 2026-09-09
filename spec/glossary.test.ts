import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const GLOSSARY = [
  "subsystem",
  "root cause",
  "unscheduled downtime",
  "regression testing",
  "telemetry",
  "manual override",
];

/** Every rendered page except the slide decks (a different markdown chain — see plan §2.4.3) and the 404 page. */
function renderedPages(): string[] {
  const pages: string[] = [];
  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        if (path === resolve("dist/decks")) continue;
        walk(path);
      } else if (name === "index.html") {
        pages.push(path);
      }
    }
  }
  walk(resolve("dist"));
  return pages;
}

function stripCode(html: string): string {
  return html.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, "");
}

describe("glossary — every occurrence is code", () => {
  const pages = renderedPages();

  it("marks every glossary term as code", () => {
    for (const page of pages) {
      const html = readFileSync(page, "utf8");
      const withoutCode = stripCode(html);
      for (const term of GLOSSARY) {
        expect(
          withoutCode.toLowerCase().includes(term.toLowerCase()),
          `${page} has "${term}" outside a <code> element`,
        ).toBe(false);
      }
    }
  });

  it("actually uses the glossary", () => {
    const used = new Set<string>();
    for (const page of pages) {
      const html = readFileSync(page, "utf8");
      const codeSpans = [...html.matchAll(/<code[^>]*>([\s\S]*?)<\/code>/gi)].map((m) =>
        m[1].toLowerCase(),
      );
      for (const term of GLOSSARY) {
        if (codeSpans.some((span) => span.includes(term.toLowerCase()))) {
          used.add(term);
        }
      }
    }
    expect(
      used.size,
      `only ${used.size} of ${GLOSSARY.length} glossary terms are ever marked as code`,
    ).toBeGreaterThanOrEqual(4);
  });

  it("styles code as the systems register", () => {
    // course.css rides brandCss's injectScript mechanism (astro.config.ts),
    // so Astro inlines it into a per-page <style> block rather than the
    // shared dist/_astro/*.css chunk — see spec/treatment.test.ts.
    const astroDir = resolve("dist/_astro");
    const chunkCss = readdirSync(astroDir)
      .filter((name) => name.endsWith(".css"))
      .map((name) => readFileSync(resolve(astroDir, name), "utf8"))
      .join("\n");
    const inlineCss = [
      ...readFileSync(resolve("dist/index.html"), "utf8").matchAll(
        /<style>([\s\S]*?)<\/style>/g,
      ),
    ]
      .map((match) => match[1])
      .join("\n");
    expect(`${chunkCss}\n${inlineCss}`).toMatch(/code\{[^}]*var\(--at-font-mono\)/);
  });
});
