import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homepage = readFileSync(resolve("dist/index.html"), "utf8");
const sessionsPage = readFileSync(resolve("dist/sessions/index.html"), "utf8");

describe("navigation", () => {
  it("calls teaching sessions Labs in the nav", () => {
    expect(homepage).toContain(">Labs<");
    expect(homepage).not.toContain(">Sessions<");
  });

  it("keeps every nav destination", () => {
    for (const path of ["/lectures/", "/sessions/", "/assessments/", "/people/", "/policies/"]) {
      expect(homepage, `nav is missing a link ending ${path}`).toMatch(
        new RegExp(`href="[^"]*${path.replace(/\//g, "\\/")}"`),
      );
    }
  });

  it("does not explain the template's own naming mechanism", () => {
    expect(sessionsPage).not.toContain("src/site-config.ts");
  });
});
