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
    "Develop and maintain basic personal hygiene and daily routines without external prompting.",
    "Recognise the role of sleep, nutrition, and exercise in daily functioning.",
    "Select weather- and occasion-appropriate attire without assistance.",
    "Initiate and sustain a basic social interaction, including small talk and eye contact.",
    "Recognise social cues and respond appropriately in everyday interactions.",
    "Build and maintain friendships and other interpersonal relationships through consistent, low-effort maintenance behaviours.",
    "Participate in activities and have interests outside academic work.",
    "Establish routines that support independent life like cleaning, laundry, and cooking.",
    "Conduct oneself professionally in interviews, meetings, and written workplace communication.",
  ],
}) satisfies CourseMetaInput;
