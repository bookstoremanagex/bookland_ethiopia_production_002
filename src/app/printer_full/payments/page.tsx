import { getCurrentSession } from "../../actions/auth-actions";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PaymentsClient from "./PaymentsClient";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const session = await getCurrentSession();
  if (!session?.email) return notFound();

  const printer = await (prisma as any).printer.findFirst({
    where: { email: session.email, is_deleted: false },
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
    },
  });

  if (!printer) return notFound();

  // Hide auto-created "Auto-delivery" dummy projects and editions not visible
  // to printers — drop their items and any project whose remaining items are
  // all hidden (so their money is not counted).
  const isAutoDeliveryOrder = (order: any): boolean => {
    const name = order.project_name || "";
    return name.startsWith("Auto-delivery for") || name.startsWith("[Auto Delivery]");
  };

  printer.printorder = (printer.printorder || [])
    .filter((o: any) => !isAutoDeliveryOrder(o))
    .map((order: any) => ({
      ...order,
      printorder_items: (order.printorder_items || []).filter(
        (item: any) => item.bookedition?.visiblitiy_to_printer !== false,
      ),
    }))
    .filter((order: any) => order.printorder_items.length > 0);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <PaymentsClient printer={printer} />
      </div>
    </div>
  );
}
