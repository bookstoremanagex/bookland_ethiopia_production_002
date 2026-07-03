import { Users } from "lucide-react";
import Link from "next/link";
import { getCustomers } from "@/app/actions/retail-customer-actions";
import { CustomersClient } from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const res = await getCustomers();
  const customers = res.success ? res.data : [];

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Customers
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              Manage known customers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/retail_shop_dashboard/customers/add"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Users className="size-3.5" />
              Add Customer
            </Link>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <Users className="size-4" />
              {customers.length} customers
            </div>
          </div>
        </div>

        <CustomersClient customers={customers} />
      </div>
    </div>
  );
}
