import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * course.css rides `brandCss`'s injectScript mechanism (astro.config.ts), so
 * Astro inlines it into a `<style>` block on every rendered page rather than
 * extracting it to a shared `dist/_astro/*.css` chunk the way page-specific
 * styles are. Concatenate both sources so a token assertion holds regardless
 * of which one Astro chooses to use for a given declaration.
 */
function bundledCss(): string {
  const astroDir = resolve("dist/_astro");
  const chunkCss = readdirSync(astroDir)
    .filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(resolve(astroDir, name), "utf8"))
    .join("\n");
  const inlineCss = [...readFileSync(resolve("dist/index.html"), "utf8").matchAll(
    /<style>([\s\S]*?)<\/style>/g,
  )]
    .map((match) => match[1])
    .join("\n");
  return `${chunkCss}\n${inlineCss}`;
}

const courseCssSource = readFileSync(resolve("src/styles/course.css"), "utf8");

describe("treatment — structural tokens", () => {
  it("ships the course stylesheet", () => {
    expect(bundledCss()).toMatch(/--at-content-width:\s*38rem/);
  });

  it("takes headings off the brand gold", () => {
    const css = bundledCss();
    const matches = [...css.matchAll(/--at-heading:\s*([^;}]+)[;}]/g)];
    expect(matches.length, "no --at-heading declaration found").toBeGreaterThan(0);
    expect(matches.some((match) => match[1].trim() !== "var(--at-primary)")).toBe(true);
  });

  it("squares every corner", () => {
    expect(bundledCss()).toMatch(/--at-border-radius:\s*0(?:px|rem)?\s*[;}]/);
  });

  it("removes elevation", () => {
    const css = bundledCss();
    for (const token of ["--at-shadow-sm", "--at-shadow-md", "--at-shadow-lg"]) {
      expect(css).toMatch(new RegExp(`${token}:\\s*none\\s*[;}]`));
    }
  });

  it("never redefines a fixed brand ink", () => {
    for (const token of ["--at-primary", "--at-secondary", "--at-tertiary"]) {
      expect(courseCssSource, `course.css must not declare ${token}`).not.toMatch(
        new RegExp(`${token}\\s*:`),
      );
    }
  });
});
