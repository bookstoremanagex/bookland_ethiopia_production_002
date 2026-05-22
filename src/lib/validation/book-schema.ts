import { z } from "zod";

export const bookSchema = z.object({
  isbn: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  pen_name: z.string().optional().nullable(),
  translator: z.string().optional().nullable(),
  designer: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  edition: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  publication_year: z.string().min(1, "Publication year is required"),
  print_batch_id: z.string().optional().nullable(),
  number_of_pages: z.coerce.number().optional().nullable(),
  info: z.string().optional().nullable(),
  book_image_url: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  productionstatus: z
    .enum([
      "ON_PRODUCTION",
      "TRANSLATION",
      "DESIGN",
      "PRINTING",
      "PREPRINTING",
      "DISTRIBUTION",
      "SALES",
    ])
    .optional()
    .nullable(),
});

export type BookFormValues = z.infer<typeof bookSchema>;
