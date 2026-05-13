"use client";

import React, { useState } from 'react';
import {
  Store,
  Plus,
  Trash2,
  Package,
  Edit3,
  Check,
  X,
  Building2,
  AlertCircle,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import {
  assignEditionToStore,
  updateStoreInventory,
  deleteStoreInventory
} from '../../../../actions/store-inventory-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StoreInventoryTableProps {
  editionId: number;
  inventory: any[];
  allStores: any[];
}

export default function StoreInventoryTable({
  editionId,
  inventory: initialInventory,
  allStores
}: StoreInventoryTableProps) {
  const [inventory, setInventory] = useState(initialInventory);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [newAssignment, setNewAssignment] = useState({
    storeId: "",
    quantity: "0"
  });

  const handleAdd = async () => {
    if (!newAssignment.storeId) return toast.error("Please select a store");
    setIsProcessing(true);
    try {
      const response = await assignEditionToStore({
        editionId,
        storeId: Number(newAssignment.storeId),
        quantity: Number(newAssignment.quantity)
      });
      if (response.success) {
        toast.success("Edition assigned to store");
        setInventory([...inventory, response.data]);
        setIsAdding(false);
        setNewAssignment({ storeId: "", quantity: "0" });
      } else {
        toast.error(response.error || "Failed to assign");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (id: number) => {
    setIsProcessing(true);
    try {
      const response = await updateStoreInventory(id, Number(editValue), editionId);
      if (response.success) {
        toast.success("Inventory updated");
        setInventory(inventory.map(item => item.id === id ? { ...item, quantity: Number(editValue) } : item));
        setEditingId(null);
      } else {
        toast.error(response.error || "Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setIsProcessing(true);
    try {
      const response = await deleteStoreInventory(itemToDelete.id, editionId);
      if (response.success) {
        toast.success("Removed from store");
        setInventory(inventory.filter(item => item.id !== itemToDelete.id));
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        setDeleteConfirmText("");
      } else {
        toast.error(response.error || "Failed to remove");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border-2 border-primarycolor/10 shadow-2xl space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="size-14 md:size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shrink-0">
            <Store className="size-7 md:size-8" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-primarycolor uppercase tracking-tight">Retail <span className="text-secondarycolor">Inventory</span></h2>
            <p className="text-muted-foreground font-bold text-xs md:text-base">Distribution tracking across physical stores.</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          className="h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-[10px] md:text-xs gap-2"
        >
          <Plus className="size-4" /> Add to Store
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden rounded-3xl border-2 border-primarycolor/5 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primarycolor/5 border-b-2 border-primarycolor/5">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Store Name</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Stock Level</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primarycolor/5">
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item.id} className="group hover:bg-primarycolor/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor">
                        <Building2 className="size-5" />
                      </div>
                      <span className="font-black text-primarycolor uppercase tracking-tight">{item.stores.name}</span>
                    </div>
                  </td>
                  <td className="p-6 font-bold text-muted-foreground text-sm">{item.stores.location}</td>
                  <td className="p-6 text-center">
                    {editingId === item.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 h-10 rounded-xl border-2 font-black text-center"
                          autoFocus
                        />
                        <Button size="icon" className="size-8 bg-emerald-500 rounded-lg" onClick={() => handleUpdate(item.id)} disabled={isProcessing}>
                          <Check className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8 rounded-lg" onClick={() => setEditingId(null)}>
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <div className={cn(
                          "px-4 py-1.5 rounded-xl font-black text-xs border-2 shadow-sm",
                          item.quantity > 50 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            item.quantity > 10 ? "bg-amber-50 text-amber-600 border-amber-100" :
                              "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                          {item.quantity} units
                        </div>
                        <Button size="icon" variant="ghost" className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                          setEditingId(item.id);
                          setEditValue(item.quantity.toString());
                        }}>
                          <Edit3 className="size-4 text-primarycolor" />
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <Button size="icon" variant="ghost" className="size-10 rounded-xl hover:bg-rose-50 text-rose-500" onClick={() => {
                      setItemToDelete(item);
                      setShowDeleteConfirm(true);
                    }} disabled={isProcessing}>
                      <Trash2 className="size-5" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <Package className="size-12" />
                    <p className="font-black uppercase tracking-widest text-xs">No distribution data found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {inventory.length > 0 ? (
          inventory.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border-2 border-primarycolor/5 bg-primarycolor/[0.01] space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor border border-secondarycolor/20">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <div className="font-black text-primarycolor uppercase tracking-tight text-sm">{item.stores.name}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.stores.location}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button size="icon" variant="ghost" className="size-8 rounded-lg bg-primarycolor/5 text-primarycolor" onClick={() => {
                      setEditingId(item.id);
                      setEditValue(item.quantity.toString());
                    }}>
                      <Edit3 className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-8 rounded-lg bg-rose-50 text-rose-500" onClick={() => {
                      setItemToDelete(item);
                      setShowDeleteConfirm(true);
                    }}>
                      <Trash2 className="size-4" />
                    </Button>
                </div>
              </div>

              {editingId === item.id ? (
                <div className="flex items-center gap-2 pt-3 border-t border-primarycolor/5">
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 h-10 rounded-xl border-2 font-black"
                  />
                  <Button size="icon" className="size-10 bg-emerald-500 rounded-xl" onClick={() => handleUpdate(item.id)} disabled={isProcessing}>
                    <Check className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-10 rounded-xl" onClick={() => setEditingId(null)}>
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-3 border-t border-primarycolor/5">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Stock</span>
                  <div className={cn(
                    "px-3 py-1 rounded-lg font-black text-[10px] border shadow-sm",
                    item.quantity > 50 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      item.quantity > 10 ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-rose-50 text-rose-600 border-rose-100"
                  )}>
                    {item.quantity} units
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center opacity-30 border-2 border-dashed border-primarycolor/10 rounded-2xl">
            <Package className="size-10 mx-auto mb-3" />
            <p className="font-black uppercase tracking-widest text-[10px]">No distribution found</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="pt-8 border-t-2 border-primarycolor/5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Select Store</label>
            <select
              value={newAssignment.storeId}
              onChange={(e) => setNewAssignment({ ...newAssignment, storeId: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border-2 font-bold outline-none focus:border-primarycolor"
            >
              <option value="">Choose Store...</option>
              {allStores.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">Initial Stock</label>
            <Input
              type="number"
              value={newAssignment.quantity}
              onChange={(e) => setNewAssignment({ ...newAssignment, quantity: e.target.value })}
              className="h-12 px-4 rounded-xl border-2 font-bold"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button className="flex-1 h-12 rounded-xl bg-primarycolor font-black uppercase tracking-widest text-[10px]" onClick={handleAdd} disabled={isProcessing}>Assign Store</Button>
            <Button variant="ghost" className="h-12 px-4 rounded-xl" onClick={() => setIsAdding(false)}>Cancel</Button>
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
                <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tight">Danger <span className="text-secondarycolor">Zone</span></h3>
                <p className="text-muted-foreground font-bold">Removing retail assignment.</p>
              </div>
            </div>

            <div className="p-6 bg-rose-500/5 rounded-2xl border-2 border-rose-500/10 space-y-4">
              <div className="flex items-start gap-4">
                <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-1" />
                <p className="text-sm font-bold text-rose-900/70 leading-relaxed">
                  You are about to remove <span className="text-rose-600 font-black">"{itemToDelete?.stores.name}"</span> from this edition's distribution list.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Type <span className="underline">DELETE</span> to confirm</p>
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
