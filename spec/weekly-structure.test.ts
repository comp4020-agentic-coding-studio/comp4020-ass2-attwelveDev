import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { formatCourseDate } from "../src/lib/dates";

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
const lectures = api.nodes.filter((node) => node.type === "lectures");
const sessions = api.nodes.filter((node) => node.type === "sessions");

// From plan §3.2's verified calendar.
const TEACHING_DATES: Record<number, { lecture: string; lab: string }> = {
  1: { lecture: "2027-02-23", lab: "2027-02-25" },
  2: { lecture: "2027-03-02", lab: "2027-03-04" },
  3: { lecture: "2027-03-09", lab: "2027-03-11" },
  4: { lecture: "2027-03-16", lab: "2027-03-18" },
  5: { lecture: "2027-03-23", lab: "2027-03-25" },
  6: { lecture: "2027-03-30", lab: "2027-04-01" },
  7: { lecture: "2027-04-20", lab: "2027-04-22" },
  8: { lecture: "2027-04-27", lab: "2027-04-29" },
  9: { lecture: "2027-05-04", lab: "2027-05-06" },
  10: { lecture: "2027-05-11", lab: "2027-05-13" },
  11: { lecture: "2027-05-18", lab: "2027-05-20" },
  12: { lecture: "2027-05-25", lab: "2027-05-27" },
};

const TEACHING_START = "2027-02-23";
const TEACHING_END = "2027-05-27";

function renderedPage(id: string): string {
  return readFileSync(resolve(`dist/${id}/index.html`), "utf8");
}

interface HeadingSpan {
  start: number;
  end: number;
}

/**
 * Locates a heading whose visible text starts with `text` — headings render
 * with a trailing anchor-link element (`<h2 id="...">Text<a ...>#</a></h2>`),
 * so this matches the opening tag through the start of `text` and then finds
 * the corresponding closing tag, rather than requiring an exact `</hN>`
 * immediately after the text.
 */
function findHeading(html: string, text: string): HeadingSpan {
  const openMatch = html.match(new RegExp(`<h[1-6][^>]*>${text}<`));
  if (!openMatch || openMatch.index === undefined) return { start: -1, end: -1 };
  const start = openMatch.index;
  const closeStart = html.indexOf("</h", start);
  if (closeStart === -1) return { start, end: start };
  const closeEnd = html.indexOf(">", closeStart) + 1;
  return { start, end: closeEnd };
}

function nextHeadingIndex(html: string, fromIndex: number): number {
  const rest = html.slice(fromIndex);
  const match = rest.match(/<h[1-6][^>]*>/);
  return match && match.index !== undefined ? fromIndex + match.index : html.length;
}

function assertHeadingsInOrder(html: string, headings: string[], label: string): void {
  let previousIndex = -1;
  for (const heading of headings) {
    const { start } = findHeading(html, heading);
    expect(start, `${label} is missing the "${heading}" heading`).toBeGreaterThan(-1);
    expect(start, `${label}'s "${heading}" heading is out of order`).toBeGreaterThan(
      previousIndex,
    );
    previousIndex = start;
  }
}

describe("weekly structure — lectures", () => {
  it("carries all five slots in order in every lecture", () => {
    for (const lecture of lectures) {
      const html = renderedPage(lecture.id);
      assertHeadingsInOrder(
        html,
        ["Introduction", "Definitions", "Body", "In-lecture activity", "Conclusion"],
        lecture.id,
      );
    }
  });

  it("gives every lecture a substantial Body section", () => {
    for (const lecture of lectures) {
      const html = renderedPage(lecture.id);
      const heading = findHeading(html, "Body");
      expect(heading.start, `${lecture.id} has no Body heading`).toBeGreaterThan(-1);
      const end = nextHeadingIndex(html, heading.end);
      const text = html
        .slice(heading.end, end)
        .replace(/<[^>]+>/g, "")
        .trim();
      expect(
        text.length,
        `${lecture.id}'s Body section is too short to carry real content`,
      ).toBeGreaterThanOrEqual(80);
    }
  });
});

describe("weekly structure — Labs", () => {
  it("carries all three slots in order in every Lab", () => {
    for (const session of sessions) {
      const html = renderedPage(session.id);
      assertHeadingsInOrder(html, ["Before the Lab", "In the Lab", "Afterwards"], session.id);
    }
  });

  it("gives every Lab a spec list", () => {
    for (const session of sessions) {
      expect(session.spec?.length, `${session.id} has no spec list`).toBeGreaterThan(0);
    }
  });
});

describe("weekly structure — coverage", () => {
  it("covers weeks 1 to 12 with exactly one lecture each", () => {
    const weeks = lectures.map((node) => Number(node.meta?.week)).sort((a, b) => a - b);
    expect(weeks).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  });

  it("covers weeks 1 to 12 with exactly one Lab each", () => {
    const weeks = sessions.map((node) => Number(node.meta?.week)).sort((a, b) => a - b);
    expect(weeks).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  });
});

describe("weekly structure — scheduling", () => {
  it("keeps every present week number unique and in range", () => {
    for (const [label, nodes] of [
      ["lectures", lectures],
      ["Labs", sessions],
    ] as const) {
      const weeks = nodes.map((node) => Number(node.meta?.week));
      const unique = new Set(weeks);
      expect(unique.size, `${label} repeat a week number`).toBe(weeks.length);
      for (const week of weeks) {
        expect(week, `${label} has a week outside 1-12`).toBeGreaterThanOrEqual(1);
        expect(week).toBeLessThanOrEqual(12);
      }
    }
  });

  it("dates every lecture on the Tuesday of its week", () => {
    for (const lecture of lectures) {
      const week = Number(lecture.meta?.week);
      expect(String(lecture.meta?.date), `${lecture.id} is dated wrong`).toBe(
        TEACHING_DATES[week].lecture,
      );
    }
  });

  it("dates every Lab on the Thursday of its week", () => {
    for (const session of sessions) {
      const week = Number(session.meta?.week);
      expect(String(session.meta?.date), `${session.id} is dated wrong`).toBe(
        TEACHING_DATES[week].lab,
      );
    }
  });

  it("advances the date with the week number", () => {
    for (const [label, nodes] of [
      ["lectures", lectures],
      ["Labs", sessions],
    ] as const) {
      const sorted = [...nodes].sort(
        (a, b) => Number(a.meta?.week) - Number(b.meta?.week),
      );
      for (let i = 1; i < sorted.length; i++) {
        expect(
          String(sorted[i - 1].meta?.date) < String(sorted[i].meta?.date),
          `${label}: week ${sorted[i - 1].meta?.week}'s date doesn't precede week ${sorted[i].meta?.week}'s`,
        ).toBe(true);
      }
    }
  });

  it("keeps every teaching date inside the teaching weeks", () => {
    for (const node of [...lectures, ...sessions]) {
      const date = String(node.meta?.date);
      expect(date >= TEACHING_START, `${node.id} falls before teaching starts`).toBe(true);
      expect(date <= TEACHING_END, `${node.id} falls after teaching ends`).toBe(true);
    }
  });

  it("closes the loop on both recurring datasets", () => {
    const html = renderedPage("lectures/week-12");
    expect(html).toMatch(/desk/i);
    expect(html).toMatch(/sock/i);
  });
});

describe("weekly structure — reflection due dates", () => {
  function addDays(iso: string, days: number): string {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function reflectionDueOn(id: string): string | undefined {
    const html = renderedPage(id);
    return html.match(/<dt>Reflection due<\/dt>\s*<dd>([^<]*)<\/dd>/)?.[1];
  }

  it("shows each lecture's and Lab's reflection due on week N+1's actual lecture date", () => {
    for (let week = 1; week <= 12; week++) {
      const nextWeek = TEACHING_DATES[week + 1];
      const expected = formatCourseDate(
        nextWeek ? nextWeek.lecture : addDays(TEACHING_DATES[week].lecture, 7),
      );
      const weekLabel = String(week).padStart(2, "0");
      expect(
        reflectionDueOn(`lectures/week-${weekLabel}`),
        `lectures/week-${weekLabel}'s reflection due date is wrong`,
      ).toBe(expected);
      expect(
        reflectionDueOn(`sessions/week-${weekLabel}`),
        `sessions/week-${weekLabel}'s reflection due date is wrong`,
      ).toBe(expected);
    }
  });

  it("does not land week 6's reflection inside the teaching break", () => {
    const expected = formatCourseDate("2027-04-20");
    expect(reflectionDueOn("lectures/week-06")).toBe(expected);
    expect(reflectionDueOn("sessions/week-06")).toBe(expected);
  });

  it("tells week 6 students their reflection isn't due during the break", () => {
    const html = renderedPage("lectures/week-06");
    const paragraph = html.match(/<strong>This week.s reflection<\/strong>[\s\S]*?<\/p>/)?.[0];
    expect(paragraph, "week 6's reflection paragraph is missing").toBeTruthy();
    expect(paragraph).toMatch(/break/i);
    expect(paragraph).toMatch(/due 12:00 Tuesday of week 7/);
  });

  it("documents week 6's reflection as the exception to the weekly-Tuesday rule", () => {
    const html = renderedPage("assessments/weekly-reflections");
    const { start, end } = findHeading(html, "How the totals work");
    expect(start, "weekly-reflections is missing the \"How the totals work\" heading").toBeGreaterThan(-1);
    const sectionEnd = nextHeadingIndex(html, end);
    const section = html.slice(end, sectionEnd);
    expect(section).toMatch(/Week 6/);
    expect(section).toMatch(/break/i);
  });
});
