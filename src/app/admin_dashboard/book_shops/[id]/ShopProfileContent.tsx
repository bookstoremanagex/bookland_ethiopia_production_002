"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Store,
  ArrowLeft,
  Save,
  Trash2,
  Package,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  Banknote,
  ShoppingBag,
  Plus,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  updateBookShop,
  deleteBookShop,
} from "@/app/actions/book-shop-actions";
import { useRouter, usePathname } from "next/navigation";
import { ShopAssignmentsTable } from "@/components/admin_dashboard_components/ShopAssignmentsTable";
import { OrdersTable } from "./OrdersTable";
import AddOrderModal from "./AddOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";

interface ShopProfileContentProps {
  shop: any;
}

export default function ShopProfileContent({
  shop: initialShop,
}: ShopProfileContentProps) {
  const [shop, setShop] = useState(initialShop);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    setShop(initialShop);
  }, [initialShop]);

  const pathname = usePathname();
  const dashboardRoot = pathname.split("/").slice(0, 2).join("/");
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: initialShop.name,
    location: initialShop.location,
    branch: initialShop.branch || "",
    phone: initialShop.phone || "",
    email: initialShop.email || "",
  });
  const router = useRouter();

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const res = await updateBookShop(shop.id, formData);
      if (res.success) {
        toast.success("Shop updated successfully");
        setShop(res.data);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this shop? This cannot be undone.",
      )
    )
      return;

    try {
      const res = await deleteBookShop(shop.id);
      if (res.success) {
        toast.success("Shop deleted");
        router.push(`${dashboardRoot}/book_shops`);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-8 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href={`${dashboardRoot}/book_shops`}>
          <Button
            variant="ghost"
            className="rounded-2xl gap-3 font-bold text-muted-foreground hover:text-primarycolor p-0 md:p-4 h-auto md:h-10"
          >
            <ArrowLeft className="size-4 md:size-5" />{" "}
            <span className="text-sm md:text-base">Back to Shops</span>
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="rounded-xl h-10 md:h-12 md:w-12 px-4 md:px-0 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            <Trash2 className="size-4 md:size-5" />
            <span className="md:hidden text-[9px] font-black uppercase tracking-widest">
              Delete Shop
            </span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="rounded-xl md:rounded-2xl bg-primarycolor h-10 md:h-12 px-4 md:px-8 font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl shadow-primarycolor/20 gap-2 md:gap-3 flex items-center justify-center"
          >
            <Save className="size-4 md:size-5" />{" "}
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white rounded-[1.8rem] md:rounded-[3rem] p-6 md:p-10 border-2 border-primarycolor/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-primarycolor/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            <div className="relative space-y-8 md:space-y-10">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="size-14 md:size-20 rounded-2xl md:rounded-[2rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor shadow-xl border-4 border-white shrink-0">
                  <Building2 className="size-7 md:size-10" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-primarycolor uppercase tracking-tighter italic">
                    Shop{" "}
                    <span className="text-secondarycolor not-italic">
                      Identity
                    </span>
                  </h1>
                  <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Update partner information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">
                    Shop Name
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 size-4 md:size-5 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-14 md:h-16 pl-14 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-base md:text-lg"
                      placeholder="Enter shop name..."
                    />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">
                    Branch / Tag
                  </label>
                  <div className="relative group">
                    <Store className="absolute left-5 top-1/2 -translate-y-1/2 size-4 md:size-5 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input
                      value={formData.branch}
                      onChange={(e) =>
                        setFormData({ ...formData, branch: e.target.value })
                      }
                      className="h-14 md:h-16 pl-14 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-base md:text-lg"
                      placeholder="Main, Downtown, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3 md:col-span-2">
                  <label className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">
                    Location / Address
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 size-4 md:size-5 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="h-14 md:h-16 pl-14 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-base md:text-lg"
                      placeholder="Street address, city, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">
                    Contact Phone
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 size-4 md:size-5 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-14 md:h-16 pl-14 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-base md:text-lg"
                      placeholder="+251..."
                    />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-4 md:size-5 text-slate-400 group-focus-within:text-primarycolor transition-colors" />
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-14 md:h-16 pl-14 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-primarycolor font-bold text-base md:text-lg"
                      placeholder="contact@shop.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-6 md:space-y-8">
          <div className="bg-primarycolor rounded-[1.8rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl shadow-primarycolor/30 space-y-8 md:space-y-10 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 size-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-2xl" />

            <div className="space-y-1 md:space-y-2 relative">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">
                Account Maturity
              </p>
              <h3 className="text-lg md:text-xl font-bold">
                Partner since {new Date(shop.createdAt).toLocaleDateString()}
              </h3>
            </div>

            <div className="space-y-5 md:space-y-6 relative">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="size-5 md:size-6" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">
                    Total Distributed
                  </p>
                  <p className="text-xl md:text-2xl font-black mt-1">
                    {(shop.orders || [])
                      .reduce(
                        (acc: any, order: any) =>
                          acc + (order.total_amount || 0),
                        0,
                      )
                      .toLocaleString()}{" "}
                    <span className="text-[10px] opacity-60">ETB</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Package className="size-5 md:size-6" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">
                    Global Units
                  </p>
                  <p className="text-xl md:text-2xl font-black mt-1">
                    {(shop.orders || [])
                      .reduce(
                        (acc: any, order: any) =>
                          acc +
                          (order.order_items || []).reduce(
                            (sum: number, item: any) =>
                              sum + (item.quantity || 0),
                            0,
                          ),
                        0,
                      )
                      .toLocaleString()}{" "}
                    <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest ml-1">
                      Units
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-200 shrink-0">
                  <Banknote className="size-5 md:size-6" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">
                    Unpaid Amount
                  </p>
                  <p className="text-xl md:text-2xl font-black mt-1 text-rose-100">
                    {(shop.orders || [])
                      .reduce(
                        (acc: any, order: any) =>
                          acc +
                          ((order.total_amount || 0) -
                            (order.amount_paid || 0)),
                        0,
                      )
                      .toLocaleString()}{" "}
                    <span className="text-[10px] opacity-60">ETB</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.8rem] md:rounded-[3rem] p-8 md:p-10 border-2 border-primarycolor/5 shadow-xl space-y-4 md:space-y-6">
            <h4 className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
              Management Info
            </h4>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between py-2 md:py-3 border-b border-slate-50">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40">
                  Shop ID
                </span>
                <span className="font-black text-primarycolor text-sm md:text-base">
                  #{shop.id}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 md:py-3 border-b border-slate-50">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40">
                  Last Activity
                </span>
                <span className="font-black text-primarycolor text-sm md:text-base">
                  {new Date(shop.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table - Full Width */}
      <div className="bg-white rounded-[1.8rem] md:rounded-[3rem] p-6 md:p-10 border-2 border-primarycolor/5 shadow-xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4 text-primarycolor">
            <ShoppingBag className="size-6 md:size-7" />
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">
              Shop{" "}
              <span className="text-secondarycolor not-italic">Orders</span>
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsAddOrderOpen(true)}
              className="bg-primarycolor hover:bg-secondarycolor text-white rounded-xl md:rounded-2xl h-10 md:h-12 px-4 md:px-6 font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl shadow-primarycolor/20 gap-2 flex items-center justify-center"
            >
              <Plus className="size-4 md:size-5" /> Add Order
            </Button>
            <span className="self-start md:self-auto px-4 py-1.5 rounded-full bg-slate-100 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {(shop.orders || []).length} Orders
            </span>
          </div>
        </div>

        <div className="w-full">
          <OrdersTable
            data={shop.orders || []}
            onViewDetails={(order) => {
              setSelectedOrder(order);
              setIsDetailsOpen(true);
            }}
          />
        </div>
      </div>

      {/* Active Assignments Table - Full Width */}
      <div className="bg-white rounded-[1.8rem] md:rounded-[3rem] p-6 md:p-10 border-2 border-primarycolor/5 shadow-xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4 text-primarycolor">
            <Package className="size-6 md:size-7" />
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">
              Active{" "}
              <span className="text-secondarycolor not-italic">
                Assignments
              </span>
            </h3>
          </div>
          <span className="self-start md:self-auto px-4 py-1 rounded-full bg-slate-100 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {(shop.bookshopeditions || []).length} Distributions
          </span>
        </div>

        <div className="w-full">
          {(shop.bookshopeditions || []).length > 0 ? (
            <ShopAssignmentsTable data={shop.bookshopeditions || []} />
          ) : (
            <div className="text-center py-16 md:py-20 bg-slate-50/50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-slate-100">
              <AlertCircle className="size-8 md:size-10 text-slate-200 mx-auto mb-4" />
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No books currently assigned
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => {
          setIsAddOrderOpen(false);
          router.refresh();
        }}
        shopId={shop.id}
        shopName={shop.name}
      />

      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        order={selectedOrder}
        shop={shop}
      />
    </div>
  );
}
