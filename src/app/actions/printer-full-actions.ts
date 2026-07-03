"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "./auth-actions";

export async function getPrinterForSessionFull() {
  const session = await getCurrentSession();
  if (!session?.email) return null;

  const printer = await (prisma as any).printer.findFirst({
    where: {
      email: session.email,
      is_deleted: false,
    },
    include: {
      printorder: {
        include: {
          printorder_items: {
            include: {
              bookedition: {
                include: { books: true },
              },
            },
          },
          printorder_payments: true,
        },
      },
      bookeditionprinters: {
        where: { is_deleted: false },
        include: {
          bookedition: {
            include: { books: true },
          },
        },
      },
    },
  });

  return printer ? JSON.parse(JSON.stringify(printer)) : null;
}
