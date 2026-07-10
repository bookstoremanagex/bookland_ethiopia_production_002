import { getRetailEligibleBooks } from "@/app/actions/book-actions";
import { OurBooksTable } from "./OurBooksTable";

export const dynamic = "force-dynamic";

export default async function OurBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  const result = await getRetailEligibleBooks(search, page, 20);

  return (
    <OurBooksTable
      data={result.data ?? []}
      totalCount={result.totalCount ?? 0}
      currentPage={result.page ?? 1}
      pageSize={result.pageSize ?? 20}
      search={search}
    />
  );
}
