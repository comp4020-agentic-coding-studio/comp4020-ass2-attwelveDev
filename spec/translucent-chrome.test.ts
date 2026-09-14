import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Same technique as spec/treatment.test.ts's own bundledCss() — course.css
 * rides Astro's brandCss inline-injection mechanism rather than shipping as
 * its own extracted chunk, so a token assertion must check both sources.
 */
function bundledCss(): string {
  const astroDir = resolve("dist/_astro");
  const chunkCss = readdirSync(astroDir)
    .filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(resolve(astroDir, name), "utf8"))
    .join("\n");
  const inlineCss = [
    ...readFileSync(resolve("dist/index.html"), "utf8").matchAll(/<style>([\s\S]*?)<\/style>/g),
  ]
    .map((match) => match[1])
    .join("\n");
  return `${chunkCss}\n${inlineCss}`;
}

const courseCssSource = readFileSync(resolve("src/styles/course.css"), "utf8");

describe("translucent chrome", () => {
  it("declares one shared alpha and blur radius token", () => {
    const css = bundledCss();
    expect(css).toMatch(/--course-chrome-alpha:\s*[\d.]+%/);
    expect(css).toMatch(/--course-chrome-blur:\s*[\d.]+px/);
  });

  it("gives the entry-nav header a translucent, blurred background using the shared tokens", () => {
    const css = bundledCss();
    // The minifier can merge .week-nav into a combined selector list (e.g.
    // ".week-nav,.at-nav{...}") when the two rules end up with identical
    // declarations, so match on the rule containing .week-nav rather than
    // assuming it's the sole selector.
    const rule = css.match(/[^}]*\.week-nav[^{]*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toContain("var(--course-chrome-alpha)");
    expect(rule).toContain("var(--course-chrome-blur)");
    expect(rule).toContain("color-mix(");
  });

  it("gives the site nav bar the same treatment", () => {
    const rule = courseCssSource.match(/\.at-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(rule).toContain("var(--course-chrome-alpha)");
    expect(rule).toContain("var(--course-chrome-blur)");
    const css = bundledCss();
    expect(css).toMatch(/--course-chrome-alpha:/);
    expect(css).toMatch(/--course-chrome-blur:/);
  });

  it("gives the search panel the same treatment", () => {
    const rule = courseCssSource.match(/\.at-search-panel\s*{[^}]*}/)?.[0] ?? "";
    expect(rule).toContain("var(--course-chrome-alpha)");
    expect(rule).toContain("var(--course-chrome-blur)");
    const css = bundledCss();
    expect(css).toMatch(/--course-chrome-alpha:/);
    expect(css).toMatch(/--course-chrome-blur:/);
  });

  it("keeps the background over each surface's own token, not a hardcoded colour", () => {
    const atBgMatches = courseCssSource.match(/color-mix\(in oklch, var\(--at-bg\)/g) ?? [];
    expect(atBgMatches.length).toBeGreaterThanOrEqual(2);
    const atBgElevatedMatches =
      courseCssSource.match(/color-mix\(in oklch, var\(--at-bg-elevated\)/g) ?? [];
    expect(atBgElevatedMatches.length).toBeGreaterThanOrEqual(1);
  });
});
