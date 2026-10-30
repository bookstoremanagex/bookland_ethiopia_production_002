import { z } from "zod";

/**
 * A translation project can have more than one translator.
 * `translator_ids[0]` is treated as the lead translator and is also written to
 * the legacy `translator_id` column so older screens keep working.
 */
export const translationProjectSchema = z.object({
  bookId: z.coerce.number().min(1, "Book is required"),
  /**
   * Edition of the book being translated (stored as a string in the DB).
   * Missing/empty values collapse to 0 so the friendly message always shows.
   */
  edition_id: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? 0 : value),
    z.coerce.number().min(1, "Edition is required"),
  ),
  translator_ids: z
    .array(z.coerce.number().int().positive())
    .min(1, "At least one translator is required"),
  Status: z.enum(["NOT_STARTED", "STARTED", "ONPROGRESS", "COMPLETED"]).default("NOT_STARTED"),
  cost: z.coerce.number().min(0).optional().nullable(),
  payment_status: z.enum(["PENDING", "CURRENTLY_PAID", "SUCCEEDED"]).default("PENDING"),
  currently_paid: z.coerce.number().min(0).default(0),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  /** Free-text memo about the translation work (maps to `translatorbook.info`). */
  info: z.string().max(20000).optional().default(""),
});

export type TranslationProjectFormValues = z.infer<typeof translationProjectSchema>;
