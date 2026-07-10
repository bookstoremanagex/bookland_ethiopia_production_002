import { getRetailBookById } from "@/app/actions/retail-actions";
import { BookDetailClient } from "./BookDetailClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getRetailBookById(Number(id));

  if (!result.success || !result.data) {
    redirect("/retail_shop_dashboard/books");
  }

  return <BookDetailClient book={result.data} />;
}
