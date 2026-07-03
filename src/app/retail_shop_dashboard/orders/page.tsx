import { ShoppingCart } from "lucide-react";
import { getRetailBooks } from "../../actions/retail-actions";
import { getCustomers } from "../../actions/retail-customer-actions";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function RetailOrdersPage() {
  const [booksRes, customersRes] = await Promise.all([
    getRetailBooks(),
    getCustomers(),
  ]);
  const books = booksRes.success ? booksRes.data : [];
  const customers = customersRes.success ? customersRes.data : [];

  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            New Order
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Create a retail sale
          </p>
        </div>

        <OrdersClient books={books} customers={customers} />
      </div>
    </div>
  );
}
