import { z } from "zod";

export const WORKER_CATEGORIES = [
  "carpenter",
  "plumber",
  "electrician",
  "mason",
  "painter",
  "welder",
  "laborer",
  "other",
];

export const workerFormSchema = z.object({
  name: z
    .string({ required_error: "Worker name is required." })
    .trim()
    .min(3, "Worker name must be at least 3 characters long."),

  contact: z.string().trim().optional().or(z.literal("")),

  category: z.enum(WORKER_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid worker category." }),
  }),
});
