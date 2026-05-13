import { z } from "zod";

export const translationProjectSchema = z.object({
  bookId: z.coerce.number().min(1, "Book is required"),
  translator_id: z.coerce.number().min(1, "Translator is required"),
  Status: z.enum(["NOT_STARTED", "STARTED", "ONPROGRESS", "COMPLETED"]).default("NOT_STARTED"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type TranslationProjectFormValues = z.infer<typeof translationProjectSchema>;
