import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(
  resolve("dist/assessments/final-exam/practice-exam/index.html"),
  "utf8",
);

describe("practice exam archive", () => {
  it("is dated as an archived past sitting", () => {
    expect(html).toMatch(/Semester 1, 2026/);
  });

  it("states reading and writing time", () => {
    expect(html).toMatch(/reading time/i);
    expect(html).toMatch(/writing time/i);
    expect(html).toMatch(/2 hours 50 minutes/);
  });

  it("carries real exam-paper conventions", () => {
    expect(html).toMatch(/do not turn this page until instructed/i);
  });

  it("runs the same five stations as the final exam, in order", () => {
    for (let station = 1; station <= 5; station++) {
      expect(html, `missing Station ${station}`).toMatch(new RegExp(`Station ${station}\\b`));
    }
    expect(html).toMatch(/Hygiene and Health/);
    expect(html).toMatch(/Fashion/);
    expect(html).toMatch(/Small Talk/);
    expect(html).toMatch(/Reading the Room/);
    expect(html).toMatch(/Daily Survival/);
  });
});
