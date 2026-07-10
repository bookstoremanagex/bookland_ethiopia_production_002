"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { updateCustomer } from "@/app/actions/retail-customer-actions";
import { toast } from "sonner";

const CUSTOMER_TYPES = ["INDIVIDUAL", "DISTRIBUTOR", "BOOKSHOP"];

interface CustomerData {
  id: number;
  name: string | null;
  email: string | null;
  phonenumber: string | null;
  customerType: string | null;
}

export function EditCustomerClient({ customer }: { customer: CustomerData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: customer.name ?? "",
    email: customer.email ?? "",
    phonenumber: customer.phonenumber ?? "",
    customerType: customer.customerType ?? "INDIVIDUAL",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await updateCustomer(customer.id, {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phonenumber: form.phonenumber.trim() || undefined,
        customerType: form.customerType,
      });
      if (res.success) {
        toast.success("Customer updated");
        router.push("/retail_shop_dashboard/customers");
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to update customer");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/retail_shop_dashboard/customers"
          className="inline-flex items-center text-sm font-bold text-primarycolor hover:text-primarycolor/80 transition-colors mb-2"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Customers
        </Link>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          Edit Customer
        </h1>
        <p className="text-sm font-semibold text-slate-400 mt-1">{customer.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden p-6 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Customer name"
                className="w-full h-12 pl-4 pr-4 rounded-xl bg-gray-50 border border-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                className="w-full h-12 pl-4 pr-4 rounded-xl bg-gray-50 border border-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-2">Phone Number</label>
              <input
                name="phonenumber"
                type="tel"
                value={form.phonenumber}
                onChange={handleChange}
                placeholder="+251 9XX XXX XXX"
                className="w-full h-12 pl-4 pr-4 rounded-xl bg-gray-50 border border-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-2">
                Customer Type <span className="text-red-400">*</span>
              </label>
              <select
                name="customerType"
                value={form.customerType}
                onChange={handleChange}
                className="w-full h-12 pl-4 pr-4 rounded-xl bg-gray-50 border border-transparent text-sm font-medium text-gray-700 outline-none focus:border-primarycolor/50 focus:bg-white focus:ring-2 focus:ring-primarycolor/10 transition-all appearance-none"
              >
                {CUSTOMER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/retail_shop_dashboard/customers"
            className="h-12 px-8 rounded-xl font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all inline-flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 px-8 rounded-xl bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primarycolor/20 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="size-4" />
                Update Customer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
