import { z } from "zod";

export const personalCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .trim()
    .min(1, "Category name cannot be empty")
    .transform((val) => val.toLowerCase()),
});

export const updatePersonalCategorySchema = personalCategorySchema.partial();

export const personalTransactionSchema = z.object({
  type: z.enum(["incoming", "outgoing"], {
    required_error: "Transaction type is required",
    invalid_type_error: "Type must be either 'incoming' or 'outgoing'",
  }),
  amount: z.coerce
    .number({ required_error: "Amount is required" })
    .min(1, "Amount must be greater than zero"),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Please select a valid category"),
  date: z
    .string({ required_error: "Date is required" })
    .or(z.date({ required_error: "Date is required" }))
    .transform((val) => new Date(val))
    .refine((parsedDate) => !isNaN(parsedDate.getTime()), {
      message: "Invalid date format",
    }),
  description: z.string().trim().optional().default(""),
});

export const updatePersonalTransactionSchema =
  personalTransactionSchema.partial();

export const filterSchema = z
  .object({
    type: z.enum(["all", "incoming", "outgoing"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Start date must be less than or equal to end date",
      path: ["startDate"],
    },
  );
