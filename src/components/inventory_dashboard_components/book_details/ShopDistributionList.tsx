"use client";

import React, { useState } from 'react';
import {
  ShoppingBag,
  Building2,
  Package,
  Plus,
  X,
  ChevronRight,
  Trash2,
  Edit3,
  AlertTriangle,
  ShieldAlert,
  BadgeDollarSign,
  ClipboardList,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { addEditionToBookShop, deleteBookShopEdition, updateBookShopEdition } from '../../../app/actions/book-shop-edition-actions';
import { checkCurrentUserRole } from '../../../app/actions/book-shop-actions';
import { toast } from 'sonner';

interface ShopDistributionListProps {
  book: any;
  bookShops: any[];
}

export default function ShopDistributionList({ book, bookShops }: ShopDistributionListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [formData, setFormData] = useState({
    bookShopId: "",
    bookEditionId: "",
    quantity: "0",
    price_per_peice: "0",
    already_paid: "0",
    memo: ""
  });

  // Aggregate all book shop assignments from all editions
  const allAssignments = book.bookedition?.flatMap((edition: any) =>
    edition.bookshopeditions
      ?.filter((assignment: any) => assignment.bookshopes) // Ensure bookshopes exists
      .map((assignment: any) => ({
        ...assignment,
        editionName: edition.edition_name,
        editionId: edition.id
      }))
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookShopId || !formData.bookEditionId) return toast.error("Please select a shop and edition");

    setIsProcessing(true);
    try {
      if (editingItem) {
        const res = await updateBookShopEdition(editingItem.id, {
          quantity: Number(formData.quantity),
          price_per_peice: Number(formData.price_per_peice),
          already_paid: Number(formData.already_paid),
          memo: formData.memo
        });
        if (res.success) {
          toast.success("Assignment updated");
          setIsAdding(false);
          setEditingItem(null);
          window.location.reload();
        } else toast.error(res.error);
      } else {
        const res = await addEditionToBookShop({
          bookShopId: Number(formData.bookShopId),
          bookEditionId: Number(formData.bookEditionId),
          quantity: Number(formData.quantity),
          price_per_peice: Number(formData.price_per_peice),
          already_paid: Number(formData.already_paid),
          memo: formData.memo
        });

        if (res.success) {
          toast.success("Edition assigned to book shop");
          setIsAdding(false);
          setFormData({ bookShopId: "", bookEditionId: "", quantity: "0", price_per_peice: "0", already_paid: "0", memo: "" });
          window.location.reload();
        } else toast.error(res.error);
      }
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (assignment: any) => {
    setEditingItem(assignment);
    setFormData({
      bookShopId: assignment.bookShopId.toString(),
      bookEditionId: assignment.bookEditionId.toString(),
      quantity: assignment.quantity.toString(),
      price_per_peice: (assignment.price_per_peice || 0).toString(),
      already_paid: (assignment.already_paid || 0).toString(),
      memo: assignment.memo || ""
    });
    setIsAdding(true);
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setIsProcessing(true);
    try {
      const res = await deleteBookShopEdition(itemToDelete.id);
      if (res.success) {
        toast.success("Assignment removed");
        setShowDeleteConfirm(false);
        window.location.reload();
      } else toast.error(res.error);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border-2 border-primarycolor/10 shadow-2xl space-y-8 md:space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="size-16 rounded-[1.5rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg shadow-primarycolor/5">
              <ShoppingBag className="size-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-primarycolor uppercase tracking-tight italic">Shop <span className="text-secondarycolor not-italic">Partners</span></h2>
              <p className="text-muted-foreground font-bold tracking-tight uppercase text-[10px]">Distribution & Partner Distribution hub</p>
            </div>
          </div>
          <Button
            onClick={async () => {
              const roleCheck = await checkCurrentUserRole("adding_edition");
              if (!roleCheck.enabled) {
                toast.error("You do not have permission to add edition to shop.");
                return;
              }
              setIsAdding(true);
              setEditingItem(null);
              setFormData({ bookShopId: "", bookEditionId: "", quantity: "0", price_per_peice: "0", already_paid: "0", memo: "" });
            }}
            className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primarycolor/20 transition-all active:scale-95"
          >
            <Plus className="size-5" /> Add Edition to Shop
          </Button>
        </div>

        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-hidden rounded-3xl border-2 border-primarycolor/5 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primarycolor/5 border-b-2 border-primarycolor/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Partner Shop</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Book Edition</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Qty / Price</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Financial Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primarycolor/5">
              {allAssignments.length > 0 ? (
                allAssignments.map((assignment: any) => (
                  <tr key={assignment.id} className="group hover:bg-primarycolor/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border border-primarycolor/20">
                          <Building2 className="size-5" />
                        </div>
                        <div>
                          <div className="font-black text-primarycolor uppercase tracking-tight text-xs">{assignment.bookshopes.name}</div>
                          <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{assignment.bookshopes.branch || 'Main'} Branch</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-secondarycolor" />
                        <span className="font-bold text-primarycolor text-xs">{assignment.editionName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-primarycolor/5 border border-primarycolor/10 font-black text-[9px] text-primarycolor">
                          <Package className="size-2.5" /> {assignment.quantity} Units
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground tracking-tighter">@{assignment.price_per_peice} ETB</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-primarycolor tracking-tight">{assignment.total_price} ETB</div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-[8px] font-black text-emerald-600 px-1.5 py-0.5 bg-emerald-50 rounded-md uppercase tracking-tighter">Paid: {assignment.already_paid}</div>
                          <div className="text-[8px] font-black text-rose-600 px-1.5 py-0.5 bg-rose-50 rounded-md uppercase tracking-tighter">Owe: {assignment.remaining_amount}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-lg hover:bg-primarycolor/10 text-primarycolor"
                          onClick={() => startEdit(assignment)}
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8 rounded-lg hover:bg-rose-50 text-rose-500" onClick={() => {
                          setItemToDelete(assignment);
                          setShowDeleteConfirm(true);
                        }}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <ShoppingBag className="size-16 text-primarycolor" />
                      <div>
                        <p className="text-xl font-black uppercase tracking-[0.2em] text-primarycolor">No Partner Assignments</p>
                        <p className="font-bold text-muted-foreground">Start distributing this book to external partner shops.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (Hidden on desktop) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {allAssignments.length > 0 ? (
            allAssignments.map((assignment: any) => (
              <div key={assignment.id} className="p-6 rounded-3xl border-2 border-primarycolor/5 bg-primarycolor/[0.01] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border border-primarycolor/20">
                      <Building2 className="size-6" />
                    </div>
                    <div>
                      <div className="font-black text-primarycolor uppercase tracking-tight text-sm">{assignment.bookshopes.name}</div>
                      <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{assignment.bookshopes.branch || 'Main'} Branch</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-10 rounded-xl hover:bg-primarycolor/10 text-primarycolor"
                      onClick={() => startEdit(assignment)}
                    >
                      <Edit3 className="size-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-10 rounded-xl hover:bg-rose-50 text-rose-500" onClick={() => {
                      setItemToDelete(assignment);
                      setShowDeleteConfirm(true);
                    }}>
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primarycolor/5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Edition</p>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-secondarycolor" />
                      <span className="font-bold text-primarycolor text-xs">{assignment.editionName}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Inventory</p>
                    <div className="flex justify-end">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-primarycolor/5 border border-primarycolor/10 font-black text-[9px] text-primarycolor">
                        <Package className="size-2.5" /> {assignment.quantity} Units
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primarycolor/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Financial Summary</p>
                    <p className="font-black text-primarycolor text-xs">{assignment.total_price} ETB Total</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Paid</span>
                      <span className="font-black text-emerald-700 text-xs">{assignment.already_paid}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 border border-rose-100">
                      <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest mb-1 opacity-60">Debt</span>
                      <span className="font-black text-rose-700 text-xs">{assignment.remaining_amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center opacity-30">
              <ShoppingBag className="size-12 mx-auto text-primarycolor mb-4" />
              <p className="font-black uppercase tracking-widest text-xs text-primarycolor">No Assignments</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Assignment Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shrink-0">
                  <Plus className="size-6 md:size-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-primarycolor uppercase tracking-tight italic leading-tight">{editingItem ? "Update" : "Partner"} <span className="text-secondarycolor not-italic">Assignment</span></h3>
                  <p className="text-muted-foreground font-bold uppercase text-[8px] md:text-[10px] tracking-widest mt-1">{editingItem ? "Refine distribution details" : "Distribute editions to partner shops"}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="rounded-xl size-10 md:size-12 shrink-0">
                <X className="size-5 md:size-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1 flex items-center gap-2">
                  <Building2 className="size-3" /> Select Partner Shop
                </label>
                <select
                  value={formData.bookShopId}
                  disabled={!!editingItem}
                  onChange={(e) => setFormData({ ...formData, bookShopId: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-2 font-bold outline-none focus:border-primarycolor transition-all disabled:opacity-50"
                >
                  <option value="">Choose Shop...</option>
                  {bookShops.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.branch || 'Main'})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1 flex items-center gap-2">
                  <ChevronRight className="size-3" /> Select Edition
                </label>
                <select
                  value={formData.bookEditionId}
                  disabled={!!editingItem}
                  onChange={(e) => setFormData({ ...formData, bookEditionId: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-2 font-bold outline-none focus:border-primarycolor transition-all disabled:opacity-50"
                >
                  <option value="">Choose Edition...</option>
                  {book.bookedition?.map((e: any) => (
                    <option key={e.id} value={e.id}>{e.edition_name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1 flex items-center gap-2">
                  <Package className="size-3" /> Quantity
                </label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="h-12 px-4 rounded-xl border-2 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1 flex items-center gap-2">
                  <BadgeDollarSign className="size-3" /> Price Per Piece
                </label>
                <Input
                  type="number"
                  value={formData.price_per_peice}
                  onChange={(e) => setFormData({ ...formData, price_per_peice: e.target.value })}
                  className="h-12 px-4 rounded-xl border-2 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1 flex items-center gap-2">
                  <ClipboardList className="size-3" /> Already Paid
                </label>
                <Input
                  type="number"
                  value={formData.already_paid}
                  onChange={(e) => setFormData({ ...formData, already_paid: e.target.value })}
                  className="h-12 px-4 rounded-xl border-2 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1 flex items-center gap-2">
                  <X className="size-3" /> Memo / Note
                </label>
                <Input
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  className="h-12 px-4 rounded-xl border-2 font-bold"
                  placeholder="Optional note..."
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs shadow-xl shadow-primarycolor/20"
                >
                  {isProcessing ? "Processing..." : editingItem ? "Update Details" : "Complete Assignment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-6">
              <div className="size-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20">
                <ShieldAlert className="size-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tight italic">Danger <span className="text-secondarycolor not-italic">Zone</span></h3>
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mt-1">Discontinuing Assignment</p>
              </div>
            </div>

            <div className="p-6 bg-rose-500/5 rounded-2xl border-2 border-rose-500/10 space-y-4">
              <div className="flex items-start gap-4">
                <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-1" />
                <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                  You are about to remove <span className="text-rose-600 font-black">"{itemToDelete?.bookshopes.name}"</span> from this distribution list.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Type <span className="underline">DELETE</span> to confirm</p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="h-14 px-6 rounded-xl border-2 border-rose-500/20 font-black text-rose-600"
                  placeholder="Type here..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="destructive"
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20"
                onClick={handleDelete}
                disabled={isProcessing || deleteConfirmText !== "DELETE"}
              >
                {isProcessing ? "Processing..." : "Confirm Removal"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
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
