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

describe("Assessment navigation", () => {
  const assessmentsIndexHtml = readFileSync(resolve("dist/assessments/index.html"), "utf8");
  const orderedIds = [...assessmentsIndexHtml.matchAll(/\/assessments\/([a-z0-9-]+)\//g)].map(
    (m) => m[1],
  );
  const uniqueOrderedIds = [...new Set(orderedIds)];

  function assessmentPage(id: string): string {
    return readFileSync(resolve(`dist/assessments/${id}/index.html`), "utf8");
  }

  it("reproduces the assessments overview page's own order as prev/next", () => {
    for (let i = 0; i < uniqueOrderedIds.length - 1; i++) {
      const a = uniqueOrderedIds[i];
      const b = uniqueOrderedIds[i + 1];
      const html = assessmentPage(a);
      expect(html).toMatch(new RegExp(`class="week-nav-link" href="[^"]*/assessments/${b}/"`));
    }
  });

  it("gives the first assessment exactly one entry-nav link (next only)", () => {
    const html = assessmentPage(uniqueOrderedIds[0]);
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).not.toMatch(/week-nav-side--prev">\s*<a/);
  });

  it("gives the last assessment exactly one entry-nav link (previous only)", () => {
    const last = uniqueOrderedIds[uniqueOrderedIds.length - 1];
    const html = assessmentPage(last);
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).not.toMatch(/week-nav-side--next">\s*<a/);
  });

  it("shows the assessment's title with no week prefix", () => {
    const middleId = uniqueOrderedIds[1];
    const html = assessmentPage(uniqueOrderedIds[0]);
    const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
    const node = api.nodes.find(
      (n) => n.type === "assessments" && n.id === `assessments/${middleId}`,
    );
    if (!node) throw new Error(`no assessment node for ${middleId}`);
    expect(html).toContain(node.title);
    const linkSection = html.match(/<a class="week-nav-link"[\s\S]*?<\/a>/)?.[0] ?? "";
    expect(linkSection).not.toMatch(/Week/);
  });
});

describe("People navigation", () => {
  function personPage(id: string): string {
    return readFileSync(resolve(`dist/people/${id}/index.html`), "utf8");
  }

  it("gives the first person (Cosima Adjei) exactly one entry-nav link (next only)", () => {
    const html = personPage("cosima-adjei");
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).toMatch(/href="[^"]*\/people\/noor-kalantari\/"/);
  });

  it("gives the last person (Thaddeus Vrell) exactly one entry-nav link (previous only)", () => {
    const html = personPage("thaddeus-vrell");
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(1);
    expect(html).toMatch(/href="[^"]*\/people\/petra-lindqvist\/"/);
  });

  it("gives a middle person (Noor Kalantari) exactly two entry-nav links", () => {
    const html = personPage("noor-kalantari");
    const matches = html.match(/class="week-nav-link"/g) ?? [];
    expect(matches.length).toBe(2);
    expect(html).toMatch(/href="[^"]*\/people\/cosima-adjei\/"/);
    expect(html).toContain("Cosima Adjei");
    expect(html).toContain("Convenor");
    expect(html).toMatch(/href="[^"]*\/people\/petra-lindqvist\/"/);
    expect(html).toContain("Petra Lindqvist");
    expect(html).toContain("Tutor");
  });

  it("uses the person's name as the center label, not a week number", () => {
    const html = personPage("noor-kalantari");
    const match = html.match(/data-week-nav-current[^>]*>([^<]*)</);
    expect(match?.[1].trim()).toBe("Noor Kalantari");
  });
});
