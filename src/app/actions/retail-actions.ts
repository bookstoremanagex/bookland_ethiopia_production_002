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
  phoneNumber?: string;
}) {
  try {
    const order = await retailPrisma.retail_orders.create({
      data: {
        book_edition_id: data.book_edition_id,
        quantity: data.quantity,
        total_price: data.total_price ?? 0,
        customerId: data.customerId ?? null,
        phoneNumber: data.phoneNumber ?? null,
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

export async function getRetailOrdersGrouped() {
  try {
    const orders = await retailPrisma.retail_orders.findMany({
      include: {
        book: {
          include: { books: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Group orders by phone number + same-minute timestamp for individual orders
    const groups: Record<string, {
      phone: string | null;
      customerId: number | null;
      customerName: string | null;
      customerType: string | null;
      orders: typeof orders;
      totalAmount: number;
      totalQuantity: number;
      createdAt: Date;
    }> = {};

    // Fetch customers separately for known customers
    const customerIds = [...new Set(orders.map(o => o.customerId).filter(Boolean))] as number[];
    const customersMap: Record<number, { name: string | null; customerType: string | null; phonenumber: string | null }> = {};
    if (customerIds.length > 0) {
      const customers = await retailPrisma.customers.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true, customerType: true, phonenumber: true },
      });
      for (const c of customers) {
        customersMap[c.id] = c;
      }
    }

    for (const order of orders) {
      const phone = order.phoneNumber || null;
      const custId = order.customerId;
      const isIndividual = !custId && phone;

      let groupKey: string;
      if (isIndividual && phone) {
        // Group by phone + same minute
        const ts = new Date(order.created_at);
        const minuteKey = `${ts.getFullYear()}-${ts.getMonth()}-${ts.getDate()}-${ts.getHours()}-${ts.getMinutes()}`;
        groupKey = `phone:${phone}:${minuteKey}`;
      } else if (custId) {
        // Group known customers separately per order (no grouping)
        groupKey = `order:${order.id}`;
      } else {
        groupKey = `order:${order.id}`;
      }

      if (!groups[groupKey]) {
        const cust = custId ? customersMap[custId] : null;
        groups[groupKey] = {
          phone,
          customerId: custId,
          customerName: cust?.name ?? null,
          customerType: cust?.customerType ?? null,
          orders: [],
          totalAmount: 0,
          totalQuantity: 0,
          createdAt: order.created_at,
        };
      }
      groups[groupKey].orders.push(order);
      groups[groupKey].totalAmount += order.total_price ?? 0;
      groups[groupKey].totalQuantity += order.quantity ?? 0;
    }

    // Convert to array and sort by most recent
    const grouped = Object.values(groups).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { success: true, data: JSON.parse(JSON.stringify(grouped)) };
  } catch (error) {
    console.error("getRetailOrdersGrouped error:", error);
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
  ourbook?: boolean;
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
        ourbook: data.ourbook ?? false,
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

export async function getRetailEligibleBooksWithEditions(search?: string) {
  try {
    const { default: prisma } = await import("@/lib/prisma");

    const where: any = {
      is_deleted: false,
      available_for_retail: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
      ];
    }

    const books = await prisma.books.findMany({
      where,
      include: {
        bookedition: {
          where: { is_deleted: false },
          select: {
            id: true,
            edition_name: true,
            selling_price: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { title: "asc" },
      take: 50,
    });

    return { success: true, data: JSON.parse(JSON.stringify(books)) };
  } catch (error) {
    console.error("getRetailEligibleBooksWithEditions error:", error);
    return { success: false, error: "Failed to fetch books" };
  }
}

export async function importBookToRetail(data: {
  mainBookId: number;
  mainEditionId: number;
  editionName: string;
  price: number;
}) {
  try {
    const { default: prisma } = await import("@/lib/prisma");

    const mainBook = await prisma.books.findUnique({
      where: { id: data.mainBookId },
    });

    if (!mainBook) {
      return { success: false, error: "Book not found in main database" };
    }

    // Check if this book already exists in retail
    const existingRetailBook = await retailPrisma.retail_books.findFirst({
      where: {
        book_id: data.mainBookId,
        is_deleted: false,
      },
    });

    let retailBookId: number;

    if (existingRetailBook) {
      retailBookId = existingRetailBook.id;
    } else {
      const now = new Date();
      const newRetailBook = await retailPrisma.retail_books.create({
        data: {
          book_id: data.mainBookId,
          title: mainBook.title,
          author: mainBook.author || "",
          language: mainBook.language || "",
          category: mainBook.category || "",
          publication_year: mainBook.publication_year || null,
          book_image_url: mainBook.book_image_url || null,
          pen_name: mainBook.pen_name || null,
          ourbook: true,
          updatedAt: now,
          createdAt: now,
          deletedAt: now,
        },
      });
      retailBookId = newRetailBook.id;
    }

    // Check if this edition already exists in retail
    const existingEdition = await retailPrisma.reatil_book_editions.findFirst({
      where: {
        book_id: retailBookId,
        edition_name: data.editionName,
      },
    });

    if (existingEdition) {
      return { success: false, error: "This edition already exists in retail" };
    }

    const edition = await retailPrisma.reatil_book_editions.create({
      data: {
        edition_name: data.editionName,
        book_id: retailBookId,
        price: data.price,
      },
    });

    return { success: true, data: JSON.parse(JSON.stringify({ retailBookId, edition })) };
  } catch (error) {
    console.error("importBookToRetail error:", error);
    return { success: false, error: "Failed to import book" };
  }
}

export async function getRetailBookById(id: number) {
  try {
    const book = await retailPrisma.retail_books.findUnique({
      where: { id, is_deleted: false },
      include: {
        bookEditions: true,
      },
    });
    if (!book) return { success: false, error: "Book not found" };
    return { success: true, data: JSON.parse(JSON.stringify(book)) };
  } catch (error) {
    console.error("getRetailBookById error:", error);
    return { success: false, error: "Failed to fetch book" };
  }
}

export async function updateRetailBook(id: number, data: {
  title?: string;
  author?: string;
  language?: string;
  category?: string;
  publication_year?: string;
  book_image_url?: string;
}) {
  try {
    const book = await retailPrisma.retail_books.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    return { success: true, data: JSON.parse(JSON.stringify(book)) };
  } catch (error) {
    console.error("updateRetailBook error:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function updateRetailEdition(id: number, data: {
  edition_name?: string;
  price?: number;
}) {
  try {
    const edition = await retailPrisma.reatil_book_editions.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    return { success: true, data: JSON.parse(JSON.stringify(edition)) };
  } catch (error) {
    console.error("updateRetailEdition error:", error);
    return { success: false, error: "Failed to update edition" };
  }
}

export async function deleteRetailEdition(id: number) {
  try {
    await retailPrisma.reatil_book_editions.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("deleteRetailEdition error:", error);
    return { success: false, error: "Failed to delete edition" };
  }
}

export async function deleteRetailBook(id: number) {
  try {
    await retailPrisma.retail_books.update({
      where: { id },
      data: { is_deleted: true, deleted_at: new Date() },
    });
    return { success: true };
  } catch (error) {
    console.error("deleteRetailBook error:", error);
    return { success: false, error: "Failed to delete book" };
  }
}

export async function addRetailEditionDirect(data: {
  book_id: number;
  edition_name: string;
  price?: number;
}) {
  try {
    const edition = await retailPrisma.reatil_book_editions.create({
      data: {
        edition_name: data.edition_name,
        book_id: data.book_id,
        price: data.price ?? 0,
      },
    });
    return { success: true, data: JSON.parse(JSON.stringify(edition)) };
  } catch (error) {
    console.error("addRetailEditionDirect error:", error);
    return { success: false, error: "Failed to add edition" };
  }
}
