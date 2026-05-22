"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  Banknote,
  Package,
  ShoppingBag,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  shop: any;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  shop,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const remainingBalance = order.total_amount - order.amount_paid;
  const paymentPercentage = order.total_amount > 0 
    ? Math.round((order.amount_paid / order.total_amount) * 100) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-[#F8FAFC] p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="bg-white p-8 pb-6 border-b border-slate-100 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <ShoppingBag className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl md:text-3xl font-black text-primarycolor uppercase italic">
                  Order Details <span className="text-secondarycolor not-italic">#ORD-{order.id}</span>
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  View complete order information and items breakdown
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {order.is_approved ? (
                <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" /> Approved
                </div>
              ) : (
                <div className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Pending Approval
                </div>
              )}
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                order.order_type === "requested" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              )}>
                {order.order_type}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shop Identity Information */}
            <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 size-32 bg-primarycolor/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex items-center gap-3 text-primarycolor relative">
                <Building2 className="size-5" />
                <h4 className="font-black uppercase tracking-widest text-xs italic">Shop Information</h4>
              </div>
              <div className="space-y-4 relative">
                <div>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Shop Name</p>
                  <p className="font-black text-primarycolor text-lg uppercase">{shop.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Branch</p>
                    <p className="font-bold text-slate-700">{shop.branch || "Main Branch"}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Location</p>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{shop.location}</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Phone</p>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="size-3.5 text-slate-400 shrink-0" />
                      <span>{shop.phone || "N/A"}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Email</p>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{shop.email || "N/A"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Meta & Status */}
            <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-primarycolor">
                <Info className="size-5" />
                <h4 className="font-black uppercase tracking-widest text-xs italic">Order Metadata</h4>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Order ID</p>
                    <p className="font-black text-primarycolor">ORD-{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Date Placed</p>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-slate-400 shrink-0" />
                      <span>{format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Approval Status</p>
                  <p className="font-bold text-slate-700">
                    {order.is_approved ? "Approved" : "Pending approval (Automatic false)"}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-50">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><FileText className="size-3" /> Memo / Note</p>
                  <p className="font-medium text-slate-600 italic text-sm mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[50px]">
                    {order.memo ? `"${order.memo}"` : "No internal memo or notes provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white rounded-[2rem] p-8 border-2 border-primarycolor/5 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-primarycolor">
              <Banknote className="size-5" />
              <h4 className="font-black uppercase tracking-widest text-xs italic">Financial Integrity Summary</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Order Value</p>
                <p className="text-3xl font-black text-primarycolor mt-1">
                  {order.total_amount.toLocaleString()} <span className="text-sm">ETB</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Amount Paid Instantly</p>
                <p className="text-3xl font-black text-emerald-800 mt-1">
                  {order.amount_paid.toLocaleString()} <span className="text-sm">ETB</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <p className="text-[9px] font-black text-rose-700 uppercase tracking-widest">Outstanding Debt</p>
                <p className="text-3xl font-black text-rose-800 mt-1">
                  {remainingBalance.toLocaleString()} <span className="text-sm">ETB</span>
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Payment Coverage</span>
                <span>{paymentPercentage}% Covered</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    paymentPercentage >= 100 ? "bg-emerald-500" : "bg-primarycolor"
                  )}
                  style={{ width: `${paymentPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Book Items List */}
          <div className="bg-white rounded-[2rem] p-6 border-2 border-primarycolor/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-primarycolor">
                <Package className="size-5" />
                <h4 className="font-black uppercase tracking-widest text-xs italic">Ordered Book Items</h4>
              </div>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {order.order_items?.length || 0} unique books
              </span>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60">Book Title & Edition</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60 text-center">Quantity</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60 text-right">Unit Price</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primarycolor/60 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item: any, index: number) => (
                    <tr key={item.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors h-16">
                      <td className="p-4">
                        <p className="font-black text-primarycolor uppercase italic leading-tight">
                          {item.bookedition?.books?.title || "Unknown Book"}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                          {item.bookedition?.edition_name || "Unknown Edition"}
                        </p>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-700">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-600">
                        {item.price_at_order.toLocaleString()} ETB
                      </td>
                      <td className="p-4 text-right font-black text-primarycolor">
                        {(item.quantity * item.price_at_order).toLocaleString()} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <DialogFooter className="bg-white p-6 border-t border-slate-100 shrink-0">
          <Button
            onClick={onClose}
            className="w-full bg-primarycolor hover:bg-secondarycolor text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/10"
          >
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
