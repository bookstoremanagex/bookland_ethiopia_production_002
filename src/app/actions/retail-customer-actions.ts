"use server";

import retailPrisma from "@/lib/retail-prisma";

export async function getCustomers() {
  try {
    const customers = await retailPrisma.$queryRawUnsafe<any[]>(
      "SELECT * FROM customers WHERE is_deleted = 0 ORDER BY created_at DESC"
    );
    return { success: true, data: JSON.parse(JSON.stringify(customers)) };
  } catch (error) {
    console.error("getCustomers error:", error);
    return { success: false, error: "Failed to fetch customers" };
  }
}

export async function createCustomer(data: {
  name: string;
  email?: string;
  phonenumber?: string;
  customerType: string;
}) {
  try {
    const customer = await retailPrisma.customers.create({
      data: {
        name: data.name,
        email: data.email ?? null,
        phonenumber: data.phonenumber ?? null,
        customerType: data.customerType,
      },
    });
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    console.error("createCustomer error:", error);
    return { success: false, error: "Failed to create customer" };
  }
}

export async function updateCustomer(
  id: number,
  data: { name: string; email?: string; phonenumber?: string; customerType: string }
) {
  try {
    const customer = await retailPrisma.customers.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email ?? null,
        phonenumber: data.phonenumber ?? null,
        customerType: data.customerType,
      },
    });
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    console.error("updateCustomer error:", error);
    return { success: false, error: "Failed to update customer" };
  }
}

export async function deleteCustomer(id: number) {
  try {
    await retailPrisma.$queryRawUnsafe(
      "UPDATE customers SET is_deleted = 1, deleted_at = NOW() WHERE id = ?",
      id
    );
    return { success: true };
  } catch (error) {
    console.error("deleteCustomer error:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}

export async function getCustomerById(id: number) {
  try {
    const customers = await retailPrisma.$queryRawUnsafe<any[]>(
      "SELECT * FROM customers WHERE id = ? AND is_deleted = 0",
      id
    );
    if (!customers || customers.length === 0) return { success: false, error: "Customer not found" };
    const customer = customers[0];

    // Fetch orders with nested book structure matching the expected interface
    const orders = await retailPrisma.$queryRawUnsafe<any[]>(
      `SELECT ro.id, ro.quantity, ro.total_price, ro.created_at,
              rbe.edition_name, rbe.price,
              rb.title AS book_title, rb.author AS book_author
       FROM retail_orders ro
       LEFT JOIN reatil_book_editions rbe ON ro.book_edition_id = rbe.id
       LEFT JOIN retail_books rb ON rbe.book_id = rb.id
       WHERE ro.customerId = ? AND ro.is_deleted = 0
       ORDER BY ro.created_at DESC`,
      id
    );

    // Reshape to match the expected nested structure
    const shapedOrders = orders.map((o) => ({
      id: o.id,
      quantity: o.quantity,
      total_price: o.total_price,
      created_at: o.created_at,
      book: {
        edition_name: o.edition_name,
        price: o.price,
        books: o.book_title ? { title: o.book_title, author: o.book_author } : null,
      },
    }));

    return { success: true, data: JSON.parse(JSON.stringify({ ...customer, orders: shapedOrders })) };
  } catch (error) {
    console.error("getCustomerById error:", error);
    return { success: false, error: "Failed to fetch customer" };
  }
}
