"use server";

import prisma from "../../lib/prisma";

export async function getBooks() {
  try {
    const books = await prisma.books.findMany({
      where: {
        is_deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: books };
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return { success: false, error: "Failed to fetch books" };
  }
}
