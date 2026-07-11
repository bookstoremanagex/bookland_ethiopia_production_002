import { ShoppingCart, BookOpen, Clock, DollarSign } from "lucide-react";
import retailPrisma from "@/lib/retail-prisma";

export const dynamic = "force-dynamic";

async function getRetailShopData() {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalItems,
      recentOrders,
      bookCount,
    ] = await Promise.all([
      retailPrisma.retail_orders.count(),
      retailPrisma.retail_orders.aggregate({ _sum: { total_price: true } }),
      retailPrisma.retail_orders.aggregate({ _sum: { quantity: true } }),
      retailPrisma.retail_orders.findMany({
        take: 20,
        include: {
          book: {
            include: { books: true },
          },
          customer: true,
        },
        orderBy: { created_at: "desc" },
      }),
      retailPrisma.retail_books.count({ where: { is_deleted: false } }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum?.total_price ?? 0,
      totalItems: totalItems._sum?.quantity ?? 0,
      bookCount,
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    };
  } catch (error) {
    console.error("getRetailShopData error:", error);
    return null;
  }
}

export default async function RetailShopOverviewPage() {
  const data = await getRetailShopData();

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-sm font-medium text-center">
        Failed to load retail shop data. Is the database connected?
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
              <ShoppingCart className="size-5 text-primarycolor" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">{data.totalOrders}</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Total Orders
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign className="size-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">
            ETB {(data.totalRevenue ?? 0).toFixed(2)}
          </p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Total Revenue
          </p>
        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen className="size-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">{data.bookCount}</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Books
          </p>
        </div>
        

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShoppingCart className="size-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">{data.totalItems}</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Items Sold
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-black text-sm uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <Clock className="size-4 text-primarycolor" />
          Recent Orders
        </h2>

        {data.recentOrders.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl">
            <ShoppingCart className="size-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-400">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className="size-4 text-primarycolor/60 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {order.book?.books?.title ?? "Unknown"}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 truncate">
                      {order.book?.edition_name ?? "—"}
                      {order.customer && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-primarycolor/5 text-primarycolor text-[10px] font-black">
                          {order.customer.name ?? "Customer"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-black text-primarycolor">
                    ETB {(order.total_price ?? 0).toFixed(2)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    Qty: {order.quantity ?? 0} &middot;{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
