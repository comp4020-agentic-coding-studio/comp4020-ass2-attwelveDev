import { existsSync, readdirSync, readFileSync } from "node:fs";
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

/**
 * Deck-authoring conventions established while building Week 1's deck
 * (plan Task 5), generalised to every week's deck (Tasks 6-16) per the
 * plan's own note: read from source `.deck.mdx` files rather than built
 * HTML, since these are about how a deck is *authored*, not just how it
 * renders.
 */
describe("deck — authoring conventions", () => {
  const deckFiles = readdirSync(resolve("src/decks"))
    .filter((name) => name.endsWith(".deck.mdx"))
    .map((name) => ({ name, source: readFileSync(resolve("src/decks", name), "utf8") }));

  it("found at least one deck to check", () => {
    expect(deckFiles.length).toBeGreaterThan(0);
  });

  it.each(deckFiles)("$name's title slide uses the canonical course title", ({ name, source }) => {
    expect(source, `${name} doesn't import courseMeta`).toMatch(
      /import\s*\{\s*courseMeta\s*\}\s*from\s*"\.\.\/course-config"/,
    );
    expect(source, `${name}'s title slide doesn't reference courseMeta.title`).toContain(
      "{courseMeta.title}",
    );
  });

  it.each(deckFiles)("$name reuses CheckIn.astro instead of plain check-in text", ({ name, source }) => {
    expect(source, `${name} doesn't import CheckIn`).toMatch(
      /import\s+CheckIn\s+from\s*"\.\.\/components\/CheckIn\.astro"/,
    );
    // A bare "Check-in:" outside the component means someone reverted to
    // plain text for a new check-in rather than reusing the component.
    const bareCheckIns = [...source.matchAll(/^(?!.*<CheckIn).*Check-in:/gm)];
    expect(bareCheckIns.map((m) => m[0]), `${name} has a non-componentised check-in`).toEqual([]);
  });

  it.each(deckFiles)("$name carries a dedicated reflection-prompt slide", ({ name, source }) => {
    expect(source, `${name} has no "This week's reflection" slide`).toMatch(
      /^## This week's reflection$/m,
    );
  });

  it.each(deckFiles)("$name gives its signposting its own slide", ({ name, source }) => {
    expect(source, `${name} has no "What's ahead" slide`).toMatch(/^## What's ahead$/m);
  });

  it("week 6's deck tells students their reflection isn't due during the teaching break", () => {
    const week06 = deckFiles.find((file) => file.name === "week-06.deck.mdx");
    expect(week06, "week-06.deck.mdx not found").toBeTruthy();
    const slideMatch = week06?.source.match(/^## This week's reflection$([\s\S]*?)(?=^---$)/m);
    expect(slideMatch, "week-06.deck.mdx has no reflection slide body").toBeTruthy();
    expect(slideMatch?.[1]).toMatch(/break/i);
  });
});
