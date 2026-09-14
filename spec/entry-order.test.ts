import { describe, expect, it } from "vitest";
import { assessmentNavLabel, neighbors } from "../src/lib/entry-order";

describe("neighbors", () => {
  it("returns both neighbours for a middle entry", () => {
    const list = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(neighbors(list, "b")).toEqual({ previous: { id: "a" }, next: { id: "c" } });
  });

  it("omits previous for the first entry", () => {
    const list = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(neighbors(list, "a")).toEqual({ previous: undefined, next: { id: "b" } });
  });

  it("omits next for the last entry", () => {
    const list = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(neighbors(list, "c")).toEqual({ previous: { id: "b" }, next: undefined });
  });

  it("returns both undefined when the id isn't in the list", () => {
    const list = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(neighbors(list, "z")).toEqual({ previous: undefined, next: undefined });
  });
});

describe("assessmentNavLabel", () => {
  it("splits an 'Assignment N: name' title into primary + subtitle", () => {
    expect(assessmentNavLabel("Assignment 2: Touch Grass Field Study")).toEqual({
      primary: "Assignment 2",
      subtitle: "Touch Grass Field Study",
    });
  });

  it("leaves a title with no 'Assignment N:' prefix as a plain primary label", () => {
    expect(assessmentNavLabel("Final Exam")).toEqual({ primary: "Final Exam" });
  });

  it("leaves 'Weekly Reflections' as a plain primary label", () => {
    expect(assessmentNavLabel("Weekly Reflections")).toEqual({ primary: "Weekly Reflections" });
  });
});
