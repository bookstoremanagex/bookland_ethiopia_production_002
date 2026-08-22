"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Printer, Banknote, FileText, Loader2, ChevronsUpDown, Check, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPrinters } from "@/app/actions/printer-actions";
import { getPrinterPaymentsForOrder, createPrinterShopPayment } from "@/app/actions/printer-shop-payment-actions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopId: number;
  shopName: string;
  orderId: number | null;
  orderTotal?: number | null;
  orderPaid?: number | null;
}

export default function PrinterShopPaymentDialog({ isOpen, onClose, shopId, shopName, orderId, orderTotal, orderPaid }: Props) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [printers, setPrinters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalPrinterPaid = useMemo(() => records.reduce((s: number, r: any) => s + (r.amount || 0), 0), [records]);
  const lastPrinterId = records.length > 0 ? String(records[0].printerId ?? records[0].printer?.id ?? "") : "";

  useEffect(() => {
    if (!isOpen || !orderId) return;
    setLoading(true);
    Promise.all([getPrinterPaymentsForOrder(orderId), getPrinters()]).then(([recRes, printRes]) => {
      if (recRes.success) setRecords(recRes.data || []);
      if (printRes.success) setPrinters(printRes.data || []);
      setLoading(false);
    });
  }, [isOpen, orderId]);

  useEffect(() => {
    if (isOpen && records.length > 0 && !selectedPrinter && lastPrinterId) {
      setSelectedPrinter(lastPrinterId);
    }
  }, [records, lastPrinterId, isOpen, selectedPrinter]);

  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      setAmount("");
      setMemo("");
      // keep selectedPrinter for next open if last exists, otherwise clear
    }
  }, [isOpen]);

  const filteredPrinters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return printers;
    return printers.filter((p: any) => `${p.name} ${p.location || ""}`.toLowerCase().includes(q));
  }, [printers, search]);

  const handleCreate = async () => {
    const parsed = parseFloat(amount);
    if (!orderId) {
      toast.error("Order not found");
      return;
    }
    if (!selectedPrinter) {
      toast.error("Select a printer");
      return;
    }
    if (!amount || isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createPrinterShopPayment({
        shopId,
        orderId,
        printerId: Number(selectedPrinter),
        amount: parsed,
        memo: memo || null,
      });
      if (res.success) {
        toast.success("Printer payment recorded");
        setAmount("");
        setMemo("");
        setShowForm(false);
        // refresh list
        const recRes = await getPrinterPaymentsForOrder(orderId);
        if (recRes.success) setRecords(recRes.data || []);
      } else {
        toast.error(res.error || "Failed to record");
      }
    } catch {
      toast.error("Failed to record");
    } finally {
      setSubmitting(false);
    }
  };

  const entered = parseFloat(amount);
  const sumAfter = !isNaN(entered) && entered > 0 ? totalPrinterPaid + entered : totalPrinterPaid;
  const totalPaidNum = orderPaid ?? 0;
  const exceeds = totalPaidNum > 0 && sumAfter > totalPaidNum;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl w-[95vw] rounded-[2.5rem] border-4 border-primarycolor/5 bg-white p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
              <Printer className="size-5 md:size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg md:text-xl font-black text-primarycolor uppercase italic truncate">
                Printer Payments
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                {shopName} {orderId ? `· #ORD-${orderId}` : ""}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* Totals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-100 text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total Paid (Order)</p>
              <p className="font-black text-primarycolor text-sm mt-1">{totalPaidNum.toLocaleString()} ETB</p>
            </div>
            <div className="p-3 rounded-2xl bg-primarycolor/5 border-2 border-primarycolor/10 text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-primarycolor">Printer Paid (Sum)</p>
              <p className="font-black text-primarycolor text-sm mt-1">{totalPrinterPaid.toLocaleString()} ETB</p>
            </div>
          </div>

          {/* Previous records table - scrollable */}
          <div className="rounded-2xl border-2 border-slate-100 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">Previously Recorded</p>
              <span className="text-[9px] font-bold text-muted-foreground">{records.length} records</span>
            </div>
            <div className="max-h-[260px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> <span className="text-xs font-bold">Loading...</span>
                </div>
              ) : records.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-xs font-bold text-muted-foreground">No printer payments recorded for this order yet</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-2.5 text-[8px] font-black uppercase tracking-widest text-primarycolor/60">Printer</th>
                      <th className="p-2.5 text-[8px] font-black uppercase tracking-widest text-primarycolor/60 text-right">Amount</th>
                      <th className="p-2.5 text-[8px] font-black uppercase tracking-widest text-primarycolor/60">Memo</th>
                      <th className="p-2.5 text-[8px] font-black uppercase tracking-widest text-primarycolor/60">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r: any) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="p-2.5">
                          <p className="font-bold text-xs text-primarycolor truncate max-w-[140px]">{r.printer?.name || "Unknown"}</p>
                          {r.printer?.location && <p className="text-[8px] font-bold text-muted-foreground truncate max-w-[140px]">{r.printer.location}</p>}
                        </td>
                        <td className="p-2.5 text-right font-black text-primarycolor text-xs">{Number(r.amount || 0).toLocaleString()} ETB</td>
                        <td className="p-2.5 text-xs font-bold text-slate-600 max-w-[160px] truncate">{r.memo || "—"}</td>
                        <td className="p-2.5 text-[10px] font-bold text-muted-foreground whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Record payment toggle */}
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full h-12 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest gap-2"
            >
              <Printer className="size-4" /> Record Printer Payment
            </Button>
          ) : (
            <div className="space-y-4 p-4 rounded-2xl bg-primarycolor/5 border-2 border-primarycolor/10">
              <div className="flex items-center gap-2 text-primarycolor">
                <Printer className="size-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">New Printer Payment</h4>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Printer <span className="text-rose-500">*</span></label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full h-11 justify-between rounded-xl border-2 border-primarycolor/20 bg-white font-bold text-xs"
                    >
                      {selectedPrinter
                        ? printers.find((p: any) => String(p.id) === selectedPrinter)?.name || "Select printer"
                        : "Select a printer..."}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl bg-white">
                    <Command shouldFilter={false}>
                      <CommandInput placeholder="Search printer..." value={search} onValueChange={setSearch} className="h-11" />
                      <CommandList className="max-h-[200px]">
                        {filteredPrinters.length === 0 && <CommandEmpty className="p-4 text-center text-xs font-bold text-muted-foreground">No printers found</CommandEmpty>}
                        <CommandGroup>
                          {filteredPrinters.map((p: any) => (
                            <CommandItem
                              key={p.id}
                              value={`${p.name}-${p.id}`}
                              onSelect={() => {
                                setSelectedPrinter(String(p.id));
                                setPopoverOpen(false);
                              }}
                              className="h-11 px-4 flex items-center justify-between"
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-xs truncate">{p.name}</span>
                                {p.location && <span className="text-[8px] text-muted-foreground truncate">{p.location}</span>}
                              </div>
                              {selectedPrinter === String(p.id) && <Check className="size-4 text-primarycolor shrink-0 ml-2" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">
                  Amount (ETB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm", exceeds ? "text-rose-400" : "text-primarycolor/40")}>ETB</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    className={cn(
                      "h-11 pl-14 rounded-xl border-2 font-bold text-sm focus:ring-2",
                      exceeds
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/50 text-rose-700"
                        : "border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20 bg-white"
                    )}
                    placeholder="0.00"
                  />
                </div>
                {exceeds && (
                  <p className="text-[9px] font-black text-rose-600 ml-1 flex items-center gap-1">
                    <AlertTriangle className="size-3" /> Total printer payments ({sumAfter.toLocaleString()} ETB) will exceed total paid ({totalPaidNum.toLocaleString()} ETB) — still can be recorded.
                  </p>
                )}
                {!exceeds && orderPaid != null && (
                  <p className="text-[9px] font-bold text-muted-foreground ml-1 flex items-center gap-1">
                    <Info className="size-3" /> Total paid for order: {totalPaidNum.toLocaleString()} ETB · After this: {sumAfter.toLocaleString()} ETB
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-primarycolor ml-1">
                  Printer Memo <span className="text-muted-foreground/40">(optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 size-3.5 text-muted-foreground" />
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="h-20 w-full pl-9 pt-2.5 rounded-xl border-2 border-primarycolor/20 font-bold text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primarycolor/20 bg-white"
                    placeholder="Add a note for this printer payment..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setAmount("");
                    setMemo("");
                  }}
                  className="flex-1 h-11 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={submitting || !selectedPrinter || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
                  className="flex-1 h-11 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <Banknote className="size-4" />}
                  {submitting ? "Saving..." : "Save Payment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
