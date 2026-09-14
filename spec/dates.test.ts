import { describe, expect, it } from "vitest";
import { formatCourseDateTime } from "../src/lib/dates";

describe("formatCourseDateTime", () => {
  it("renders the course-local time (12:00) for an AEDT (+11:00) timestamp", () => {
    expect(formatCourseDateTime(new Date("2027-03-19T12:00:00+11:00"))).toBe(
      "19 March 2027, 12:00",
    );
  });

  it("renders the course-local time (12:00) for an AEST (+10:00) timestamp", () => {
    expect(formatCourseDateTime(new Date("2027-04-30T12:00:00+10:00"))).toBe(
      "30 April 2027, 12:00",
    );
  });
});
