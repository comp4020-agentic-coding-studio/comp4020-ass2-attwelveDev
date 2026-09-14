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
  it("declares one shared alpha, blur radius, and saturate token", () => {
    const css = bundledCss();
    expect(css).toMatch(/--course-chrome-alpha:\s*[\d.]+%/);
    expect(css).toMatch(/--course-chrome-blur:\s*[\d.]+px/);
    expect(css).toMatch(/--course-chrome-saturate:\s*[\d.]+%/);
  });

  it("gives the entry-nav footer a translucent, blurred, saturated background using the shared tokens", () => {
    const css = bundledCss();
    // The minifier can merge .week-nav into a combined selector list (e.g.
    // ".week-nav,.at-nav{...}") when rules end up with identical
    // declarations, so match on the rule containing .week-nav rather than
    // assuming it's the sole selector.
    const rule = css.match(/[^}]*\.week-nav[^{]*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toContain("var(--course-chrome-alpha)");
    expect(rule).toContain("var(--course-chrome-blur)");
    expect(rule).toContain("var(--course-chrome-saturate)");
    expect(rule).toContain("color-mix(");
  });

  it("gives the site nav bar the same treatment", () => {
    const rule = courseCssSource.match(/\.at-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(rule).toContain("var(--course-chrome-alpha)");
    expect(rule).toContain("var(--course-chrome-blur)");
    expect(rule).toContain("var(--course-chrome-saturate)");
    const css = bundledCss();
    expect(css).toMatch(/--course-chrome-alpha:/);
    expect(css).toMatch(/--course-chrome-blur:/);
  });

  it("gives the search panel the same treatment", () => {
    const rule = courseCssSource.match(/\.at-search-panel\s*{[^}]*}/)?.[0] ?? "";
    expect(rule).toContain("var(--course-chrome-alpha)");
    expect(rule).toContain("var(--course-chrome-blur)");
    expect(rule).toContain("var(--course-chrome-saturate)");
    const css = bundledCss();
    expect(css).toMatch(/--course-chrome-alpha:/);
    expect(css).toMatch(/--course-chrome-blur:/);
  });

  it("makes the entry-nav footer itself full-viewport-width, re-centering its content separately", () => {
    // .week-nav is position: fixed with inset-inline: 0, so its
    // background/blur naturally reach both viewport edges without any
    // pseudo-element trick — but that also means .week-nav-inner (the
    // actual links/label) needs its own max-width + margin-inline: auto
    // to stay at a readable row width instead of stretching full-bleed too.
    const entryNavSource = readFileSync(resolve("src/components/EntryNav.astro"), "utf8");
    const weekNavRule = entryNavSource.match(/\.week-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(weekNavRule).toMatch(/position:\s*fixed/);
    expect(weekNavRule).toMatch(/inset-inline:\s*0/);
    const innerRule = entryNavSource.match(/\.week-nav-inner\s*{[^}]*}/)?.[0] ?? "";
    expect(innerRule).toMatch(/max-width/);
    expect(innerRule).toMatch(/margin-inline:\s*auto/);
  });

  it("reserves room at the end of the page so the fixed footer doesn't cover the site footer", () => {
    const css = bundledCss();
    expect(css).toMatch(/--course-entry-nav-height:\s*[\d.]+rem/);
    const rule = courseCssSource.match(/body:has\(\.week-nav\)\s*{[^}]*}/)?.[0] ?? "";
    expect(rule).toContain("var(--course-entry-nav-height)");
  });

  it("mixes every surface's tint from --at-bg-elevated, not a hardcoded colour", () => {
    // --at-bg and --at-bg-elevated are identical in light mode
    // (tokens.css:69-80), so a tint mixed from plain --at-bg would be
    // mathematically invisible over the page's own flat background there —
    // color-mix'ing X% of a colour with transparent, composited over a
    // backdrop that's that same colour, renders back to that exact colour.
    // --at-bg-elevated gives the three surfaces a token that actually
    // differs from the page background in dark mode, and combines with the
    // shadow below to demarcate the panel in light mode too.
    const atBgElevatedMatches =
      courseCssSource.match(/color-mix\(in oklch, var\(--at-bg-elevated\)/g) ?? [];
    expect(atBgElevatedMatches.length).toBeGreaterThanOrEqual(3);
  });

  it("gives the entry-nav header and site nav a shadow so the panel reads as distinct even in light mode", () => {
    // In light mode --at-bg-elevated equals --at-bg exactly, so the tint
    // alone can't demarcate the panel from the page — the shadow is what
    // actually does that job there.
    const weekNavRule = courseCssSource.match(/\.week-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(weekNavRule).toContain("var(--at-shadow-md)");
    const atNavRule = courseCssSource.match(/\.at-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(atNavRule).toContain("var(--at-shadow-md)");
  });

  it("gives the site nav bar the same divider border as the entry-nav footer", () => {
    // .week-nav's border-block-start (EntryNav.astro) and .at-nav's
    // border-block-end (here) sit on the edge each bar shares with the
    // page content, mirroring each other — both keyed off the same
    // --at-divider token, not independently hardcoded values.
    const entryNavSource = readFileSync(resolve("src/components/EntryNav.astro"), "utf8");
    const weekNavRule = entryNavSource.match(/\.week-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(weekNavRule).toMatch(/border-block-start:\s*1px solid var\(--at-divider\)/);
    const atNavRule = courseCssSource.match(/\.at-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(atNavRule).toMatch(/border-block-end:\s*1px solid var\(--at-divider\)/);
  });
});
