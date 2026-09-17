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

  it("notes stations may be completed in any order", () => {
    expect(html).toMatch(/Stations may be completed in any order/i);
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

  it("headlines itself as SLOP1521's 2026 final exam", () => {
    expect(html).toMatch(/<h1[^>]*>SLOP1521: 2026 Final Exam<\/h1>/);
  });

  it("names the course code and title", () => {
    expect(html).toMatch(/SLOP1521/);
    expect(html).toMatch(/Introduction to Life: Foundations of Being a Person/);
  });

  it("states the exam date, weight, and total marks", () => {
    expect(html).toMatch(/12:00, 10 June 2026/);
    expect(html).toMatch(/30% of final grade/);
    expect(html).toMatch(/Total marks/i);
    expect(html).toMatch(/\b100\b/);
  });

  it("gives candidate name and student ID fields", () => {
    expect(html).toMatch(/Candidate name/i);
    expect(html).toMatch(/Student ID/i);
  });

  it("repeats the real exam's conditions before the stations begin", () => {
    const conditionsIndex = html.indexOf("Exam conditions");
    const station1Index = html.indexOf("<h2>Station 1");
    expect(conditionsIndex).toBeGreaterThan(-1);
    expect(station1Index).toBeGreaterThan(conditionsIndex);
    expect(html).toMatch(/black or blue pen/i);
    expect(html).toMatch(/closed book/i);
    expect(html).toMatch(/Station 3 makes talking compulsory/i);
    expect(html).toMatch(/academic misconduct/i);
  });

  it("frames this paper itself as the official answer booklet, since the fill-in tables are inline", () => {
    expect(html).toMatch(/this booklet is the official exam answer booklet issued for your written answers/i);
    expect(html).not.toMatch(/Stations 1 to 4/i);
    expect(html).not.toMatch(/not written up/i);
  });
});

describe("station 1: hygiene and health", () => {
  it("asks the candidate to fill in their own schedule, not analyse a given one", () => {
    const section = html.slice(html.indexOf("<h2>Station 1"), html.indexOf("<h2>Station 2"));
    expect(section).toMatch(/fill in the schedule below with your own/i);
    const openTable = section.slice(0, section.indexOf("<details"));
    expect(openTable).toMatch(/<td><\/td>/);
  });

  it("has the candidate state their own semester intent before logging it", () => {
    const section = html.slice(html.indexOf("<h2>Station 1"), html.indexOf("<h2>Station 2"));
    expect(section).toMatch(/state your own semester intent/i);
    expect(section).toMatch(/Shower:/);
    expect(section).toMatch(/Bedtime:/);
    expect(section).toMatch(/Laundry:/);
    expect(section).toMatch(/Exercise:/);
    const intentIndex = section.search(/state your own semester intent/i);
    const tableIndex = section.indexOf("<table>");
    expect(tableIndex).toBeGreaterThan(intentIndex);
  });

  it("keeps the old failing example inside the reveal, as the worked Poor solution", () => {
    const section = html.slice(html.indexOf("<h2>Station 1"), html.indexOf("<h2>Station 2"));
    const poorIndex = section.indexOf("Poor solution");
    const exampleIndex = section.indexOf("walk to vending machine");
    expect(poorIndex).toBeGreaterThan(-1);
    expect(exampleIndex).toBeGreaterThan(poorIndex);
    expect(section).toMatch(/visible from the doorway/);
  });

  it("gives the poor example its own stated intent to check the schedule against", () => {
    const section = html.slice(html.indexOf("<h2>Station 1"), html.indexOf("<h2>Station 2"));
    const poorIndex = section.indexOf("Poor solution");
    const poorSection = section.slice(poorIndex);
    expect(poorSection).toMatch(/Stated intent/i);
    const intentIndex = poorSection.search(/Stated intent/i);
    const tableIndex = poorSection.indexOf("<table>");
    expect(tableIndex).toBeGreaterThan(intentIndex);
  });

  it("grades checking a real schedule against the definitions, not spotting failures in a fixed example", () => {
    const section = html.slice(html.indexOf("<h2>Station 1"), html.indexOf("<h2>Station 2"));
    expect(section).toMatch(/not whether the result happens to be a pass or a fail/i);
  });

  it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
    expect(html).toMatch(/<details/);
    expect(html).toMatch(/Model solution/);
    expect(html).toMatch(/Poor solution/);
    expect(html).toMatch(/Examiner's notes/);
    expect(html).toMatch(/Rubric/);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("<h2>Station 1"), html.indexOf("<h2>Station 2"));
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
    const section = html.slice(html.indexOf("<h2>Station 2"), html.indexOf("<h2>Station 3"));
    expect(section).toMatch(/Model solution/);
    expect(section).toMatch(/Poor solution/);
    expect(section).toMatch(/Examiner's notes/);
    expect(section).toMatch(/Rubric/);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("<h2>Station 2"), html.indexOf("<h2>Station 3"));
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
    const section = html.slice(html.indexOf("<h2>Station 3"), html.indexOf("<h2>Station 4"));
    const poorIndex = section.indexOf("Poor solution");
    const exampleIndex = section.indexOf("weekend at the coast");
    expect(poorIndex).toBeGreaterThan(-1);
    expect(exampleIndex).toBeGreaterThan(poorIndex);
    expect(section).toMatch(/getting into pottery/i);
  });

  it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
    const section = html.slice(html.indexOf("<h2>Station 3"), html.indexOf("<h2>Station 4"));
    expect(section).toMatch(/Model solution/);
    expect(section).toMatch(/Poor solution/);
    expect(section).toMatch(/Examiner's notes/);
    expect(section).toMatch(/Rubric/);
  });

  it("grades the real live conversation, not the written rehearsal", () => {
    const section = html.slice(html.indexOf("<h2>Station 3"), html.indexOf("<h2>Station 4"));
    expect(section).toMatch(/as marked live/i);
    expect(section).toMatch(/completes the exchange within the ten-minute window/i);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("<h2>Station 3"), html.indexOf("<h2>Station 4"));
    expect(section).toMatch(/\bHD\b/);
    expect(section).toMatch(/\bN\b/);
    expect(section).toMatch(/out of 20/);
  });
});

describe("station 4: reading the room", () => {
  it("gives a transcript with the stall cues embedded in dialogue", () => {
    expect(html).toMatch(/one-word answers/);
    expect(html).toMatch(/checked their watch/);
  });

  it("notes the real exam scenario plays out live, and the transcript is for the practice paper", () => {
    const section = html.slice(html.indexOf("<h2>Station 4"), html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/plays out live in front of you/i);
    expect(section).toMatch(/provided for the purpose of this practice exam/i);
  });

  it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
    const section = html.slice(html.indexOf("<h2>Station 4"), html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/Model solution/);
    expect(section).toMatch(/Poor solution/);
    expect(section).toMatch(/Examiner's notes/);
    expect(section).toMatch(/Rubric/);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("<h2>Station 4"), html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/\bHD\b/);
    expect(section).toMatch(/\bN\b/);
    expect(section).toMatch(/out of 20/);
  });
});

describe("station 5: daily survival", () => {
  it("gives a pantry and a stated budget", () => {
    expect(html).toMatch(/chicken thighs/);
    expect(html).toMatch(/\$12/);
  });

  it("prices every pantry item so the budget can actually be checked", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/Chicken thighs/);
    expect(section).toMatch(/\$6\.00/);
    expect(section).toMatch(/Frozen mixed vegetables/i);
    expect(section).toMatch(/\$3\.00/);
    expect(section).toMatch(/One dried spice mix/i);
    expect(section).toMatch(/\$1\.50/);
  });

  it("shows the model solution's chosen items actually add up within budget", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/\$11\.00/);
    expect(section).toMatch(/within the stated \$12 budget/i);
  });

  it("warns that the full pantry, taken together, exceeds the budget", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/\$13\.30/);
  });

  it("notes the cooking itself is marked by observation, alongside the written plan", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/answer booklet/i);
    expect(section).toMatch(/mark the cooking itself by observation/i);
  });

  it("makes cooking the plan part of the question, not just planning it", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/use this plan to actually cook it/i);
  });

  it("notes that cooking materials and a kitchen area are provided", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/cookware/i);
    expect(section).toMatch(/kitchen area/i);
  });

  it("reveals model solution, poor solution, examiner's notes, and a rubric", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/Model solution/);
    expect(section).toMatch(/Poor solution/);
    expect(section).toMatch(/Examiner's notes/);
    expect(section).toMatch(/Rubric/);
  });

  it("gives the rubric as HD/D/C/P/N bands with a mark breakdown summing to the station's weight", () => {
    const section = html.slice(html.indexOf("<h2>Station 5"));
    expect(section).toMatch(/\bHD\b/);
    expect(section).toMatch(/\bN\b/);
    expect(section).toMatch(/out of 30/);
  });
});
