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
    expect(bundledCss()).toMatch(/--at-content-width:\s*44rem/);
  });

  it("takes headings off the brand gold", () => {
    const css = bundledCss();
    const matches = [...css.matchAll(/--at-heading:\s*([^;}]+)[;}]/g)];
    expect(matches.length, "no --at-heading declaration found").toBeGreaterThan(0);
    expect(matches.some((match) => match[1].trim() !== "var(--at-primary)")).toBe(true);
  });

  it("no longer forces square corners", () => {
    expect(courseCssSource, "course.css must not declare --at-border-radius").not.toMatch(
      /--at-border-radius\s*:/,
    );
  });

  it("no longer forces flat elevation", () => {
    for (const token of ["--at-shadow-sm", "--at-shadow-md", "--at-shadow-lg"]) {
      expect(courseCssSource, `course.css must not declare ${token}`).not.toMatch(
        new RegExp(`${token}\\s*:`),
      );
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

function findRowByWeek(rows: string[], week: number): string | undefined {
  return rows.find((row) => {
    const cell = row.match(/<td[^>]*>\s*(\d+)\s*<\/td>/);
    return cell !== null && Number(cell[1]) === week;
  });
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
    // Property order inside the rule isn't guaranteed once other
    // declarations join overflow-x (the build's CSS minifier reorders them).
    expect(bundledCss()).toMatch(/\.course-schedule\s*\{[^}]*overflow-x:\s*auto/);
  });

  it("wraps the schedule table in a panel", () => {
    expect(bundledCss()).toMatch(
      /\.course-schedule\s*\{[^}]*border-radius:\s*var\(--at-border-radius\)[^}]*box-shadow:\s*var\(--at-shadow-sm\)/,
    );
  });

  it("highlights a hovered schedule row", () => {
    expect(bundledCss()).toMatch(
      /\.course-schedule tbody tr:hover\s*\{\s*background:\s*var\(--at-accent-soft\)/,
    );
  });

  it("gives schedule cells roomier padding", () => {
    expect(bundledCss()).toMatch(
      /\.course-schedule (th|td),\s*\.course-schedule (td|th)\s*\{[^}]*padding:\s*var\(--at-spacing-md\) var\(--at-spacing-lg\)/,
    );
  });
});

/** Items inside a `<ul class="course-list">` — ignores unrelated `<li>` elsewhere (nav, footer). */
function courseListItems(html: string): string[] {
  const list = html.match(/<ul class="course-list"[^>]*>([\s\S]*?)<\/ul>/);
  expect(list, 'no <ul class="course-list"> found').not.toBeNull();
  return [...(list?.[1] ?? "").matchAll(/<li(?=[\s>])[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
}

describe("treatment — ruled lists", () => {
  it("lists assessments as rows, not cards", () => {
    const html = readFileSync(resolve("dist/assessments/index.html"), "utf8");
    const items = courseListItems(html);
    const withMeta = items.filter((item) => /Weight:/.test(item) && /Due /.test(item));
    expect(withMeta.length).toBe(5);
    expect(html).not.toMatch(/at-card-grid/);
  });

  it("lists people as rows, not cards", () => {
    const html = readFileSync(resolve("dist/people/index.html"), "utf8");
    expect(courseListItems(html).length).toBe(4);
    expect(html).not.toMatch(/at-card-grid/);
  });

  it("squares the homepage tag pills", () => {
    const source = readFileSync(resolve("src/pages/index.astro"), "utf8");
    expect(source).not.toMatch(/999px/);
  });

  it("keeps every role label", () => {
    const html = readFileSync(resolve("dist/people/index.html"), "utf8");
    expect(html).toMatch(/Convenor/);
    expect(html).toMatch(/Tutor/);
  });
});

const WEEK_NUMBERS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

describe("treatment — spec-sheet metadata block", () => {
  it("gives every lecture a spec-sheet block", () => {
    for (const nn of WEEK_NUMBERS) {
      const html = readFileSync(resolve(`dist/lectures/week-${nn}/index.html`), "utf8");
      for (const label of ["Week", "Date", "Lab", "Reflection due"]) {
        expect(html, `lectures/week-${nn} is missing the "${label}" row label`).toMatch(
          new RegExp(`<dt>${label}</dt>`),
        );
      }
    }
  });

  it("gives every Lab a spec-sheet block", () => {
    for (const nn of WEEK_NUMBERS) {
      const html = readFileSync(resolve(`dist/sessions/week-${nn}/index.html`), "utf8");
      for (const label of ["Week", "Date", "Lecture", "Reflection due"]) {
        expect(html, `sessions/week-${nn} is missing the "${label}" row label`).toMatch(
          new RegExp(`<dt>${label}</dt>`),
        );
      }
    }
  });

  it("links each week to its counterpart", () => {
    const lecture = readFileSync(resolve("dist/lectures/week-05/index.html"), "utf8");
    expect(lecture).toMatch(/href="[^"]*\/sessions\/week-05\/"/);
    const lab = readFileSync(resolve("dist/sessions/week-05/index.html"), "utf8");
    expect(lab).toMatch(/href="[^"]*\/lectures\/week-05\/"/);
  });

  it("drops the bare date paragraph", () => {
    const html = readFileSync(resolve("dist/lectures/week-05/index.html"), "utf8");
    expect(html).not.toMatch(/<p><strong>\d{1,2} \w+ \d{4}<\/strong><\/p>/);
  });
});

describe("treatment — lecture titles", () => {
  it("names lectures as lectures", () => {
    for (const nn of WEEK_NUMBERS) {
      const html = readFileSync(resolve(`dist/lectures/week-${nn}/index.html`), "utf8");
      expect(html, `lectures/week-${nn} is missing "Lecture" in its title`).toMatch(
        new RegExp(`Week ${Number(nn)} Lecture:`),
      );
    }
  });
});

describe("treatment — slides link", () => {
  it("gives the slides link an icon, button styling, and a new tab", () => {
    const html = readFileSync(resolve("dist/lectures/week-01/index.html"), "utf8");
    expect(html).toMatch(/class="at-button at-button--outline"/);
    expect(html).toMatch(/target="_blank"/);
    expect(html).toMatch(/rel="noopener noreferrer"/);
    expect(html).toMatch(/data-icon="iconoir:presentation"/);
    expect(html).toMatch(/Open the slides/);
  });
});

describe("treatment — topics", () => {
  it("gives the lectures table a Topics column", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const thead = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/)?.[1] ?? "";
    expect(thead).toContain("Topics");
  });

  it("shows one topic chip per Content bullet", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const week04Row = findRowByWeek(tbodyRows(html), 4);
    expect(week04Row, "no row found for week 4").toBeDefined();
    const chips = [...(week04Row ?? "").matchAll(/<li class="course-topic">/g)];
    expect(chips.length, "week 4 has 4 Content bullets").toBe(4);
  });

  it("preserves a glossary term's <code> wrapping through truncation", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const week06Row = findRowByWeek(tbodyRows(html), 6);
    expect(week06Row, "no row found for week 6").toBeDefined();
    expect(week06Row).toMatch(/<code>manual override<\/code>/);
  });
});

describe("treatment — shared surfaces and motion budget", () => {
  it("runs no entrance animation", () => {
    expect(courseCssSource).toMatch(/\.at-hero-title(?:::after)?\s*\{[^}]*animation:\s*none/);
    // Both hero selectors need the override, not just one.
    const overrides = [...courseCssSource.matchAll(/([^{}]*)\{[^}]*animation:\s*none[^}]*\}/g)];
    const covered = new Set(
      overrides.flatMap((m) => (m[1].includes("::after") ? ["title", "after"] : ["title"])),
    );
    expect(covered.has("title"), "no animation:none override for .at-hero-title").toBe(true);
    expect(
      overrides.some((m) => m[1].includes("::after")),
      "no animation:none override for .at-hero-title::after",
    ).toBe(true);
  });

  it("keeps every transition inside the budget", () => {
    const durations = [
      ...courseCssSource.matchAll(/transition(?:-duration)?:\s*[^;]*?(\d+)ms/g),
    ].map((m) => Number(m[1]));
    expect(durations.length, "no transition durations found in course.css").toBeGreaterThan(0);
    for (const ms of durations) {
      expect(ms, `${ms}ms is outside the 120-180ms budget`).toBeGreaterThanOrEqual(120);
      expect(ms, `${ms}ms is outside the 120-180ms budget`).toBeLessThanOrEqual(180);
    }
  });

  it("does not defeat reduced motion", () => {
    const flagged = [
      ...courseCssSource.matchAll(/(transition-duration|animation-duration)[^;]*!important/g),
    ];
    expect(flagged.length, "course.css marks a duration !important").toBe(0);
  });

  it("styles the marking table as a ruled table", () => {
    const html = readFileSync(
      resolve("dist/assessments/assignment-3-adulting/index.html"),
      "utf8",
    );
    expect(html).toMatch(/<table/);
    expect(tbodyRows(html).length).toBe(12);
  });
});
