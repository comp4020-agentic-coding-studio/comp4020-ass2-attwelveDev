import { readFileSync } from "node:fs";
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
const lectures = api.nodes.filter((node) => node.type === "lectures");
const sessions = api.nodes.filter((node) => node.type === "sessions");

function caseStudyIds(node: ApiNode | undefined): string[] {
  const value = node?.meta?.caseStudies;
  return Array.isArray(value) ? (value as string[]) : [];
}

describe("case study provenance", () => {
  it("introduces every lab's case studies in that week's lecture first", () => {
    for (const session of sessions) {
      const week = Number(session.meta?.week);
      const lecture = lectures.find((node) => Number(node.meta?.week) === week);
      const lectureIds = new Set(caseStudyIds(lecture));
      for (const id of caseStudyIds(session)) {
        expect(
          lectureIds.has(id),
          `${session.id}'s case study "${id}" is not introduced in week ${week}'s lecture`,
        ).toBe(true);
      }
    }
  });
});
