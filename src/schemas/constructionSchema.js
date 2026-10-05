import { z } from "zod";

export const PROJECT_STATUSES = [
  "planning",
  "in_progress",
  "completed",
  "on_hold",
];

export const constructionProjectSchema = z.object({
  name: z
    .string({ required_error: "Project name is required" })
    .min(3, "Project name is required")
    .trim(),

  location: z
    .string({ required_error: "Location is required" })
    .min(1, "Location is required")
    .trim(),

  totalBudget: z.coerce
    .number({ invalid_type_error: "Total budget must be a number" })
    .min(0, "Budget cannot be negative"),

  status: z
    .enum(PROJECT_STATUSES, {
      invalid_type_error: "Select a valid project status",
    })
    .default("in_progress"),

  startDate: z.coerce
    .date({ invalid_type_error: "Invalid start date format" })
    .optional()
    .default(() => new Date()),

  expectedCompletionDate: z.coerce
    .date({ invalid_type_error: "Invalid completion date format" })
    .optional()
    .nullable(),
});
