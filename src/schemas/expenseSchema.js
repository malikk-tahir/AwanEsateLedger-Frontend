import { z } from "zod";

export const expenseSchema = z.object({
  workerId: z.string().min(1, "Please select a worker"),
  contractAmount: z.coerce
    .number()
    .min(0, "Contract amount cannot be negative")
    .optional()
    .default(0),
  labourCost: z.coerce
    .number()
    .min(0, "Labour cost cannot be negative")
    .optional()
    .default(0),
  materialCost: z.coerce
    .number()
    .min(0, "Material cost cannot be negative")
    .optional()
    .default(0),
  amountPaid: z.coerce
    .number()
    .min(0, "Amount paid cannot be negative")
    .optional()
    .default(0),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});
