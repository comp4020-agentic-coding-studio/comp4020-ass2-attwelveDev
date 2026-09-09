import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    description: z.string().trim().min(80).max(300),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
    learningOutcomes: z.array(z.string().trim().min(1)).max(12).default([]),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
// Replace every placeholder value, but keep the shape: the catalogue ingests
// this API contract when the course is published.
//
// The code's last three digits were assigned to this repo when it was
// provisioned, and no other course in the cohort has them. Change the first
// digit to your course's level (and `level` to match); keep the other three.
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP1521",
  title: "Introduction to Life: Personal Systems Maintenance",
  session: "Semester 1",
  year: 2027,
  level: 1,
  startDate: "2027-02-22",
  endDate: "2027-06-19",
  description:
    "The maintenance of a human being, taught as systems engineering: " +
    "scheduling, root-cause analysis and regression testing applied to " +
    "sleep, hygiene, conversation and money. Assessed by practical examination.",
  tags: ["life skills", "wellbeing", "self-management"],
  learningOutcomes: [
    "Schedule and maintain a personal hygiene subsystem without external prompting.",
    "Select and justify a wardrobe against context, budget and garment longevity.",
    "Diagnose and correct a sleep, health or exercise regression using your own telemetry.",
    "Operate outside a screened environment for an extended, unscheduled period.",
    "Recognise when a device is the root cause of a personal-systems fault and intervene manually.",
    "Conduct real-time, unscripted conversation as a practical interpersonal protocol.",
    "Maintain a friendship or working relationship across a full semester with no dropped commitments.",
    "Initiate and manage a personal relationship's logistics without a written specification.",
    "Integrate every subsystem above into a single functioning adult under examination conditions.",
  ],
}) satisfies CourseMetaInput;
