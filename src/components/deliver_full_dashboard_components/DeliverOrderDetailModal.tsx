"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  Building2,
  MapPin,
  Calendar,
  Banknote,
  Printer,
  Settings2,
  CheckCircle2,
  Clock,
  X,
  Plus,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminOrder } from "@/app/admin_dashboard/manage_orders/ManageOrdersPageContent";
import RecordPaymentModal from "./RecordPaymentModal";
import { useCalendar } from "@/lib/calendar-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder | null;
  payments?: Array<{
    id: number;
    amount: number;
    payment_type: string;
    status: string;
    createdAt: string;
    memo: string | null;
    orderid: string | null;
  }>;
}

export default function DeliverOrderDetailModal({ isOpen, onClose, order, payments }: Props) {
  const { formatShort } = useCalendar();
  const [printOptionsOpen, setPrintOptionsOpen] = useState(false);
  const [printFontSize, setPrintFontSize] = useState<"big" | "small" | "very-small" | "extra-small">("small");
  const [printPageWidth, setPrintPageWidth] = useState<"full" | "half">("full");
  const [printIncludeShop, setPrintIncludeShop] = useState(true);
  const [printIncludeDate, setPrintIncludeDate] = useState(true);
  const [printIncludeQty, setPrintIncludeQty] = useState(true);
  const [printIncludePrice, setPrintIncludePrice] = useState(true);
  const [printIncludeSubtotal, setPrintIncludeSubtotal] = useState(true);
  const [printIncludeEdition, setPrintIncludeEdition] = useState(true);

  if (!order) return null;

  const items = order.order_items || [];
  const totalBooks = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const totalPaid = order.amount_paid || 0;
  const remaining = (order.total_amount || 0) - totalPaid;
  const orderPayments = (payments || []).filter(
    (p) => p.orderid?.replace(/^ORD-/i, "") === String(order.id)
  );

  const fontSizeMap = {
    big: "16px",
    small: "13px",
    "very-small": "11px",
    "extra-small": "9px",
  };

  const handlePrint = () => {
    const fontSize = fontSizeMap[printFontSize];
    const isHalf = printPageWidth === "half";

    const headerCells = [];
    if (printIncludeShop) headerCells.push("<th>Shop</th>");
    if (printIncludeDate) headerCells.push("<th>Date</th>");
    if (printIncludeEdition) headerCells.push("<th>Edition</th>");
    headerCells.push("<th>Book</th>");
    if (printIncludeQty) headerCells.push("<th>Qty</th>");
    if (printIncludePrice) headerCells.push("<th>Price</th>");
    if (printIncludeSubtotal) headerCells.push("<th>Subtotal</th>");

    const bodyRows = items.map((item) => {
      const cells = [];
      if (printIncludeShop) cells.push(`<td>${order.bookshopes?.name || ""}</td>`);
      if (printIncludeDate) cells.push(`<td>${new Date(order.createdAt).toLocaleDateString()}</td>`);
      if (printIncludeEdition) cells.push(`<td>${item.bookedition?.edition_name || ""}</td>`);
      cells.push(`<td>${item.bookedition?.books?.title || ""}</td>`);
      if (printIncludeQty) cells.push(`<td>${item.quantity}</td>`);
      if (printIncludePrice) cells.push(`<td>${item.price_at_order.toLocaleString()} ETB</td>`);
      if (printIncludeSubtotal) cells.push(`<td>${(item.quantity * item.price_at_order).toLocaleString()} ETB</td>`);
      return `<tr>${cells.join("")}</tr>`;
    }).join("");

    const printContent = `<!DOCTYPE html>
<html>
<head><title>Order #ORD-${order.id}</title>
<style>
  @page { size: A4 portrait; margin: 8mm; }
  @page { @top-center { content: "Order #ORD-${order.id}"; font-size: 10px; color: #999; } }
  @page { @bottom-center { content: counter(page); font-size: 9px; color: #999; } }
  body { font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}; color: #1e293b; ${isHalf ? "max-width: 50%; margin: 0 auto;" : ""} }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #f1f5f9; padding: 6px 10px; border: 1px solid #e2e8f0; text-align: left; font-size: ${fontSize}; }
  td { padding: 5px 10px; border: 1px solid #e2e8f0; }
  .meta { margin-bottom: 16px; }
  .meta p { margin: 2px 0; }
  .summary { margin-top: 16px; padding-top: 8px; border-top: 2px solid #1e293b; }
  .summary-row { display: flex; justify-content: space-between; padding: 2px 0; }
  .total { font-weight: bold; font-size: ${fontSize === "16px" ? "18px" : "14px"}; }
</style></head>
<body>
  <div class="meta">
    <h2 style="margin:0 0 4px 0;">Order #ORD-${order.id}</h2>
    <p><strong>Shop:</strong> ${order.bookshopes?.name || ""}${order.bookshopes?.location ? " — " + order.bookshopes.location : ""}</p>
    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
    <p><strong>Status:</strong> ${order.is_approved ? "Approved" : "Pending"} ${order.delivery ? "| Delivered" : ""}</p>
  </div>
  <table>
    <thead><tr>${headerCells.join("")}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
  <div class="summary">
    <div class="summary-row"><span>Total</span><span class="total">${(order.total_amount || 0).toLocaleString()} ETB</span></div>
    <div class="summary-row"><span>Paid</span><span>${totalPaid.toLocaleString()} ETB</span></div>
    <div class="summary-row"><span>Remaining</span><span>${remaining.toLocaleString()} ETB</span></div>
  </div>
</body></html>`;

    const printWin = window.open("", "_blank", "width=800,height=600");
    if (!printWin) return;
    printWin.document.write(printContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-2xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                  <ShoppingBag className="size-5" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-base font-black uppercase italic text-left leading-tight text-primarycolor">
                    Order #ORD-{order.id}
                  </DialogTitle>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                    {order.bookshopes?.name || ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider",
                  order.is_approved
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                )}>
                  {order.is_approved ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                  {order.is_approved ? "Approved" : "Pending"}
                </span>
                {order.delivery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    Delivered
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Shop Info */}
            <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primarycolor">
                <Building2 className="size-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Shop Details</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="size-3.5 shrink-0" />
                  <span className="font-bold text-slate-800">{order.bookshopes?.name || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="font-semibold">{order.bookshopes?.location || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Calendar className="size-3.5 shrink-0" />
                  <span className="font-semibold">{formatShort(new Date(order.createdAt))}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ml-1",
                    order.order_type === "on round"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-teal-100 text-teal-600"
                  )}>
                    {order.order_type === "on round" ? "On Round" : "Requested"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-primarycolor/[0.03] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-primarycolor">
                <Banknote className="size-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Payment Summary</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total Amount</span>
                  <span className="font-black text-primarycolor">{(order.total_amount || 0).toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total Paid</span>
                  <span className="font-bold text-emerald-600">{totalPaid.toLocaleString()} ETB</span>
                </div>
                <div className="pt-2 border-t border-primarycolor/10 flex justify-between items-center">
                  <span className="font-black text-sm uppercase tracking-wider">Remaining</span>
                  <span className={cn(
                    "font-black text-base",
                    remaining > 0 ? "text-rose-600" : "text-emerald-600"
                  )}>
                    {remaining.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            {/* Record Payment Button */}
            <RecordPaymentModal
              shopId={order.bookShopId}
              shopName={order.bookshopes?.name || ""}
              orderId={order.id}
              trigger={
                <Button className="w-full h-12 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-primarycolor/20">
                  <Plus className="size-4" /> Record Payment
                </Button>
              }
            />

            {/* Order Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primarycolor">
                  <ShoppingBag className="size-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Items ({totalBooks} book{totalBooks !== 1 ? "s" : ""})
                  </span>
                </div>
                <span className="text-[8px] font-black text-muted-foreground">
                  {items.length} line{items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-800 truncate">
                        {item.bookedition?.books?.title || "Unknown Book"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {item.bookedition?.edition_name || ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <span className="text-[10px] font-black text-muted-foreground">
                        x{item.quantity}
                      </span>
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-800">
                          {(item.quantity * item.price_at_order).toLocaleString()} ETB
                        </p>
                        <p className="text-[9px] text-muted-foreground font-semibold">
                          {item.price_at_order.toLocaleString()} /pc
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payments */}
            {orderPayments.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primarycolor">
                  <Banknote className="size-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Payments ({orderPayments.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {orderPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-emerald-700">
                            {payment.amount.toLocaleString()} ETB
                          </span>
                          <span className={cn(
                            "text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                            payment.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-600"
                              : payment.status === "PENDING"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-rose-100 text-rose-600"
                          )}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[9px] font-semibold text-muted-foreground">
                            {payment.payment_type === "CHECK" ? "Check" : "Direct"}
                          </span>
                          <span className="text-[8px] text-muted-foreground/60">
                            {formatShort(new Date(payment.createdAt))}
                          </span>
                        </div>
                        {payment.memo && (
                          <p className="text-[9px] text-muted-foreground/70 mt-0.5 italic">"{payment.memo}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="bg-slate-50 p-4 border-t border-slate-100 shrink-0 flex-row items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest gap-1.5"
            >
              <Printer className="size-3.5" /> Print
            </Button>
            <Button
              variant="outline"
              onClick={() => setPrintOptionsOpen(true)}
              className="rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest gap-1.5"
            >
              <Settings2 className="size-3.5" /> Print Options
            </Button>
            <RecordPaymentModal
              shopId={order.bookShopId}
              shopName={order.bookshopes?.name || ""}
              orderId={order.id}
              trigger={
                <Button className="rounded-xl h-10 px-5 bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest gap-1.5 shadow-lg">
                  <Plus className="size-3.5" /> Record Payment
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Options Dialog */}
      <Dialog open={printOptionsOpen} onOpenChange={setPrintOptionsOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <Printer className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase italic text-primarycolor">
                  Print Options
                </DialogTitle>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  Order #ORD-{order.id}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 space-y-5">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Font Size</label>
              <div className="flex gap-2">
                {(["big", "small", "very-small", "extra-small"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPrintFontSize(size)}
                    className={cn(
                      "flex-1 h-9 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all",
                      printFontSize === size
                        ? "border-primarycolor bg-primarycolor/10 text-primarycolor"
                        : "border-slate-100 text-muted-foreground hover:border-slate-200"
                    )}
                  >
                    {size === "big" ? "Big" : size === "small" ? "Small" : size === "very-small" ? "V.Small" : "X.Small"}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Width */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Page Width</label>
              <div className="flex gap-2">
                {(["full", "half"] as const).map((width) => (
                  <button
                    key={width}
                    onClick={() => setPrintPageWidth(width)}
                    className={cn(
                      "flex-1 h-9 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all",
                      printPageWidth === width
                        ? "border-primarycolor bg-primarycolor/10 text-primarycolor"
                        : "border-slate-100 text-muted-foreground hover:border-slate-200"
                    )}
                  >
                    {width === "full" ? "Full Width" : "Half Width"}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Columns */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Include Columns</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "shop", label: "Shop", state: printIncludeShop, set: setPrintIncludeShop },
                  { key: "date", label: "Date", state: printIncludeDate, set: setPrintIncludeDate },
                  { key: "edition", label: "Edition", state: printIncludeEdition, set: setPrintIncludeEdition },
                  { key: "qty", label: "Quantity", state: printIncludeQty, set: setPrintIncludeQty },
                  { key: "price", label: "Price", state: printIncludePrice, set: setPrintIncludePrice },
                  { key: "subtotal", label: "Subtotal", state: printIncludeSubtotal, set: setPrintIncludeSubtotal },
                ].map((col) => (
                  <button
                    key={col.key}
                    onClick={() => col.set(!col.state)}
                    className={cn(
                      "flex items-center gap-2 h-9 px-3 rounded-xl border-2 font-black text-[8px] uppercase tracking-widest transition-all",
                      col.state
                        ? "border-primarycolor bg-primarycolor/10 text-primarycolor"
                        : "border-slate-100 text-muted-foreground hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "size-3.5 rounded border-2 flex items-center justify-center shrink-0",
                      col.state ? "border-primarycolor bg-primarycolor" : "border-slate-200"
                    )}>
                      {col.state && <X className="size-2.5 text-white" strokeWidth={4} />}
                    </div>
                    {col.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-slate-50 p-4 border-t border-slate-100 flex-row items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPrintOptionsOpen(false)}
              className="rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => { setPrintOptionsOpen(false); handlePrint(); }}
              className="rounded-xl h-10 px-5 bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest gap-1.5 flex-1 shadow-lg"
            >
              <Printer className="size-3.5" /> Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
