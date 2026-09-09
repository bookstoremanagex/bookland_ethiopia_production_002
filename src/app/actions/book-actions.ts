"use server";

import prisma from "../../lib/prisma";
import { bookSchema, type BookFormValues } from "../../lib/validation/book-schema";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { checkCurrentUserRole } from "./book-shop-actions";
import { getCurrentSession } from "./auth-actions";

// Helper function to delete Vercel Blob file if URL points to it
async function deleteBlobIfExists(url: string | null | undefined) {
  if (!url) return;
  if (url.includes("public.blob.vercel-storage.com")) {
    try {
      await del(url);
      console.log("Successfully deleted old Vercel Blob cover:", url);
    } catch (error) {
      console.error("Failed to delete Vercel Blob cover:", url, error);
    }
  }
}

// Upload cover image to Vercel Blob
export async function uploadBookImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Convert file to Buffer for server-side upload safety
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Keep file extension and make name unique
    const fileExtension = file.name.split(".").pop();
    const cleanFileName = `book_covers/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    const blob = await put(cleanFileName, buffer, {
      access: "public",
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error("Failed to upload image to Vercel Blob:", error);
    return {
      success: false,
      error: error?.message || "Failed to upload image to Vercel Blob"
    };
  }
}

export async function createBook(data: BookFormValues) {
  const permission = await checkCurrentUserRole("Adding Books");
  if (!permission.enabled) {
    return { success: false, error: "You do not have the privilege to add books." };
  }

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

    const session = await getCurrentSession();
    if (session?.id) {
      await (prisma as any).activityLogs.create({
        data: {
          accountId: session.id,
          action: `Added book "${result.data.title}"`,
          details: JSON.stringify({ title: result.data.title, author: result.data.author, addedBy: session.name }),
          updatedAt: new Date(),
        },
      });
    }

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

export async function getBooksStorePrintData() {
  try {
    // Books currently sitting in stores (any edition with at least 1 unit
    // across its non-deleted store inventory records). For each qualifying
    // book, the EARLIEST edition that has store stock provides the price +
    // cover price shown for the book.
    const books = await prisma.books.findMany({
      where: { is_deleted: false },
      select: {
        title: true,
        short_name: true,
        bookedition: {
          where: { is_deleted: false },
          select: {
            id: true,
            createdAt: true,
            selling_price: true,
            cover_price: true,
            bookeditionstores: {
              where: { is_deleted: false },
              select: { quantity: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [
        { book_sort_index: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" },
      ],
    });

    const data = books
      .map((book: any) => {
        const qualifying = (book.bookedition || []).filter(
          (ed: any) =>
            (ed.bookeditionstores || []).reduce(
              (sum: number, s: any) => sum + (s.quantity || 0),
              0
            ) >= 1
        );
        if (qualifying.length === 0) return null;
        const earliest = qualifying[0];
        return {
          title: book.title as string,
          short_name: (book.short_name ?? null) as string | null,
          price: (earliest.selling_price ?? null) as number | null,
          cover_price: (earliest.cover_price ?? null) as number | null,
        };
      })
      .filter(Boolean);

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch books for store print:", error);
    return { success: false, error: "Failed to fetch books for print" };
  }
}

export async function updateBook(id: string, data: Partial<BookFormValues>) {
  const permission = await checkCurrentUserRole("Editing Books");
  if (!permission.enabled) {
    return { success: false, error: "You do not have the privilege to edit books." };
  }

  try {
    // 1. Fetch current book to get its existing cover URL
    const currentBook = await (prisma as any).books.findUnique({
      where: { unique_identification_code: id },
      select: { book_image_url: true }
    });

    // 2. Perform the update
    const book = await (prisma as any).books.update({
      where: { unique_identification_code: id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // 3. Delete old blob from Vercel Blob only if the caller explicitly provided a
    //    different cover URL. When book_image_url is NOT in `data` (e.g. editing a
    //    single non-image field), the cover must be left untouched — otherwise the
    //    blob is deleted while the DB still points to it and the image breaks.
    if (
      currentBook &&
      currentBook.book_image_url &&
      "book_image_url" in data &&
      data.book_image_url !== currentBook.book_image_url
    ) {
      await deleteBlobIfExists(currentBook.book_image_url);
    }

    revalidatePath(`/admin_dashboard/books/${id}`);
    revalidatePath("/admin_dashboard/books");
    return { success: true, data: book };
  } catch (error) {
    console.error("Failed to update book:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function reorderBooks(items: { id: string; book_sort_index: number }[]) {
  const permission = await checkCurrentUserRole("Editing Books");
  if (!permission.enabled) {
    return { success: false, error: "You do not have the privilege to edit books." };
  }

  try {
    // Single parameterized SQL — safe and instant
    const whens = items.map(() => "WHEN ? THEN ?").join(" ");
    const ins = items.map(() => "?").join(",");
    const params = items.flatMap((item) => [item.id, item.book_sort_index]);
    const ids = items.map((item) => item.id);

    await prisma.$executeRawUnsafe(
      `UPDATE books SET book_sort_index = CASE unique_identification_code ${whens} END WHERE unique_identification_code IN (${ins})`,
      ...params,
      ...ids
    );

    revalidatePath("/admin_dashboard/books");
    revalidatePath("/admin_dashboard/books/shelf");
    items.forEach((item) => revalidatePath(`/admin_dashboard/books/${item.id}`));
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder books:", error);
    return { success: false, error: "Failed to reorder books" };
  }
}

export async function deleteBook(id: string) {
  const permission = await checkCurrentUserRole("Deleting Books");
  if (!permission.enabled) {
    return { success: false, error: "You do not have the privilege to delete books." };
  }

  try {
    // 1. Fetch current book to get its image URL before deleting
    const currentBook = await (prisma as any).books.findUnique({
      where: { unique_identification_code: id },
      select: { book_image_url: true }
    });

    // 2. Soft-delete the book in database
    await (prisma as any).books.update({
      where: { unique_identification_code: id },
      data: {
        is_deleted: true,
        deletedAt: new Date(),
        updatedAt: new Date()
      },
    });

    // 3. Delete the image from Vercel Blob if it exists and is a Vercel Blob URL
    if (currentBook && currentBook.book_image_url) {
      await deleteBlobIfExists(currentBook.book_image_url);
    }

    revalidatePath("/admin_dashboard/books");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}
