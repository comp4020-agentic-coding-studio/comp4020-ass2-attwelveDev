import { describe, expect, it } from "vitest";
import { formatCourseDateTime } from "../src/lib/dates";

describe("formatCourseDateTime", () => {
  it("renders the course-local time before the date for an AEDT (+11:00) timestamp", () => {
    expect(formatCourseDateTime(new Date("2027-03-19T12:00:00+11:00"))).toBe(
      "12:00, 19 March 2027",
    );
  });

  it("renders the course-local time before the date for an AEST (+10:00) timestamp", () => {
    expect(formatCourseDateTime(new Date("2027-04-30T12:00:00+10:00"))).toBe(
      "12:00, 30 April 2027",
    );
  });
});
