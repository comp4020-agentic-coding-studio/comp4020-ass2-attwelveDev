import { describe, expect, it } from "vitest";
import { neighbors } from "../src/lib/entry-order";

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
