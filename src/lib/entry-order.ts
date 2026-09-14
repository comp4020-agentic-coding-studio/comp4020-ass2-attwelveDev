import type { CollectionEntry } from "astro:content";

export function neighbors<T extends { id: string }>(
  sorted: T[],
  currentId: string,
): { previous?: T; next?: T } {
  const index = sorted.findIndex((entry) => entry.id === currentId);
  if (index === -1) return {};
  return { previous: sorted[index - 1], next: sorted[index + 1] };
}

// "Assignment N: <name>" splits into a short "Assignment N" nav title with
// the descriptive part as a subtitle, mirroring how Lectures/Labs show
// "Week N" with the lecture/Lab title underneath. Assessments that don't
// follow that pattern (Final Exam, Weekly Reflections) render as a plain
// title with no subtitle, same as before.
const ASSIGNMENT_TITLE_PATTERN = /^(Assignment \d+): (.+)$/;

export function assessmentNavLabel(title: string): { primary: string; subtitle?: string } {
  const match = title.match(ASSIGNMENT_TITLE_PATTERN);
  if (!match) return { primary: title };
  return { primary: match[1], subtitle: match[2] };
}

// getPublishedCollection is imported dynamically inside each sorted*()
// function rather than at module top level: its own module imports
// "astro:content", a virtual module only resolvable inside Astro's build
// pipeline. A static top-level import would make plain `vitest run
// spec/entry-order.test.ts` (Task 1's dependency-free unit test on
// `neighbors`) fail just by importing this file, since ES modules
// eagerly evaluate every import regardless of which export is used.

export async function sortedLectures(): Promise<CollectionEntry<"lectures">[]> {
  const { getPublishedCollection } = await import("astro-course-university/content");
  const lectures = await getPublishedCollection("lectures");
  return lectures.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

export async function sortedSessions(): Promise<CollectionEntry<"sessions">[]> {
  const { getPublishedCollection } = await import("astro-course-university/content");
  const sessions = await getPublishedCollection("sessions");
  return sessions.sort((a, b) => a.data.week - b.data.week);
}

export async function sortedAssessments(): Promise<CollectionEntry<"assessments">[]> {
  const { getPublishedCollection } = await import("astro-course-university/content");
  const assessments = await getPublishedCollection("assessments");
  return assessments.sort((a, b) => a.data.week - b.data.week);
}

const roleOrder: Record<string, number> = { convenor: 0, tutor: 1, guest: 2, other: 3 };

export async function sortedPeople(): Promise<CollectionEntry<"people">[]> {
  const { getPublishedCollection } = await import("astro-course-university/content");
  const people = await getPublishedCollection("people");
  return people.sort((a, b) => {
    const ra = roleOrder[a.data.role ?? "other"] ?? 99;
    const rb = roleOrder[b.data.role ?? "other"] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.data.title.localeCompare(b.data.title);
  });
}
