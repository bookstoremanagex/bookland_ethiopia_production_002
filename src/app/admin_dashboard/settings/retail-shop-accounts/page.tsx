import { getRetailUsers } from "@/app/actions/retail-user-actions";
import { RetailShopAccountsClient } from "./RetailShopAccountsClient";

export const dynamic = "force-dynamic";

export default async function RetailShopAccountsPage() {
  const res = await getRetailUsers();
  const users = res.success ? res.data : [];

  return (
    <RetailShopAccountsClient initialUsers={users} />
  );
}
