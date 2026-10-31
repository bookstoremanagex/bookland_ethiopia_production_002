"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../lib/prisma";
import type { books_productionstatus } from "../../generated/prisma";

const PRODUCTION_STATUSES: books_productionstatus[] = [
  "ON_PRODUCTION",
  "TRANSLATION",
  "DESIGN",
  "PRINTING",
  "PREPRINTING",
  "READY",
];

export type EditionStock = {
  /** Copies in the central warehouse (left to transfer). */
  central: number;
  /** Copies distributed to stores. */
  stores: number;
  /** Copies still held by printers. */
  printers: number;
  total: number;
};

export type BookEditionRow = {
  id: number;
  edition_name: string;
  /** Production status of this edition (not the book). */
  status: string | null;
  createdAt: string;
  stock: EditionStock;
};

export type BookFollowUpRow = {
  id: number;
  title: string;
  short_name: string | null;
  author: string;
  createdAt: string;
  /** Newest non-deleted edition; its status drives the table row. */
  latestEdition: BookEditionRow | null;
  /** Every non-deleted edition, newest first (for the details modal). */
  editions: BookEditionRow[];
  /** Newest non-deleted translation project for this book, if any. */
  translationProject: {
    id: number;
    status: string;
  } | null;
};

const sumQuantity = (
  rows: { quantity: number | null }[] | undefined | null
): number => (rows ?? []).reduce((total, row) => total + (row.quantity ?? 0), 0);

/**
 * Every non-deleted book with all of its non-deleted editions, newest first.
 * Production status lives on the edition, so the follow-up table shows the
 * latest edition's status. Sorting/filtering/searching happen on the client
 * because the follow-up table has no pagination.
 */
export async function getBooksForFollowUp(): Promise<{
  success: boolean;
  data?: BookFollowUpRow[];
  error?: string;
}> {
  try {
    const books = await prisma.books.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        title: true,
        short_name: true,
        author: true,
        createdAt: true,
        bookedition: {
          where: { is_deleted: false },
          select: {
            id: true,
            edition_name: true,
            productionstatus: true,
            createdAt: true,
            count_remening_for_transfer: true,
            bookeditionstores: {
              where: { is_deleted: false },
              select: { quantity: true },
            },
            bookeditionprinters: {
              where: { is_deleted: false },
              select: { quantity: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        translatorbook: {
          where: { is_deleted: false },
          select: {
            id: true,
            Status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { title: "asc" },
    });

    const data: BookFollowUpRow[] = books.map((book) => {
      const editions: BookEditionRow[] = book.bookedition.map((edition) => {
        const central = edition.count_remening_for_transfer ?? 0;
        const stores = sumQuantity(edition.bookeditionstores);
        const printers = sumQuantity(edition.bookeditionprinters);

        return {
          id: edition.id,
          edition_name: edition.edition_name ?? "",
          status: edition.productionstatus ?? null,
          createdAt: edition.createdAt.toISOString(),
          stock: {
            central,
            stores,
            printers,
            total: central + stores + printers,
          },
        };
      });

      const project = book.translatorbook[0] ?? null;

      return {
        id: book.id,
        title: book.title ?? "",
        short_name: book.short_name ?? null,
        author: book.author ?? "",
        createdAt: book.createdAt.toISOString(),
        latestEdition: editions[0] ?? null,
        editions,
        translationProject: project
          ? { id: project.id, status: project.Status ?? "" }
          : null,
      };
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch books for follow up:", error);
    return { success: false, error: "Failed to fetch books for follow up" };
  }
}

/** Change the production status of a single edition. */
export async function updateEditionStatus(editionId: number, status: string) {
  if (!PRODUCTION_STATUSES.includes(status as books_productionstatus)) {
    return { success: false, error: "Invalid production status" };
  }

  try {
    const edition = await prisma.bookedition.update({
      where: { id: editionId },
      data: {
        productionstatus: status as books_productionstatus,
        updatedAt: new Date(),
      },
      select: { id: true, productionstatus: true },
    });

    revalidatePath("/admin_dashboard/books/follow-up");
    revalidatePath("/admin_dashboard/books");
    return { success: true, data: edition };
  } catch (error) {
    console.error("Failed to update edition status:", error);
    return { success: false, error: "Failed to update edition status" };
  }
}
