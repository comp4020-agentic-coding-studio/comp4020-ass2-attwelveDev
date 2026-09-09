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
});
