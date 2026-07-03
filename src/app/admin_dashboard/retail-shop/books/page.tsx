import retailPrisma from "@/lib/retail-prisma";
import { BooksTable } from "./BooksTable";

export const dynamic = "force-dynamic";

export default async function RetailShopBooksPage() {
  const books = await retailPrisma.retail_books.findMany({
    where: { is_deleted: false },
    include: {
      bookEditions: true,
      _count: { select: { bookEditions: true } },
    },
    orderBy: { created_at: "desc" },
  });

  const data = JSON.parse(JSON.stringify(books));

  return <BooksTable data={data} />;
}
