import prisma from "@/lib/prisma";
import CheckDatesTable from "./CheckDatesTable";

export const dynamic = "force-dynamic";

export default async function CheckDatesPage() {
  const checks = await (prisma as any).checks.findMany({
    where: {
      is_deleted: false,
      status: { notIn: ["CLEARED", "CANCELLED"] },
      expirydate: { not: null },
    },
    orderBy: { expirydate: "asc" },
  });

  return <CheckDatesTable data={checks} />;
}
