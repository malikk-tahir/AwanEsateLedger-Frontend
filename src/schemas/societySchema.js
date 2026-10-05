import { z } from "zod";

export const SOCIETY_PROJECT_TYPES = ["file", "plot"];
export const SOCIETY_PROJECT_STATUSES = [
  "active_installment",
  "fully_paid",
  "sold",
  "cancelled",
  "only_down_payment",
  "open",
];

export const INSTALLMENT_STATUSES = [
  "pending",
  "paid",
  "partially_paid",
  "overdue",
  "waived",
];

export const societyProjectSchema = z.object({
  societyName: z
    .string({ required_error: "Society name is required" })
    .min(1, "Society name cannot be empty")
    .trim(),

  type: z
    .enum(SOCIETY_PROJECT_TYPES, {
      required_error: "Project type is required",
      invalid_type_error: "Invalid project type",
    })
    .default("file"),

  registrationNumber: z.string().trim().optional().default(""),

  fileOrPlotNumber: z.string().trim().optional().default(""),

  blockOrSector: z.string().trim().optional().default(""),

  size: z.string().trim().optional().default(""),

  totalPrice: z.coerce
    .number({ required_error: "Total price is required" })
    .positive("Total price must be greater than 0"),

  demandPrice: z.coerce
    .number()
    .min(0, "Demand price cannot be negative")
    .default(0),

  profit: z.coerce.number().min(0, "Profit cannot be negative").default(0),

  downPaymentPaid: z.coerce
    .number()
    .min(0, "Down payment cannot be negative")
    .default(0),

  status: z
    .enum(SOCIETY_PROJECT_STATUSES, {
      required_error: "Status is required",
      invalid_type_error: "Invalid project status",
    })
    .default("active_installment"),
});

export const installmentSchema = z.object({
  amount: z.coerce
    .number({ required_error: "Installment amount is required" })
    .positive("Installment amount must be greater than 0"),

  paidAmount: z.coerce
    .number()
    .min(0, "Paid amount cannot be negative")
    .default(0),

  dueDate: z.coerce.date({
    required_error: "Due date is required",
    invalid_type_error: "Invalid due date format",
  }),

  paidDate: z
    .preprocess(
      (val) => (val === "" || val === null ? null : val),
      z.coerce.date({ invalid_type_error: "Invalid date format" }).nullable(),
    )
    .optional()
    .default(null),

  status: z
    .enum(INSTALLMENT_STATUSES, {
      required_error: "Status is required",
      invalid_type_error: "Invalid installment status",
    })
    .default("pending"),

  note: z.string().trim().optional().default(""),
});
