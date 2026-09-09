import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  description: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const people = api.nodes.filter((node) => node.type === "people");

describe("cast", () => {
  it("is a cast of four", () => {
    expect(people.length).toBe(4);
  });

  it("has one convenor and three tutors", () => {
    const convenors = people.filter((person) => person.meta?.role === "convenor");
    const tutors = people.filter((person) => person.meta?.role === "tutor");
    expect(convenors.length).toBe(1);
    expect(tutors.length).toBe(3);
  });

  it("uses only roles PeopleGrid can label", () => {
    for (const person of people) {
      expect(["convenor", "tutor", "guest", "other"]).toContain(person.meta?.role);
    }
  });

  it("puts each specialism in the affiliation", () => {
    for (const person of people) {
      expect(person.meta?.affiliation, `${person.id} has no affiliation`).toContain(
        "School of Applied Competence",
      );
    }
  });

  it("gives every entry a real bio", () => {
    for (const person of people) {
      expect(person.description.length).toBeGreaterThanOrEqual(40);
    }
  });

  it("retains no starter entry", () => {
    const ids = people.map((person) => person.id);
    expect(ids).not.toContain("people/idris-fenn");
    expect(ids).not.toContain("people/marisol-quaye");
  });
});
