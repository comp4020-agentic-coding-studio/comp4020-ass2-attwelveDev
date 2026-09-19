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
  related?: string[];
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

  // Weekly Reflections is exempt: its `week: 1` frontmatter field is a
  // pure sort key for sortedAssessments() (see src/lib/entry-order.ts),
  // not a coverage ceiling — it's continuously graded across the whole
  // semester by design, unlike the other four point-in-time assessments.
  it("never examines content from a week later than its own", () => {
    for (const node of assessments) {
      if (node.id === "assessments/weekly-reflections") continue;
      const weeks = (node.meta?.contentScope as { weeks?: number[] })?.weeks ?? [];
      const ownWeek = Number(node.meta?.week);
      for (const w of weeks) {
        expect(w, `${node.id}'s coverage runs past its own week`).toBeLessThanOrEqual(ownWeek);
      }
    }
  });

  it("links related to exactly the lectures its content scope names", () => {
    for (const node of assessments) {
      const weeks = (node.meta?.contentScope as { weeks?: number[] })?.weeks ?? [];
      const expected = weeks
        .map((w) => `lectures/week-${String(w).padStart(2, "0")}`)
        .sort();
      const actual = [...(node.related ?? [])].filter((r) => r.startsWith("lectures/")).sort();
      expect(actual, `${node.id}'s related lectures don't match its content scope`).toEqual(
        expected,
      );
    }
  });

  it("gives every item a spec list", () => {
    for (const node of assessments) {
      expect(node.spec?.length, `${node.id} has no spec list`).toBeGreaterThan(0);
    }
  });
});

describe("content scope and learning outcomes", () => {
  it("gives every assessment a content-scope display and weeks array", () => {
    for (const node of assessments) {
      const contentScope = node.meta?.contentScope as { display?: unknown; weeks?: unknown };
      expect(Array.isArray(contentScope?.weeks), `${node.id} has no weeks array`).toBe(true);
      expect(typeof contentScope?.display, `${node.id} has no scope display`).toBe("string");
    }
  });

  it("keeps every learningOutcomes index within 1 and 9", () => {
    for (const node of assessments) {
      const learningOutcomes = node.meta?.learningOutcomes as number[];
      for (const n of learningOutcomes) {
        expect(n, `${node.id} has an out-of-range LO index`).toBeGreaterThanOrEqual(1);
        expect(n, `${node.id} has an out-of-range LO index`).toBeLessThanOrEqual(9);
      }
    }
  });
});

describe("due-date week labels", () => {
  const indexHtml = readFileSync(resolve("dist/assessments/index.html"), "utf8");
  const cases: [string, string][] = [
    ["assessments/assignment-1-makeover", "Week 4"],
    ["assessments/assignment-2-touch-grass", "Week 8"],
    ["assessments/assignment-3-adulting", "Week 12"],
    ["assessments/final-exam", "Exam Period"],
  ];

  it.each(cases)("%s's detail page states its due week label", (id, label) => {
    const html = readFileSync(resolve(`dist/${id}/index.html`), "utf8");
    expect(html).toContain(label);
  });

  it.each(cases)("%s's due week label appears on the main listing", (_id, label) => {
    expect(indexHtml).toContain(label);
  });
});

describe("content scope specsheet row", () => {
  const cases: [string, string][] = [
    ["assessments/weekly-reflections", "Weeks 1-12"],
    ["assessments/assignment-1-makeover", "Weeks 1-4"],
    ["assessments/assignment-2-touch-grass", "Weeks 5-7"],
    ["assessments/assignment-3-adulting", "Weeks 1-12"],
    ["assessments/final-exam", "Weeks 1-4, 7-8, 10-12"],
  ];

  it.each(cases)("%s's specsheet states its content scope", (id, display) => {
    const html = readFileSync(resolve(`dist/${id}/index.html`), "utf8");
    expect(html).toContain("Content scope");
    expect(html).toContain(display);
  });
});

describe("weekly reflections", () => {
  const html = readFileSync(resolve("dist/assessments/weekly-reflections/index.html"), "utf8");

  it("states the reflection arithmetic", () => {
    for (const token of ["12", "10", "1.5%", "15%"]) {
      expect(html, `missing "${token}"`).toContain(token);
    }
  });

  it("publishes twelve prompts", () => {
    for (let week = 1; week <= 12; week++) {
      expect(html, `missing prompt for Week ${week}`).toMatch(new RegExp(`Week ${week}\\b`));
    }
  });

  it("declares the drop-lowest rule", () => {
    expect(html).toMatch(/lowest/i);
  });

  it("requires a sealed paper submission", () => {
    expect(html).toMatch(/paper/i);
    expect(html).toMatch(/sealed/i);
  });
});

describe("assignment 1 makeover", () => {
  const html = readFileSync(
    resolve("dist/assessments/assignment-1-makeover/index.html"),
    "utf8",
  );

  it("names all three occasions", () => {
    expect(html).toMatch(/lecture/i);
    expect(html).toMatch(/birthday party/i);
    expect(html).toMatch(/gym/i);
  });

  it("requires evidence and justification", () => {
    expect(html).toMatch(/screenshot|picture|image/i);
    expect(html).toMatch(/justif/i);
  });

  it("prints and attaches the outfit photos for paper submission", () => {
    expect(html).toMatch(/paper/i);
    expect(html).toMatch(/printed/i);
  });
});

describe("assignment 2 touch grass", () => {
  const html = readFileSync(
    resolve("dist/assessments/assignment-2-touch-grass/index.html"),
    "utf8",
  );

  it("caps CS discussion at five minutes", () => {
    expect(html).toMatch(/five minutes|5 minutes/i);
  });

  it("says compliance is self-reported", () => {
    expect(html).toMatch(/self-reported/i);
    expect(html).toMatch(/the report is the evidence/i);
  });

  it("offers all seven activities", () => {
    for (const term of [
      "park",
      "caf",
      "team sports",
      "museum",
      "social event",
      "shopping",
      "club",
    ]) {
      expect(html.toLowerCase(), `missing "${term}"`).toContain(term);
    }
  });

  it("requires two non-CS people", () => {
    expect(html).toMatch(/\btwo\b.*non-CS|non-CS.*\btwo\b|\b2\b.*non-CS|non-CS.*\b2\b/is);
  });

  it("sets the word count", () => {
    expect(html).toMatch(/1000|1,000/);
  });

  it("submits the report on paper", () => {
    expect(html).toMatch(/paper/i);
  });
});

describe("assignment 3 adulting", () => {
  const html = readFileSync(resolve("dist/assessments/assignment-3-adulting/index.html"), "utf8");

  it("requires all eleven named plan components", () => {
    for (const term of [
      /daily routine/i,
      /laundry/i,
      /meal plan/i,
      /budget/i,
      /date/i,
      /hangout|close friends/i,
      /interview/i,
      /cleaning schedule/i,
      /skincare/i,
      /hygiene routine/i,
      /sleep schedule/i,
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

  it("submits the plan as one paper document, separate from the interview-scheduling email", () => {
    expect(html).toMatch(/paper/i);
    expect(html).toMatch(/not the assessment submission|separate from the (?:assessment )?submission/i);
  });
});

describe("final exam", () => {
  const html = readFileSync(resolve("dist/assessments/final-exam/index.html"), "utf8");

  it("runs five stations", () => {
    for (let station = 1; station <= 5; station++) {
      expect(html, `missing Station ${station}`).toMatch(new RegExp(`Station ${station}\\b`));
    }
  });

  it("publishes each station's duration", () => {
    expect(html).toMatch(/10 minutes/);
    expect(html).toMatch(/2 hours/);
  });

  it("frames non-Station-3 durations as suggested, keeping Station 3's cutoff strict", () => {
    expect(html).toMatch(/Station 1: Hygiene and Health \(suggested 10 minutes\)/);
    expect(html).toMatch(/Station 2: Fashion \(suggested 10 minutes\)/);
    expect(html).toMatch(/Station 3: Small Talk \(10 minutes\)/);
    expect(html).not.toMatch(/Station 3: Small Talk \(suggested/);
    expect(html).toMatch(/Station 4: Reading the Room \(suggested 10 minutes\)/);
    expect(html).toMatch(/Station 5: Daily Survival \(suggested 2 hours 10 minutes\)/);
  });

  it("makes clear the total 2 hour 50 minute session is fixed, even though station pacing is not", () => {
    expect(html).toMatch(/fixed\s+2\s+hour\s+50\s+minute\s+session/i);
    expect(html).toMatch(/Total session time is 2 hours 50 minutes, fixed/i);
  });

  it("lets candidates attend the five stations in any order", () => {
    expect(html).toMatch(/in any\s+order/i);
    expect(html).not.toMatch(/back to back on exam day, in order/i);
    expect(html).not.toMatch(/attended in sequence/i);
    expect(html).toMatch(/Stations may be completed in any order/i);
  });

  it("states the short-stations-vs-cooking-station weight relationship correctly", () => {
    expect(html).not.toMatch(/worth as much combined as the long cooking station alone/);
    expect(html).toMatch(/worth more than double the long cooking station/);
  });

  it("warns that the examiner may leave", () => {
    expect(html).toMatch(/leave/i);
  });

  it("sits after teaching ends", () => {
    const finalExam = assessments.find((node) => node.id === "assessments/final-exam");
    const week12Lecture = api.nodes.find(
      (node) => node.type === "lectures" && node.meta?.week === 12,
    );
    expect(finalExam?.meta?.week).toBe(12);
    expect(String(finalExam?.meta?.due)).toMatch(/^2027-06-09/);
    expect(String(week12Lecture?.meta?.date)).toBe("2027-05-25");
  });

  it("states the permitted exam materials", () => {
    expect(html).toMatch(/black or blue pen/i);
    expect(html).toMatch(/closed book/i);
    expect(html).toMatch(/phone/i);
    expect(html).toMatch(/smartwatch/i);
    expect(html).toMatch(/calculator/i);
  });

  it("requires silence except at Station 3", () => {
    expect(html).toMatch(/no talking/i);
    expect(html).toMatch(/Station 3/);
    expect(html).toMatch(/compulsory/i);
  });

  it("issues an answer booklet for written answers and marks Station 5 partly by observation", () => {
    expect(html).toMatch(/answer booklet/i);
    expect(html).not.toMatch(/Stations 1 to 4/i);
    expect(html).not.toMatch(/not written up/i);
    expect(html).toMatch(/observation/i);
  });

  it("plans as well as cooks the Station 5 meal", () => {
    expect(html).toMatch(/Plan a/i);
    expect(html).toMatch(/edible meal/i);
  });

  it("treats broken exam rules as academic misconduct", () => {
    expect(html).toMatch(/academic misconduct/i);
  });

  it("adds a materials-compliance line to the spec", () => {
    const finalExam = assessments.find((node) => node.id === "assessments/final-exam");
    expect(finalExam?.spec?.some((line) => /pen|materials/i.test(line))).toBe(true);
  });

  it("presents Station 4's scenario as live, not narrated", () => {
    expect(html).toMatch(/plays out in front of you/i);
  });

  it("links to the archived practice paper without duplicating its content", () => {
    expect(html).toMatch(/href="[^"]*\/assessments\/final-exam\/practice-exam\/"/);
    expect(html).not.toMatch(/Model solution/);
    expect(html).not.toMatch(/chicken thighs/);
  });

  it("names the practice paper's sitting explicitly as Semester 1, 2026", () => {
    expect(html).toMatch(/Semester 1, 2026/);
  });
});
