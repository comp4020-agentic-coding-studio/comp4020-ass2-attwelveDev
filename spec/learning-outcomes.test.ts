import { describe, expect, it } from "vitest";
import { toOutcomeRanges } from "../src/lib/learning-outcomes";

describe("toOutcomeRanges", () => {
  it("collapses a fully contiguous list into one range", () => {
    expect(toOutcomeRanges([1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual([{ start: 1, end: 9 }]);
  });

  it("splits a non-contiguous list into separate ranges", () => {
    expect(toOutcomeRanges([1, 2, 3, 4, 7, 8, 9])).toEqual([
      { start: 1, end: 4 },
      { start: 7, end: 9 },
    ]);
  });

  it("treats a single value as a range of length one", () => {
    expect(toOutcomeRanges([5])).toEqual([{ start: 5, end: 5 }]);
  });

  it("sorts and deduplicates unordered input", () => {
    expect(toOutcomeRanges([9, 1, 2, 2])).toEqual([
      { start: 1, end: 2 },
      { start: 9, end: 9 },
    ]);
  });
});
