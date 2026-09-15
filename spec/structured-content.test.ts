import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function renderedPage(id: string): string {
  return readFileSync(resolve(`dist/${id}/index.html`), "utf8");
}

describe("structured content — lecture components", () => {
  it("renders week 1's definitions as a course-definitions list", () => {
    const html = renderedPage("lectures/week-01");
    expect(html).toMatch(/<dl class="course-definitions">/);
  });

  it("renders week 1's check-in callouts", () => {
    const html = renderedPage("lectures/week-01");
    expect(html).toMatch(/class="course-check-in"/);
  });

  it("renders week 1's in-lecture activity block", () => {
    const html = renderedPage("lectures/week-01");
    expect(html).toMatch(/class="course-activity"/);
  });
});
