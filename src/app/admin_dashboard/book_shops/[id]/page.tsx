import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ShopProfileContent from "./ShopProfileContent";

export default async function ShopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await (prisma as any).bookshopes.findUnique({
    where: { id: Number(id) },
    include: {
      bookshopeditions: {
        where: { is_deleted: false },
        include: {
          bookedition: {
            include: {
              books: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      orders: {
        where: { is_deleted: false },
        include: {
          order_items: {
            include: {
              bookedition: {
                include: {
                  books: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!shop || shop.is_deleted) {
    return notFound();
  }

  return <ShopProfileContent shop={shop} />;
}
