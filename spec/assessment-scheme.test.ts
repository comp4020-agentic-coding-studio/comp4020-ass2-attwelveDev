import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface WeightedMarking {
  mode: "weighted";
  criteria: { name: string; weight: number }[];
}

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
  spec?: string[];
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const assessments = api.nodes.filter((node) => node.type === "assessments");

const EXPECTED_WEIGHTS: Record<string, number> = {
  "assessments/weekly-reflections": 15,
  "assessments/assignment-1-makeover": 15,
  "assessments/assignment-2-touch-grass": 20,
  "assessments/assignment-3-adulting": 20,
  "assessments/final-exam": 30,
};

// id -> [own coverage-end week, own `week`]
const EXPECTED_COVERAGE: Record<string, [number, number]> = {
  "assessments/weekly-reflections": [1, 1],
  "assessments/assignment-1-makeover": [3, 4],
  "assessments/assignment-2-touch-grass": [7, 8],
  "assessments/assignment-3-adulting": [12, 12],
  "assessments/final-exam": [12, 12],
};

describe("assessment scheme", () => {
  it("is a scheme of exactly five items", () => {
    expect(assessments.length).toBe(5);
  });

  it("adds up to exactly 100 percent", () => {
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight), 0);
    expect(total).toBe(100);
  });

  it("weights each item as designed", () => {
    for (const node of assessments) {
      expect(node.meta?.weight, `${node.id} has the wrong weight`).toBe(
        EXPECTED_WEIGHTS[node.id],
      );
    }
  });

  it("marks every item with weighted criteria summing to 100", () => {
    for (const node of assessments) {
      const marking = node.meta?.marking as WeightedMarking | undefined;
      expect(marking?.mode, `${node.id} has no weighted marking`).toBe("weighted");
      const total = marking?.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
      expect(total, `${node.id}'s criteria don't sum to 100`).toBe(100);
    }
  });

  it("sets every deadline at noon", () => {
    for (const node of assessments) {
      expect(String(node.meta?.due), `${node.id} isn't due at noon`).toMatch(
        /T12:00:00(\+10:00|\+11:00)$/,
      );
    }
  });

  it("uses the right offset for the date", () => {
    for (const node of assessments) {
      const due = String(node.meta?.due);
      const expectedOffset = due.slice(0, 10) < "2027-04-04" ? "+11:00" : "+10:00";
      expect(due, `${node.id} uses the wrong DST offset`).toMatch(
        new RegExp(`${expectedOffset.replace("+", "\\+")}$`),
      );
    }
  });

  it("keeps every item inside weeks 1 to 12", () => {
    for (const node of assessments) {
      const week = Number(node.meta?.week);
      expect(Number.isInteger(week), `${node.id} has a non-integer week`).toBe(true);
      expect(week, `${node.id}'s week is out of range`).toBeGreaterThanOrEqual(1);
      expect(week).toBeLessThanOrEqual(12);
    }
  });

  it("never examines content from a later week", () => {
    for (const node of assessments) {
      const [coverageEnd, ownWeek] = EXPECTED_COVERAGE[node.id];
      expect(coverageEnd, `${node.id}'s coverage runs past its own week`).toBeLessThanOrEqual(
        ownWeek,
      );
      expect(Number(node.meta?.week), `${node.id}'s week doesn't match the scheme`).toBe(ownWeek);
    }
  });

  it("gives every item a spec list", () => {
    for (const node of assessments) {
      expect(node.spec?.length, `${node.id} has no spec list`).toBeGreaterThan(0);
    }
  });
});

describe("weekly reflections", () => {
  const html = readFileSync(resolve("dist/assessments/weekly-reflections/index.html"), "utf8");

  it("states the reflection arithmetic", () => {
    for (const token of ["11", "10", "1.5%", "15%"]) {
      expect(html, `missing "${token}"`).toContain(token);
    }
  });

  it("publishes eleven prompts", () => {
    for (let week = 1; week <= 11; week++) {
      expect(html, `missing prompt for Week ${week}`).toMatch(new RegExp(`Week ${week}\\b`));
    }
  });

  it("sets week 12's prompt without grading it", () => {
    expect(html).toMatch(/Week 12/);
    expect(html).toMatch(/ungraded|not graded|not marked/i);
  });

  it("declares the drop-lowest rule", () => {
    expect(html).toMatch(/lowest/i);
  });
});

describe("assignment 3 adulting", () => {
  const html = readFileSync(resolve("dist/assessments/assignment-3-adulting/index.html"), "utf8");

  it("requires all seven plan components", () => {
    for (const term of [
      /daily routine/i,
      /laundry/i,
      /meal plan/i,
      /budget/i,
      /date/i,
      /hangout|close friends/i,
      /interview/i,
    ]) {
      expect(html, `missing ${term}`).toMatch(term);
    }
  });

  it("publishes five band descriptors", () => {
    for (const band of ["HD", "D", "C", "P", "N"]) {
      expect(html, `missing band ${band}`).toMatch(new RegExp(`\\b${band}\\b`));
    }
  });

  it("describes the plan, not the student", () => {
    expect(html.toLowerCase()).not.toContain("you are");
    expect(html.toLowerCase()).not.toContain("you can't");
  });

  it("puts the Wednesday interview time in the student's hands", () => {
    expect(html).toMatch(/Wednesday/);
    expect(html).toMatch(/not been specified|unspecified|confirm/i);
  });
});
