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

describe("treatment — heading register", () => {
  it("declares a serif heading family", () => {
    const css = bundledCss();
    expect(css).toMatch(/--course-font-heading:/);
    const match = css.match(/--course-font-heading:\s*([^;}]+)[;}]/);
    expect(match, "no --course-font-heading declaration found").not.toBeNull();
    expect(match?.[1]).toMatch(/serif/);
  });

  it("applies the heading family to every heading level", () => {
    const css = bundledCss();
    const match = css.match(/([^{}]*\bh[1-6]\b[^{}]*)\{([^}]*)\}/g);
    const covering = (match ?? []).find((rule) => {
      const levels = new Set(
        [...rule.matchAll(/h([1-6])(?:[,:{]|$)/g)].map((m) => m[1]),
      );
      return (
        ["1", "2", "3", "4", "5", "6"].every((level) => levels.has(level)) &&
        rule.includes("font-family:var(--course-font-heading)")
      );
    });
    expect(covering, "no selector sets all six heading levels to the serif family").toBeDefined();
  });

  it("tightens the display steps", () => {
    const css = bundledCss();
    const h1Values = [...css.matchAll(/--at-font-size-h1:\s*([\d.]+)rem/g)].map((m) =>
      Number(m[1]),
    );
    const h2Values = [...css.matchAll(/--at-font-size-h2:\s*([\d.]+)rem/g)].map((m) =>
      Number(m[1]),
    );
    expect(h1Values.length, "no --at-font-size-h1 declaration found").toBeGreaterThan(0);
    expect(h2Values.length, "no --at-font-size-h2 declaration found").toBeGreaterThan(0);
    expect(h1Values.some((value) => value < 2.5)).toBe(true);
    expect(h2Values.some((value) => value < 1.875)).toBe(true);
  });

  it("leaves body copy on Public Sans", () => {
    expect(courseCssSource, "course.css must not declare --at-font-body").not.toMatch(
      /--at-font-body\s*:/,
    );
  });
});

function tbodyRows(html: string): string[] {
  const tbody = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/);
  expect(tbody, "no <tbody> found").not.toBeNull();
  return [...(tbody?.[1] ?? "").matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
}

describe("treatment — schedule tables", () => {
  it("renders the lecture listing as a table", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    expect(html).toMatch(/<table/);
    expect(tbodyRows(html).length).toBe(12);
  });

  it("renders the Lab listing as a table", () => {
    const html = readFileSync(resolve("dist/sessions/index.html"), "utf8");
    expect(html).toMatch(/<table/);
    expect(tbodyRows(html).length).toBe(12);
  });

  it("heads both schedule tables with week, date and title", () => {
    for (const page of ["dist/lectures/index.html", "dist/sessions/index.html"]) {
      const html = readFileSync(resolve(page), "utf8");
      const thead = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/);
      expect(thead, `${page} has no <thead>`).not.toBeNull();
      for (const column of ["Week", "Date", "Title"]) {
        expect(thead?.[1], `${page}'s <thead> is missing "${column}"`).toContain(column);
      }
    }
  });

  it("keeps both tables in order", () => {
    for (const page of ["dist/lectures/index.html", "dist/sessions/index.html"]) {
      const html = readFileSync(resolve(page), "utf8");
      const weeks = tbodyRows(html).map((row) => {
        const cell = row.match(/<td[^>]*>\s*(\d+)\s*<\/td>/);
        expect(cell, `${page} has a row with no numeric week cell`).not.toBeNull();
        return Number(cell?.[1]);
      });
      expect(weeks, `${page}'s weeks are not 1..12 in order`).toEqual(
        Array.from({ length: 12 }, (_, i) => i + 1),
      );
    }
  });

  it("wraps wide tables in a scroll container", () => {
    expect(bundledCss()).toMatch(/\.course-schedule\s*\{\s*overflow-x:\s*auto/);
  });
});
