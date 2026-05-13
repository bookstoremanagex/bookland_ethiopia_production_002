import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  status: z.enum(["available", "closed", "maintenance"]).default("available"),
});

export type StoreFormValues = z.infer<typeof storeSchema>;
