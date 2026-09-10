import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface CourseApi {
  course: {
    learningOutcomes: string[];
  };
}

const html = readFileSync(resolve("dist/index.html"), "utf8");
const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

describe("homepage", () => {
  it("pins the thesis verbatim", () => {
    expect(html).toContain(
      "Competence is a skill like any other. CS culture just never taught you this one.",
    );
  });

  it("names the new course identity", () => {
    expect(html).toContain("Introduction to Life: Foundations of Being a Person");
    expect(html).not.toContain("Personal Systems Maintenance");
  });

  it("names the five-station examination", () => {
    expect(html).toMatch(/five[- ]station/i);
  });

  it("publishes the nine learning outcomes", () => {
    expect(api.course.learningOutcomes.length).toBe(9);
    for (const outcome of api.course.learningOutcomes) {
      expect(html, `homepage is missing outcome: ${outcome}`).toContain(outcome);
    }
  });

  it("retains no starter prose", () => {
    expect(html).not.toContain("What you will do");
    expect(html).not.toContain("Who it is for");
    expect(html).not.toContain("Say what a student spends");
  });

  it("describes its own hero artwork", () => {
    expect(html).not.toContain("A lecture theatre reduced to flat gold and black shapes");
  });

  it("describes its own hero artwork without a systems metaphor", () => {
    expect(html.toLowerCase()).not.toContain("status-grid");
    expect(html.toLowerCase()).not.toContain("flagged black for maintenance");
  });
});
