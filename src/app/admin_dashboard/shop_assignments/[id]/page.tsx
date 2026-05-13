import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AssignmentDetailsContent from "./AssignmentDetailsContent";

export default async function ShopAssignmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assignment = await (prisma as any).bookshopeditions.findUnique({
    where: { id: Number(id) },
    include: {
      bookshopes: true,
      bookedition: {
        include: {
          books: true
        }
      }
    }
  });

  if (!assignment || assignment.is_deleted) {
    return notFound();
  }

  return <AssignmentDetailsContent assignment={assignment} />;
}
