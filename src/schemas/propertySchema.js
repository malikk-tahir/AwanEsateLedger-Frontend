import { z } from "zod";

export const PROPERTY_TYPES = ["plot", "house", "shop", "plaza", "other"];
export const PROPERTY_STATUSES = [
  "available",
  "under_offer",
  "sold",
  "transferred",
  "resale",
];
export const PAYMENT_TYPES = ["purchase_payment", "sale_receipt", "commission"];

export const propertySchema = z
  .object({
    name: z
      .string({ required_error: "Property name is required" })
      .min(2, "Name must be at least 2 characters")
      .trim(),

    location: z
      .string({ required_error: "Location is required" })
      .min(3, "Location must be at least 3 characters")
      .trim(),

    propertyType: z.enum(["plot", "house", "shop", "plaza", "other"], {
      required_error: "Property type is required",
      invalid_type_error: "Invalid property type",
    }),

    status: z.enum(
      ["available", "under_offer", "sold", "transferred", "resale"],
      {
        required_error: "Status is required",
        invalid_type_error: "Invalid property status",
      },
    ),

    demandPrice: z.coerce
      .number({ required_error: "Demand price is required" })
      .positive("Demand price must be greater than 0"),

    size: z.string().trim().optional(),

    taxPercentage: z.coerce
      .number()
      .min(0, "Tax percentage cannot be negative")
      .max(100, "Tax percentage cannot exceed 100%")
      .default(0),

    isOwned: z.boolean().default(false),

    ownerName: z.string().trim().optional(),
    ownerContact: z.string().trim().optional(),

    purchasePrice: z.coerce
      .number()
      .min(0, "Price cannot be negative")
      .default(0),
    finalSellingPrice: z.coerce
      .number()
      .min(0, "Price cannot be negative")
      .default(0),
  })
  .superRefine((data, ctx) => {
    if (!data.isOwned) {
      if (!data.ownerName || data.ownerName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Owner name is required for third-party properties",
          path: ["ownerName"],
        });
      }

      if (!data.ownerContact || data.ownerContact.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Owner contact is required for third-party properties",
          path: ["ownerContact"],
        });
      }
    }
  });

export const paymentSchema = z.object({
  amount: z.coerce
    .number({ required_error: "Payment amount is required" })
    .positive("Payment amount must be greater than 0"),

  paymentType: z.enum(PAYMENT_TYPES, {
    required_error: "Payment type is required",
    invalid_type_error: "Invalid payment type",
  }),

  note: z.string().trim().optional().default(""),

  date: z.coerce.date().default(() => new Date()),
});
