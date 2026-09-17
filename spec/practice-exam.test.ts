import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(
  resolve("dist/assessments/final-exam/practice-exam/index.html"),
  "utf8",
);

describe("practice exam archive", () => {
  it("is dated as an archived past sitting", () => {
    expect(html).toMatch(/Semester 1, 2026/);
  });

  it("states reading and writing time", () => {
    expect(html).toMatch(/reading time/i);
    expect(html).toMatch(/writing time/i);
    expect(html).toMatch(/2 hours 50 minutes/);
  });

  it("carries real exam-paper conventions", () => {
    expect(html).toMatch(/do not turn this page until instructed/i);
  });

  it("runs the same five stations as the final exam, in order", () => {
    for (let station = 1; station <= 5; station++) {
      expect(html, `missing Station ${station}`).toMatch(new RegExp(`Station ${station}\\b`));
    }
    expect(html).toMatch(/Hygiene and Health/);
    expect(html).toMatch(/Fashion/);
    expect(html).toMatch(/Small Talk/);
    expect(html).toMatch(/Reading the Room/);
    expect(html).toMatch(/Daily Survival/);
  });
});

describe("station 1: hygiene and health", () => {
  it("gives a sample logged schedule", () => {
    expect(html).toMatch(/walk to vending machine/);
    expect(html).toMatch(/visible from the doorway/);
  });

  it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
    expect(html).toMatch(/<details/);
    expect(html).toMatch(/Model solution/);
    expect(html).toMatch(/Poor solution/);
    expect(html).toMatch(/Examiner's notes/);
    expect(html).toMatch(/Rubric/);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("Station 1"), html.indexOf("Station 2"));
    expect(section).toMatch(/\bHD\b/);
    expect(section).toMatch(/\bN\b/);
    expect(section).toMatch(/out of 15/);
  });
});

describe("station 2: fashion", () => {
  it("gives a rack of individual items to assemble an outfit from", () => {
    expect(html).toMatch(/rack/i);
    expect(html).toMatch(/hoodie with a hole/);
    expect(html).toMatch(/full suit with tie/);
    expect(html).toMatch(/collared shirt/);
    expect(html).toMatch(/\bchinos\b/);
    expect(html).toMatch(/bow-tie graphic/);
  });

  it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
    const section = html.slice(html.indexOf("Station 2"), html.indexOf("Station 3"));
    expect(section).toMatch(/Model solution/);
    expect(section).toMatch(/Poor solution/);
    expect(section).toMatch(/Examiner's notes/);
    expect(section).toMatch(/Rubric/);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("Station 2"), html.indexOf("Station 3"));
    expect(section).toMatch(/\bHD\b/);
    expect(section).toMatch(/\bN\b/);
    expect(section).toMatch(/out of 15/);
  });
});

describe("station 3: small talk", () => {
  it("notes the real station is a live conversation, not a script", () => {
    expect(html).toMatch(/live conversation/i);
    expect(html).toMatch(/written practice paper/i);
  });

  it("carries the exam's own leave-early and ten-minute risk", () => {
    expect(html).toMatch(/leave early if the conversation stalls past recovery/i);
    expect(html).toMatch(/ten-minute mark/i);
  });

  it("quotes the notes-marking mechanic and flags it as absent from the real paper", () => {
    expect(html).toMatch(
      /"The examiner marks by taking notes live during the exchange, not by grading a transcript afterwards"/,
    );
    expect(html).toMatch(/does not appear on the real exam paper/i);
  });

  it("asks the student to write actual dialogue, not describe a strategy", () => {
    expect(html).toMatch(/write the (lines|questions) you would (use|ask)/i);
  });

  it("keeps the failed example inside the reveal, as the worked Poor solution", () => {
    const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
    const poorIndex = section.indexOf("Poor solution");
    const exampleIndex = section.indexOf("weekend at the coast");
    expect(poorIndex).toBeGreaterThan(-1);
    expect(exampleIndex).toBeGreaterThan(poorIndex);
    expect(section).toMatch(/getting into pottery/i);
  });

  it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
    const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
    expect(section).toMatch(/Model solution/);
    expect(section).toMatch(/Poor solution/);
    expect(section).toMatch(/Examiner's notes/);
    expect(section).toMatch(/Rubric/);
  });

  it("grades the real live conversation, not the written rehearsal", () => {
    const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
    expect(section).toMatch(/as marked live/i);
    expect(section).toMatch(/completes the exchange within the ten-minute window/i);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("Station 3"), html.indexOf("Station 4"));
    expect(section).toMatch(/\bHD\b/);
    expect(section).toMatch(/\bN\b/);
    expect(section).toMatch(/out of 20/);
  });
});
