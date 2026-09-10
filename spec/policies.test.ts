import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve("dist/policies/index.html"), "utf8");

describe("policies", () => {
  it("carries a content and disclosure section", () => {
    // The theme wraps heading text with an anchor link, so match a heading
    // element containing the phrase rather than requiring it as the sole
    // text node.
    expect(html).toMatch(/<h[1-6][^>]*>(?:(?!<\/h[1-6]>)[\s\S])*Content and disclosure(?:(?!<\/h[1-6]>)[\s\S])*<\/h[1-6]>/i);
  });

  it("says what the satire targets", () => {
    expect(html).toContain("not of the students");
  });

  it("promises reflections are never read aloud", () => {
    expect(html).toContain("never read aloud");
  });

  it("marks Week 9's reflection optional", () => {
    expect(html).toMatch(/Week 9/);
    expect(html).toMatch(/optional/i);
  });

  it("is not the starter page", () => {
    expect(html).not.toContain("Replace this page");
  });

  it("states the paper submission policy", () => {
    expect(html).toMatch(/<h[1-6][^>]*>(?:(?!<\/h[1-6]>)[\s\S])*Submission(?:(?!<\/h[1-6]>)[\s\S])*<\/h[1-6]>/i);
  });

  it("names both submission drop points", () => {
    expect(html).toMatch(/Convenor/);
    expect(html).toMatch(/tutor/i);
  });

  it("permits email submission in extenuating circumstances, with documentation", () => {
    expect(html).toMatch(/extenuating circumstances/i);
    expect(html).toMatch(/documentation/i);
  });

  it("does not cover the Final Exam", () => {
    expect(html).toMatch(/Final Exam/);
    expect(html).toMatch(/own conditions|does not (?:apply|cover)/i);
  });

  it("supplies envelopes as well as paper", () => {
    expect(html).toMatch(/paper and envelopes|envelopes? and paper/i);
  });

  it("links to the Final Exam page", () => {
    expect(html).toMatch(/href="[^"]*\/assessments\/final-exam\/"/);
  });
});
