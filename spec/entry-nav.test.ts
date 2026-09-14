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
const sessions = api.nodes.filter((node) => node.type === "sessions");

function sessionPage(id: string): string {
  return readFileSync(resolve(`dist/sessions/${id}/index.html`), "utf8");
}

function titleForWeek(week: number): string {
  const node = sessions.find((n) => Number(n.meta?.week) === week);
  if (!node) throw new Error(`no session node for week ${week}`);
  return node.title;
}

describe("Lab navigation", () => {
  it("gives week 6 exactly two entry-nav links", () => {
    const matches = sessionPage("week-06").match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("gives week 1 exactly one entry-nav link (next only)", () => {
    const html = sessionPage("week-01");
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).not.toMatch(/\/sessions\/week-00\//);
  });

  it("gives week 12 exactly one entry-nav link (previous only)", () => {
    const html = sessionPage("week-12");
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).not.toMatch(/\/sessions\/week-13\//);
  });

  it("links week 6's previous control to week 5's Lab and shows its title", () => {
    const html = sessionPage("week-06");
    expect(html).toMatch(/href="[^"]*\/sessions\/week-05\/"/);
    expect(html).toContain("Week 5");
    expect(html).toContain(titleForWeek(5));
  });
});
