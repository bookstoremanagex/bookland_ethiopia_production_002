"use server";

import prisma from "../../lib/prisma";
import { bookSchema, type BookFormValues } from "../../lib/validation/book-schema";
import { revalidatePath } from "next/cache";

export async function createBook(data: BookFormValues) {
  const result = bookSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation error:", result.error.format());
    return { success: false, error: "Invalid form data" };
  }

  try {
    // Generate unique identification code and book SKU if not provided
    // These are required and unique in the database schema
    const unique_code = `BOOK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const sku = `SKU-${result.data.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const book = await (prisma as any).books.create({
      data: {
        ...result.data,
        unique_identification_code: unique_code,
        book_sku: sku,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin_dashboard/books");
    return { success: true, data: book };
  } catch (error: any) {
    console.error("Failed to create book in database:", error);
    return { 
      success: false, 
      error: error?.message || "Failed to save book to database" 
    };
  }
}

export async function updateBook(id: string, data: Partial<BookFormValues>) {
  try {
    const book = await (prisma as any).books.update({
      where: { unique_identification_code: id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/admin_dashboard/books/${id}`);
    revalidatePath("/admin_dashboard/books");
    return { success: true, data: book };
  } catch (error) {
    console.error("Failed to update book:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function deleteBook(id: string) {
  try {
    await (prisma as any).books.update({
      where: { unique_identification_code: id },
      data: { 
        is_deleted: true, 
        deletedAt: new Date(),
        updatedAt: new Date()
      },
    });

    revalidatePath("/admin_dashboard/books");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}
