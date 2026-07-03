"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Pencil, Trash2, UserRound } from "lucide-react";
import { deleteCustomer } from "@/app/actions/retail-customer-actions";
import { toast } from "sonner";

interface CustomerData {
  id: number;
  name: string | null;
  email: string | null;
  customerType: string | null;
  created_at: string;
}

export function CustomersClient({ customers }: { customers: CustomerData[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (c.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (c.customerType ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [customers, search]
  );

  const handleDelete = async (id: number, name: string | null) => {
    if (!confirm(`Delete customer "${name ?? "Unknown"}"?`)) return;
    const res = await deleteCustomer(id);
    if (res.success) {
      toast.success("Customer deleted");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
          placeholder="Search by name, email, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <UserRound className="size-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">
            {search ? "No customers match your search" : "No customers yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((customer) => {
            const badgeColor =
              customer.customerType === "DISTRIBUTOR"
                ? "bg-blue-100 text-blue-700"
                : customer.customerType === "BOOKSHOP"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-amber-100 text-amber-700";

            return (
              <div
                key={customer.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() =>
                      router.push(`/retail_shop_dashboard/customers/${customer.id}`)
                    }
                  >
                    <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center shrink-0">
                      <User className="size-5 text-primarycolor" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight truncate">
                        {customer.name ?? "Unnamed"}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">
                        {customer.email ?? "—"}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeColor}`}
                        >
                          {customer.customerType ?? "INDIVIDUAL"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/retail_shop_dashboard/customers/${customer.id}/edit`
                        )
                      }
                      className="size-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center"
                      title="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.name)}
                      className="size-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-all flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
