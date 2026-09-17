import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function renderedPage(id: string): string {
  return readFileSync(resolve(`dist/${id}/index.html`), "utf8");
}

describe("references — course-wide bibliography page", () => {
  it("builds the /references/ page", () => {
    expect(() => renderedPage("references")).not.toThrow();
  });

  it("lists every unique citation across all 12 lectures", () => {
    const html = renderedPage("references");
    const list = html.match(/<ul class="[^"]*\bcourse-references\b[^"]*">([\s\S]*?)<\/ul>/);
    expect(list, "no course-references list found").not.toBeNull();
    const items = [...(list?.[1] ?? "").matchAll(/<li>/g)];
    // 15 citations authored across the 12 lectures once the migration
    // cluster (plan Tasks 5-16) completes, deduped to 13 uniques: Lally et
    // al. (2010) is cited in both Week 1 and Week 12, Kruger et al. (2005)
    // is cited in both Week 9 and Week 11, and Gollwitzer (1999) is a new,
    // non-duplicated citation added in Week 1 (plan Task 4).
    expect(items.length).toBe(13);
  });

  it("marks Warren & Warren Tyagi (2005) as a trade book, not a peer-reviewed paper", () => {
    const html = renderedPage("references");
    expect(html).toMatch(/trade book/i);
  });

  it("links each citation back to the lecture(s) that introduced it", () => {
    const html = renderedPage("references");
    expect(html).toMatch(/href="[^"]*\/lectures\/week-01\/"/);
    expect(html).toMatch(/href="[^"]*\/lectures\/week-12\/"/);
  });

  it("shows every contributing lecture's own note for a citation used twice", () => {
    const html = renderedPage("references");
    const list = html.match(/<ul class="[^"]*\bcourse-references\b[^"]*">([\s\S]*?)<\/ul>/)?.[1] ?? "";
    const lallyItem = list.match(/<li>Lally[\s\S]*?<\/li>/)?.[0] ?? "";
    expect(lallyItem, "Lally et al. citation not found").not.toBe("");
    expect(lallyItem).toMatch(/66 days/);
    expect(lallyItem).toMatch(/Callback to Week 1/);
  });

  it("links the lectures overview page to references", () => {
    const html = renderedPage("lectures");
    expect(html).toMatch(/href="[^"]*\/references\/"/);
  });
});
