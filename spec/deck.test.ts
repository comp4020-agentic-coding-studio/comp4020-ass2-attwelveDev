import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const slidesRegex = /^\/decks\/[a-z0-9-]+\/$/;
const lecturesWithSlides = api.nodes.filter(
  (node) => node.type === "lectures" && typeof node.meta?.slides === "string",
);

describe("deck", () => {
  it("links a deck from a lecture", () => {
    const withValidSlides = lecturesWithSlides.filter((node) =>
      slidesRegex.test(String(node.meta?.slides)),
    );
    expect(withValidSlides.length).toBeGreaterThan(0);
  });

  it("builds the deck that lecture links", () => {
    for (const node of lecturesWithSlides) {
      const slides = String(node.meta?.slides);
      expect(slidesRegex.test(slides), `${node.id}'s slides value isn't a deck path`).toBe(true);
      const deckPath = resolve(`dist${slides}index.html`);
      expect(existsSync(deckPath), `${node.id} links a deck that wasn't built: ${deckPath}`).toBe(
        true,
      );
    }
  });

  it("is not the starter deck", () => {
    const html = readFileSync(resolve("dist/decks/week-01/index.html"), "utf8");
    expect(html).not.toContain("Replace this deck.");
    expect(html).not.toContain("A slide class");
  });

  it("pins the thesis on the deck", () => {
    const html = readFileSync(resolve("dist/decks/week-01/index.html"), "utf8");
    expect(html).toContain(
      "Competence is a skill like any other. CS culture just never taught you this one.",
    );
  });
});
