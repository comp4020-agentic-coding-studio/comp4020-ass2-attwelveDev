import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The one test in spec/ that reads a source file rather than dist/: the
// harness is a repo promise rather than a rendered one, and check-evidence
// already treats CLAUDE.md as part of what is marked.
const claudeMd = readFileSync(resolve("CLAUDE.md"), "utf8");

describe("harness", () => {
  it("pins the thesis verbatim", () => {
    expect(claudeMd).toContain(
      "Competence is a skill like any other. CS culture just never taught you this one.",
    );
  });

  it("fixes the five-slot weekly structure", () => {
    for (const slot of ["Introduction", "Definitions", "Body", "In-lecture activity", "Conclusion"]) {
      expect(claudeMd, `missing slot: ${slot}`).toContain(slot);
    }
  });

  it("states the register rule and its single exception", () => {
    expect(claudeMd).toMatch(/never break character/i);
    expect(claudeMd).toMatch(/policies/i);
  });

  it("records the role-is-an-enum constraint", () => {
    expect(claudeMd).toContain("convenor");
    expect(claudeMd).toContain("affiliation");
  });

  it("records the noon deadline rule", () => {
    expect(claudeMd).toMatch(/12:00/);
    expect(claudeMd).toMatch(/UTC/);
  });

  it("requires case studies to be introduced in the lecture first", () => {
    expect(claudeMd).toMatch(/introduced in a lecture/i);
    expect(claudeMd).toMatch(/never introduce it first/i);
  });

  it("requires a how, not just a what and why", () => {
    expect(claudeMd).toMatch(/how.{0,20}not just.{0,20}what.{0,10}why/is);
  });
});
