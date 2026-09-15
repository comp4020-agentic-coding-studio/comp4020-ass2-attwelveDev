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
    const list = html.match(/<ul class="course-references">([\s\S]*?)<\/ul>/);
    expect(list, "no course-references list found").not.toBeNull();
    const items = [...(list?.[1] ?? "").matchAll(/<li>/g)];
    // 14 citations authored across the 12 lectures once the migration
    // cluster (plan Tasks 5-16) completes, deduped to 12 uniques: Lally et
    // al. (2010) is cited in both Week 1 and Week 12, and Kruger et al.
    // (2005) is cited in both Week 9 and Week 11.
    expect(items.length).toBe(12);
  });

  it("marks Warren & Warren Tyagi (2005) as a trade book, not a peer-reviewed paper", () => {
    const html = renderedPage("references");
    expect(html).toMatch(/trade book/i);
  });
});
