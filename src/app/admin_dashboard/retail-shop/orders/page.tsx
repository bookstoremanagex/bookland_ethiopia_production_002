import { getRetailOrdersGrouped } from "@/app/actions/retail-actions";
import { RetailOrdersTable } from "./RetailOrdersTable";

export const dynamic = "force-dynamic";

export default async function RetailOrdersPage() {
  const result = await getRetailOrdersGrouped();

  return (
    <RetailOrdersTable
      groups={result.success ? result.data : []}
    />
  );
}
