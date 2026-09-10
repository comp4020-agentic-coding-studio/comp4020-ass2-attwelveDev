import { describe, expect, it } from "vitest";
import { findSincerityBreaks } from "./check-voice-tone.ts";

describe("findSincerityBreaks", () => {
  it("flags each known tell-phrase", () => {
    expect(findSincerityBreaks("but seriously, do your laundry")).toEqual(["but seriously"]);
    expect(findSincerityBreaks("remember to shower")).toEqual(["remember to"]);
  });

  it("flags nothing in clean deadpan copy", () => {
    expect(findSincerityBreaks("Assemble one outfit for a stated occasion.")).toEqual([]);
  });

  it("is case-insensitive", () => {
    expect(findSincerityBreaks("BUT SERIOUSLY.")).toEqual(["but seriously"]);
  });
});
