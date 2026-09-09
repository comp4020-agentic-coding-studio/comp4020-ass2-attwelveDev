import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface CourseApi {
  course: {
    code: string;
    level: number;
    title: string;
    session: string;
    year: number;
    startDate: string;
    endDate: string;
    description: string;
    tags: string[];
    learningOutcomes: string[];
  };
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

describe("course record", () => {
  it("is SLOP1521 at level 1", () => {
    expect(api.course.code).toBe("SLOP1521");
    expect(api.course.level).toBe(1);
  });

  it("names the course and its method", () => {
    expect(api.course.title).toBe("Introduction to Life: Personal Systems Maintenance");
  });

  it("runs in Semester 1 2027 across teaching and examination", () => {
    expect(api.course.session).toBe("Semester 1");
    expect(api.course.year).toBe(2027);
    expect(api.course.startDate).toBe("2027-02-22");
    expect(api.course.endDate).toBe("2027-06-19");
  });

  it("carries a description the catalogue will accept", () => {
    expect(api.course.description.length).toBeGreaterThanOrEqual(80);
    expect(api.course.description.length).toBeLessThanOrEqual(300);
    expect(api.course.description).toContain("systems engineering");
  });

  it("declares one to three tags", () => {
    expect(api.course.tags.length).toBeGreaterThanOrEqual(1);
    expect(api.course.tags.length).toBeLessThanOrEqual(3);
    for (const tag of api.course.tags) {
      expect(tag.length).toBeGreaterThanOrEqual(2);
      expect(tag.length).toBeLessThanOrEqual(24);
    }
  });

  it("publishes nine learning outcomes", () => {
    expect(api.course.learningOutcomes.length).toBe(9);
    for (const outcome of api.course.learningOutcomes) {
      expect(typeof outcome).toBe("string");
      expect(outcome.length).toBeGreaterThan(0);
    }
  });
});
