import { z } from "zod";

export const translatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  phoneNumber: z.string().optional().nullable().or(z.literal("")),
  pen_name: z.string().optional().nullable().or(z.literal("")),
});

export type TranslatorFormValues = z.infer<typeof translatorSchema>;
