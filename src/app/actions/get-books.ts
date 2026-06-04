"use server";

import prisma from "../../lib/prisma";

export async function getBooks() {
  try {
    const books = await prisma.books.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        bookedition: {
          where: { is_deleted: false },
          select: { id: true },
        },
      },
      orderBy: [
        { book_sort_index: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" },
      ],
    });

    const data = books.map(({ bookedition, ...rest }) => ({
      ...rest,
      editionCount: bookedition.length,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return { success: false, error: "Failed to fetch books" };
  }
}
