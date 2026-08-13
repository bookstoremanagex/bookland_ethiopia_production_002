"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  ShieldAlert,
  AlertTriangle,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Map,
  Printer,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { createBookShop, updateBookShop, deleteBookShop, checkCurrentUserRole } from '../../actions/book-shop-actions';
import { toast } from 'sonner';
import { BookShopsTable } from '@/components/admin_dashboard_components/BookShopsTable';

interface BookShopManagementProps {
  initialShops: any[];
}

const fontMap = { "big": "18px", "medium": "14px", "small": "12px", "extra-small": "10px" } as const;
type PrintFont = keyof typeof fontMap;

export default function BookShopManagement({ initialShops }: BookShopManagementProps) {
  const [shops, setShops] = useState(initialShops);
  const [isAdding, setIsAdding] = useState(false);
  const [editingShop, setEditingShop] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<any>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [printFontSize, setPrintFontSize] = useState<PrintFont>("small");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    branch: "",
    phone: "",
    email: ""
  });

  const handleAddClick = async () => {
    const res = await checkCurrentUserRole("adding_book_store");
    if (!res.enabled) {
      toast.error("You do not have permission to add a book store.");
      return;
    }
    setEditingShop(null);
    setFormData({ name: "", location: "", branch: "", phone: "", email: "" });
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return toast.error("Name and Location are required");
    
    setIsProcessing(true);
    try {
      if (editingShop) {
        const res = await updateBookShop(editingShop.id, formData);
        if (res.success) {
          toast.success("Book shop updated");
          setShops(shops.map(s => s.id === editingShop.id ? res.data : s));
          setIsAdding(false);
          setEditingShop(null);
        } else toast.error(res.error);
      } else {
        const res = await createBookShop(formData);
        if (res.success) {
          toast.success("Book shop created");
          setShops([res.data, ...shops]);
          setIsAdding(false);
        } else toast.error(res.error);
      }
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setIsProcessing(true);
    try {
      const res = await deleteBookShop(shopToDelete.id);
      if (res.success) {
        toast.success("Book shop deleted");
        setShops(shops.filter(s => s.id !== shopToDelete.id));
        setShowDeleteConfirm(false);
        setShopToDelete(null);
        setDeleteConfirmText("");
      } else toast.error(res.error);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (shop: any) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      location: shop.location,
      branch: shop.branch || "",
      phone: shop.phone || "",
      email: shop.email || ""
    });
    setIsAdding(true);
  };

  const handlePrintList = () => {
    const fontSize = fontMap[printFontSize];
    const rows = shops.map((s, i) => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #999;text-align:center;">${i + 1}</td>
        <td style="padding:6px 10px;border:1px solid #999;">${s.name}</td>
        <td style="padding:6px 10px;border:1px solid #999;">${s.branch || "-"}</td>
        <td style="padding:6px 10px;border:1px solid #999;">${s.location}</td>
        <td style="padding:6px 10px;border:1px solid #999;">${s.phone || "-"}</td>
        <td style="padding:6px 10px;border:1px solid #999;">${s.email || "-"}</td>
      </tr>
    `).join('');

    const printContent = `
<!DOCTYPE html>
<html>
<head>
<title>Book Shops List</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}; color: #000; padding: 16px 24px; }
  h1 { font-size: ${parseInt(fontSize) + 6}px; margin-bottom: 4px; }
  .sub { color: #555; font-size: ${parseInt(fontSize) - 2}px; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #e8e8e8; font-weight: 700; padding: 6px 10px; border: 1px solid #999; text-align: left; }
  td { padding: 6px 10px; border: 1px solid #999; }
</style>
</head>
<body>
  <h1>BOOK SHOPS LIST</h1>
  <div class="sub">List of shops with their location and contact information — ${shops.length} partner${shops.length === 1 ? "" : "s"}</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Shop Name</th>
        <th>Branch</th>
        <th>Location</th>
        <th>Phone</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=800,height=600');
    if (!printWin) return;
    printWin.document.write(printContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    setIsPrintOpen(false);
  };

  return (
    <div className="space-y-8">
      <BookShopsTable 
        data={shops} 
        onEdit={startEdit}
        onDelete={(shop) => {
            setShopToDelete(shop);
            setShowDeleteConfirm(true);
        }}
        onAdd={handleAddClick}
        onPrint={() => setIsPrintOpen(true)}
      />

      {/* Add/Edit Modal Overlay */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 md:space-y-10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shrink-0">
                  <Plus className="size-6 md:size-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-primarycolor uppercase tracking-tight italic leading-tight">
                    {editingShop ? "Update" : "New"} <span className="text-secondarycolor not-italic">Partner</span>
                  </h3>
                  <p className="text-muted-foreground font-bold uppercase text-[8px] md:text-[10px] tracking-widest mt-0.5 md:mt-1">Book Shop Registration</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="rounded-xl size-10 md:size-12">
                <X className="size-5 md:size-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Shop Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primarycolor/40" />
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold text-sm md:text-base"
                    placeholder="Enter shop name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Branch Name</label>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primarycolor/40" />
                  <Input 
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="pl-12 h-14 rounded-2xl border-2 font-bold"
                    placeholder="e.g. Piassa, Bole"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Physical Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primarycolor/40" />
                  <Input 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="pl-12 h-14 rounded-2xl border-2 font-bold"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primarycolor/40" />
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-12 h-14 rounded-2xl border-2 font-bold"
                    placeholder="+251 ..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primarycolor/40" />
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-12 h-14 rounded-2xl border-2 font-bold"
                    placeholder="shop@example.com"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4 md:pt-6">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full h-14 md:h-16 rounded-xl md:rounded-[1.5rem] bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl shadow-primarycolor/20 transition-all"
                >
                  {isProcessing ? "Processing..." : editingShop ? "Update Partner" : "Register Shop"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print List Options Dialog */}
      <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
        <DialogContent className="sm:max-w-md w-full my-auto rounded-[1.8rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="bg-white p-5 sm:p-6 pb-0 border-b border-slate-100 shrink-0">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                <Printer className="size-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base md:text-lg font-black text-primarycolor uppercase italic">
                  Print <span className="text-secondarycolor not-italic">List</span>
                </DialogTitle>
                <DialogDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                  This print lists all book shops with their location and contact information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-primarycolor/5">
              <p className="text-[9px] font-black text-primarycolor uppercase tracking-widest italic mb-2 flex items-center gap-1.5">
                <Settings2 className="size-3.5" /> Font Size
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["big", "medium", "small", "extra-small"] as const).map(size => (
                  <label
                    key={size}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-colors",
                      printFontSize === size
                        ? "border-primarycolor bg-primarycolor/5"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <input
                      type="radio"
                      name="print-font-size"
                      checked={printFontSize === size}
                      onChange={() => setPrintFontSize(size)}
                      className="size-3.5 accent-primarycolor shrink-0"
                    />
                    <span className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">
                      {size === "big" ? "Big" : size === "medium" ? "Medium" : size === "small" ? "Small" : "Extra Small"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-white p-4 sm:p-5 border-t border-slate-100 shrink-0">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setIsPrintOpen(false)}
                className="flex-1 h-11 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePrintList}
                className="flex-1 h-11 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] bg-primarycolor hover:bg-secondarycolor text-white shadow-lg gap-1.5"
              >
                <Printer className="size-3.5" /> Print
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20 shrink-0">
                <ShieldAlert className="size-6 md:size-8" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-rose-500 uppercase tracking-tight italic">Danger <span className="text-secondarycolor not-italic">Zone</span></h3>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5 md:mt-1 text-muted-foreground">Discontinuing Partner Agreement</p>
              </div>
            </div>

            <div className="p-6 bg-rose-500/5 rounded-2xl border-2 border-rose-500/10 space-y-4">
              <div className="flex items-start gap-4">
                <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-1" />
                <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                  You are about to delete <span className="text-rose-600 font-black">"{shopToDelete?.name}"</span>. This action is permanent and will hide all associated history.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Type <span className="underline">DELETE</span> to confirm</p>
                <Input 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="h-14 px-6 rounded-xl border-2 border-rose-500/20 font-black text-rose-600 placeholder:text-rose-200"
                  placeholder="Type here..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="destructive"
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all active:scale-95"
                onClick={handleDelete}
                disabled={isProcessing || deleteConfirmText !== "DELETE"}
              >
                {isProcessing ? "Processing..." : "Confirm Delete"}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest hover:bg-primarycolor/5 transition-all"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setShopToDelete(null);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
