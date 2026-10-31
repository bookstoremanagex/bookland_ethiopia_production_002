"use server";

import prisma from "../../lib/prisma";

interface GetBooksOptions {
  /**
   * Only consider editions that are still in production (`ON_PRODUCTION`).
   * Used by the admin Books page: editions that already moved on (translation,
   * design, printing, pre-printing, ready) are not counted, and books left with
   * no in-production edition are omitted from the result entirely.
   */
  inProductionOnly?: boolean;
}

export async function getBooks(options: GetBooksOptions = {}) {
  try {
    const books = await prisma.books.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        bookedition: {
          where: options.inProductionOnly
            ? { is_deleted: false, productionstatus: "ON_PRODUCTION" }
            : { is_deleted: false },
          select: { id: true },
        },
      },
      orderBy: [
        { book_sort_index: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" },
      ],
    });

    const data = books
      .map(({ bookedition, ...rest }) => ({
        ...rest,
        editionCount: bookedition.length,
      }))
      // Books with nothing left in production have no row to show.
      .filter((book) => !options.inProductionOnly || book.editionCount > 0);

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return { success: false, error: "Failed to fetch books" };
  }
}
