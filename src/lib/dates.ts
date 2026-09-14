const longDate = new Intl.DateTimeFormat("en-AU", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** Format a date-only value without letting the viewer's timezone move it. */
export function formatCourseDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return longDate.format(date);
}

// Australia/Sydney observes the same offsets/DST transitions as Canberra
// (no separate IANA zone exists for Canberra), so formatting a due
// timestamp's time-of-day in that zone reconstructs the course's actual
// local time (always 12:00 — spec/assessment-scheme.test.ts enforces every
// due value is stored as exactly noon at +10:00 or +11:00) regardless of
// which of those two offsets the value happened to be written in.
const courseTime = new Intl.DateTimeFormat("en-AU", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Australia/Sydney",
});

/** Format a date with its course-local time of day, e.g. "12:00, 30 April 2027". */
export function formatCourseDateTime(value: Date): string {
  return `${courseTime.format(value)}, ${formatCourseDate(value)}`;
}
