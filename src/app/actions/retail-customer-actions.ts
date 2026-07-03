"use server";

import retailPrisma from "@/lib/retail-prisma";

export async function getCustomers() {
  try {
    const customers = await retailPrisma.customers.findMany({
      orderBy: { created_at: "desc" },
    });
    return { success: true, data: JSON.parse(JSON.stringify(customers)) };
  } catch (error) {
    console.error("getCustomers error:", error);
    return { success: false, error: "Failed to fetch customers" };
  }
}

export async function createCustomer(data: {
  name: string;
  email?: string;
  customerType: string;
}) {
  try {
    const customer = await retailPrisma.customers.create({
      data: {
        name: data.name,
        email: data.email ?? null,
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
  data: { name: string; email?: string; customerType: string }
) {
  try {
    const customer = await retailPrisma.customers.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email ?? null,
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
    await retailPrisma.customers.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { success: true };
  } catch (error) {
    console.error("deleteCustomer error:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}

export async function getCustomerById(id: number) {
  try {
    const customer = await retailPrisma.customers.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            book: {
              include: { books: true },
            },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });
    if (!customer) return { success: false, error: "Customer not found" };
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    console.error("getCustomerById error:", error);
    return { success: false, error: "Failed to fetch customer" };
  }
}
