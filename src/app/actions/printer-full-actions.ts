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

  if (!printer) return null;

  // Hide editions that are not visible to printers — drop their items and
  // stock entirely, and drop any project whose remaining items are all hidden.
  // Also drop auto-created "Auto-delivery" dummy projects (created by
  // recordPrinterDeliveries / transfers when no real print order existed).
  const isAutoDeliveryOrder = (order: any): boolean => {
    const name = order.project_name || "";
    return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
  };

  const visibleOrders = (printer.printorder || [])
    .filter((o: any) => !isAutoDeliveryOrder(o))
    .map((order: any) => ({
      ...order,
      printorder_items: (order.printorder_items || []).filter(
        (it: any) => it.bookedition?.visiblitiy_to_printer !== false,
      ),
    }))
    .filter((order: any) => order.printorder_items.length > 0);

  const visibleStock = (printer.bookeditionprinters || []).filter(
    (bp: any) => bp.bookedition?.visiblitiy_to_printer !== false,
  );

  return JSON.parse(
    JSON.stringify({
      ...printer,
      printorder: visibleOrders,
      bookeditionprinters: visibleStock,
    }),
  );
}
