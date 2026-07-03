import { getCustomerById } from "@/app/actions/retail-customer-actions";
import { EditCustomerClient } from "./EditCustomerClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getCustomerById(Number(id));
  if (!res.success || !res.data) notFound();

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <EditCustomerClient customer={res.data} />
      </div>
    </div>
  );
}
