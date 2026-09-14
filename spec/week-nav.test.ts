import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  meta?: Record<string, unknown>;
}
interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const lectures = api.nodes.filter((node) => node.type === "lectures");

function lecturePage(id: string): string {
  return readFileSync(resolve(`dist/lectures/${id}/index.html`), "utf8");
}

function titleForWeek(week: number): string {
  const node = lectures.find((n) => Number(n.meta?.week) === week);
  if (!node) throw new Error(`no lecture node for week ${week}`);
  return node.title;
}

describe("week navigation header — links", () => {
  it("gives week 6 exactly two week-nav links (previous and next)", () => {
    const matches = lecturePage("week-06").match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("gives week 1 exactly one week-nav link (next only, no week 0)", () => {
    const html = lecturePage("week-01");
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).not.toMatch(/\/lectures\/week-00\//);
  });

  it("gives week 12 exactly one week-nav link (previous only, no week 13)", () => {
    const html = lecturePage("week-12");
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).not.toMatch(/\/lectures\/week-13\//);
  });

  it("links week 6's previous control to week 5 and shows week 5's own title", () => {
    const html = lecturePage("week-06");
    expect(html).toMatch(/href="[^"]*\/lectures\/week-05\/"/);
    expect(html).toContain("Week 5");
    expect(html).toContain(titleForWeek(5));
  });

  it("links week 6's next control to week 7 and shows week 7's own title", () => {
    const html = lecturePage("week-06");
    expect(html).toMatch(/href="[^"]*\/lectures\/week-07\/"/);
    expect(html).toContain("Week 7");
    expect(html).toContain(titleForWeek(7));
  });
});

describe("week navigation header — reserved space", () => {
  it("keeps both side columns present on week 1 so the center stays centered", () => {
    const html = lecturePage("week-01");
    expect(html.match(/class="week-nav-side week-nav-side--prev"/g)?.length).toBe(1);
    expect(html.match(/class="week-nav-side week-nav-side--next"/g)?.length).toBe(1);
  });

  it("keeps both side columns present on week 12 so the center stays centered", () => {
    const html = lecturePage("week-12");
    expect(html.match(/class="week-nav-side week-nav-side--prev"/g)?.length).toBe(1);
    expect(html.match(/class="week-nav-side week-nav-side--next"/g)?.length).toBe(1);
  });
});
