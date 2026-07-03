"use server";

import retailPrisma from "@/lib/retail-prisma";

export async function getRetailBooks() {
  try {
    const books = await retailPrisma.retail_books.findMany({
      where: { is_deleted: false },
      include: {
        bookEditions: true,
        _count: { select: { bookEditions: true } },
      },
      orderBy: { created_at: "desc" },
    });
    return { success: true, data: JSON.parse(JSON.stringify(books)) };
  } catch (error) {
    console.error("getRetailBooks error:", error);
    return { success: false, error: "Failed to fetch books" };
  }
}

export async function getRetailOrders(status?: string) {
  try {
    const where: any = {};
    if (status) where.status = status;

    const orders = await retailPrisma.retail_orders.findMany({
      where,
      include: {
        book: {
          include: { books: true },
        },
        customer: true,
      },
      orderBy: { created_at: "desc" },
    });
    return { success: true, data: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error("getRetailOrders error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function createRetailOrder(data: {
  book_edition_id: number;
  quantity: number;
  total_price?: number;
  customerId?: number | null;
}) {
  try {
    const order = await retailPrisma.retail_orders.create({
      data: {
        book_edition_id: data.book_edition_id,
        quantity: data.quantity,
        total_price: data.total_price ?? 0,
        customerId: data.customerId ?? null,
      },
    });
    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("createRetailOrder error:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getRetailOrdersWithCustomers() {
  try {
    const orders = await retailPrisma.retail_orders.findMany({
      include: {
        book: {
          include: { books: true },
        },
        customer: true,
      },
      orderBy: { created_at: "desc" },
    });
    return { success: true, data: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error("getRetailOrdersWithCustomers error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function createRetailBook(data: {
  title: string;
  author: string;
  language?: string;
  category?: string;
  publication_year?: string;
  edition_name: string;
  price?: number;
}) {
  try {
    const now = new Date();
    const book = await retailPrisma.retail_books.create({
      data: {
        title: data.title,
        author: data.author,
        language: data.language ?? "",
        category: data.category ?? "",
        publication_year: data.publication_year ?? null,
        ourbook: true,
        updatedAt: now,
        createdAt: now,
        deletedAt: now,
      },
    });

    const edition = await retailPrisma.reatil_book_editions.create({
      data: {
        edition_name: data.edition_name,
        book_id: book.id,
        price: data.price ?? 0,
      },
    });

    return { success: true, data: JSON.parse(JSON.stringify({ book, edition })) };
  } catch (error) {
    console.error("createRetailBook error:", error);
    return { success: false, error: "Failed to create book" };
  }
}

export async function addRetailEdition(data: {
  bookId: number;
  edition_name: string;
  price?: number;
}) {
  try {
    const edition = await retailPrisma.reatil_book_editions.create({
      data: {
        edition_name: data.edition_name,
        book_id: data.bookId,
        price: data.price ?? 0,
      },
    });

    return { success: true, data: JSON.parse(JSON.stringify(edition)) };
  } catch (error) {
    console.error("addRetailEdition error:", error);
    return { success: false, error: "Failed to add edition" };
  }
}

export async function getRetailStats() {
  try {
    const [bookCount, editionCount, orderCount, totalRevenue] =
      await Promise.all([
        retailPrisma.retail_books.count({ where: { is_deleted: false } }),
        retailPrisma.reatil_book_editions.count(),
        retailPrisma.retail_orders.count(),
        retailPrisma.retail_orders.aggregate({
          _sum: { total_price: true },
        }),
      ]);

    return {
      success: true,
      data: {
        bookCount,
        editionCount,
        orderCount,
        totalRevenue: totalRevenue._sum?.total_price ?? 0,
      },
    };
  } catch (error) {
    console.error("getRetailStats error:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}
