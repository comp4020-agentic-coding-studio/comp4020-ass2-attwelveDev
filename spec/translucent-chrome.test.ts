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

  it("gives the entry-nav header a translucent, blurred, saturated background using the shared tokens", () => {
    const css = bundledCss();
    // .week-nav's background/blur live on its ::before pseudo-element (see
    // EntryNav.astro), not on .week-nav itself — it needs to extend past
    // .week-nav's own box to reach the viewport edges. The minifier can
    // also merge this into a combined selector list (e.g.
    // ".week-nav::before,.at-nav{...}") when rules end up with identical
    // declarations, so match on the rule containing .week-nav rather than
    // assuming it's the sole selector.
    const rule = css.match(/[^}]*\.week-nav[^{]*\{[^}]*\}/)?.[0] ?? "";
    // The minifier can rewrite ::before to the legacy single-colon :before.
    expect(rule).toMatch(/:{1,2}before/);
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

  it("extends the entry-nav header's blurred background past its own box, without moving its content", () => {
    // EntryNav.astro's own scoped style establishes the ::before box
    // (position/inset/z-index) separately from course.css's background —
    // this guards that the box is sized to reach past any realistic
    // viewport width, and that .week-nav-inner (the actual nav content)
    // carries no competing width/position override that would make it
    // track the widened box.
    const entryNavSource = readFileSync(
      resolve("src/components/EntryNav.astro"),
      "utf8",
    );
    const beforeRule = entryNavSource.match(/\.week-nav::before\s*{[^}]*}/)?.[0] ?? "";
    expect(beforeRule).toMatch(/position:\s*absolute/);
    expect(beforeRule).toMatch(/inset-inline:\s*-100vw/);
    const innerRule = entryNavSource.match(/\.week-nav-inner\s*{[^}]*}/)?.[0] ?? "";
    expect(innerRule).not.toMatch(/max-width|width:/);
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
    const weekNavRule = courseCssSource.match(/\.week-nav::before\s*{[^}]*}/)?.[0] ?? "";
    expect(weekNavRule).toContain("var(--at-shadow-md)");
    const atNavRule = courseCssSource.match(/\.at-nav\s*{[^}]*}/)?.[0] ?? "";
    expect(atNavRule).toContain("var(--at-shadow-md)");
  });
});
