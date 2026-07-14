"use client";

import { useState } from "react";
import { useCalendar } from "@/lib/calendar-context";
import {
  ArrowLeft,
  BookOpen,
  Store,
  Calendar,
  Save,
  Trash2,
  Loader2,
  Edit3,
  AlertTriangle,
  Settings,
  Play,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { updateRoundBook, deleteRoundBook } from "../actions";
import SelectStoreDialog from "./SelectStoreDialog";
import RoundRecordDetailDialog from "./RoundRecordDetailDialog";

type RoundBookData = {
  id: number;
  status: boolean;
  book: {
    id: number;
    title: string;
    author: string | null;
    unique_identification_code: string;
    book_sku: string;
  };
  starting_amount: number;
  returned_amount: number;
  unitPrice: number;
  storeCount: number;
  stores: { id: number; shopId: number | null; storeName: string; location: string; branch: string; totalprice: number }[];
  createdAt: string;
};

export default function RoundBookDetail({ roundBook }: { roundBook: RoundBookData }) {
  const router = useRouter();
  const [startingAmount, setStartingAmount] = useState(String(roundBook.starting_amount));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showReverseConfirm, setShowReverseConfirm] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showSelectStore, setShowSelectStore] = useState(false);
  const [detailRecordId, setDetailRecordId] = useState<number | null>(null);
  const { formatShort } = useCalendar();

  const totalSoldMoney = roundBook.stores.reduce((sum, store) => sum + (store.totalprice || 0), 0);
  const booksSold = roundBook.unitPrice > 0 ? Math.round(totalSoldMoney / roundBook.unitPrice) : 0;

  const handleCancelEdit = () => {
    setStartingAmount(String(roundBook.starting_amount));
    setIsEditing(false);
  };

  const dateStr = formatShort(new Date(roundBook.createdAt));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateRoundBook(roundBook.id, {
        starting_amount: parseInt(startingAmount, 10) || 0,
      });
      if (res.success) {
        toast.success("Changes saved");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEndRoute = async () => {
    setIsEnding(true);
    try {
      const returnedAmount = roundBook.starting_amount - booksSold;
      const res = await updateRoundBook(roundBook.id, {
        status: false,
        returned_amount: returnedAmount,
      });
      if (res.success) {
        toast.success("Round ended");
        setShowEndConfirm(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to end round");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsEnding(false);
    }
  };

  const handleReverse = async () => {
    setIsReversing(true);
    try {
      const res = await updateRoundBook(roundBook.id, { status: true });
      if (res.success) {
        toast.success("Round reactivated");
        setShowReverseConfirm(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to reverse");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsReversing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteRoundBook(roundBook.id);
      if (res.success) {
        toast.success("Round book deleted");
        setShowDeleteConfirm(false);
        router.push("/delivery_dashboard_full/round-books");
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={() => router.push("/delivery_dashboard_full/round-books")}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl hover:bg-primarycolor/5 text-primarycolor font-black text-[10px] uppercase tracking-widest transition-all"
      >
        <ArrowLeft className="size-4" />
        Back to Round Books
      </button>

      {/* Header card */}
      <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
            <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
              <BookOpen className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-800">
                {roundBook.book.title}
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                {roundBook.book.unique_identification_code}
                {roundBook.book.author ? ` · ${roundBook.book.author}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider",
              roundBook.status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
            )}>
              <span className={cn("size-1.5 rounded-full", roundBook.status ? "bg-emerald-500" : "bg-slate-400")} />
              {roundBook.status ? "Active" : "Inactive"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 font-black text-[10px] text-muted-foreground">
              <Calendar className="size-3" />
              {dateStr}
            </span>

            <DropdownMenu open={showSettingsDropdown} onOpenChange={setShowSettingsDropdown}>
              <DropdownMenuTrigger asChild>
                <button className="size-8 rounded-xl hover:bg-primarycolor/5 text-muted-foreground hover:text-primarycolor flex items-center justify-center transition-all cursor-pointer">
                  <Settings className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {roundBook.status ? (
                  <DropdownMenuItem
                    className="text-amber-700 data-highlighted:text-amber-700 data-highlighted:bg-amber-50 cursor-pointer gap-3 py-2.5 px-3"
                    onSelect={(e) => {
                      e.preventDefault();
                      setShowSettingsDropdown(false);
                      setTimeout(() => setShowEndConfirm(true), 100);
                    }}
                  >
                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-bold text-[11px]">End Route</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-emerald-700 data-highlighted:text-emerald-700 data-highlighted:bg-emerald-50 cursor-pointer gap-3 py-2.5 px-3"
                    onSelect={(e) => {
                      e.preventDefault();
                      setShowSettingsDropdown(false);
                      setTimeout(() => setShowReverseConfirm(true), 100);
                    }}
                  >
                    <Play className="size-4 shrink-0" />
                    <span className="font-bold text-[11px]">Reverse</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Shops section */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl overflow-hidden">
            <div className="p-5 sm:p-7 border-b border-primarycolor/5 flex items-center justify-between">
              <h2 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Shops in Round
              </h2>
              <button
                onClick={() => setShowSelectStore(true)}
                className="h-12 px-6 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primarycolor/20 transition-all active:scale-[0.97]"
              >
                <Store className="size-4" />
                Select a Shop
              </button>
            </div>
            {roundBook.stores.length > 0 ? (
              <div className="divide-y divide-primarycolor/5">
                {roundBook.stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setDetailRecordId(store.id)}
                    className="w-full flex items-center gap-3 px-5 sm:px-7 py-4 hover:bg-primarycolor/[0.02] transition-all text-left active:scale-[0.99]"
                  >
                    <div className="size-9 rounded-xl bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                      <Store className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-700 truncate">{store.storeName}</p>
                      {store.location && (
                        <p className="text-[9px] font-bold text-muted-foreground truncate">{store.location}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-sm text-primarycolor">
                        {store.totalprice.toLocaleString()} ETB
                      </p>
                      <p className="text-[8px] font-bold text-muted-foreground">Sold</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-5 sm:px-7 py-8 text-center">
                <Store className="size-8 mx-auto text-muted-foreground/20 mb-2" />
                <p className="text-[10px] font-bold text-muted-foreground">No shops assigned yet</p>
              </div>
            )}
          </div>

          {/* Amounts */}
          <div className="bg-white rounded-3xl border-2 border-primarycolor/5 shadow-xl p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Amounts
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-9 px-4 rounded-xl bg-primarycolor/5 hover:bg-primarycolor/10 text-primarycolor font-black text-[8px] uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-[0.97]"
                >
                  <Edit3 className="size-3.5" />
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Starting Amount
                  </p>
                  <Input
                    type="number"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(e.target.value)}
                    min={0}
                    className="h-12 px-4 rounded-2xl border-2 border-primarycolor/5 bg-white font-bold text-base focus:border-primarycolor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-sm shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Save className="size-5" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex-1 h-14 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  Starting Amount
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1">{roundBook.starting_amount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          {roundBook.status && (
            <button
              onClick={() => setShowEndConfirm(true)}
              className="w-full h-14 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-sm border-2 border-amber-200/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span className="size-2 rounded-full bg-amber-500" />
              End Route
            </button>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full h-14 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-sm border-2 border-rose-200/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Trash2 className="size-5" />
            Delete
          </button>
        </div>
      </div>

      {/* End Route Confirmation */}
      <AlertDialog open={showEndConfirm} onOpenChange={(o) => { if (!o) setShowEndConfirm(false); }}>
        <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
              End Route
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
              End the route for{" "}
              <span className="text-primarycolor">{roundBook.book.title}</span>?
            </AlertDialogDescription>
            <div className="space-y-3 pt-3">
              <div className="bg-primarycolor/[0.02] rounded-2xl border-2 border-primarycolor/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-muted-foreground">Starting Amount</span>
                  <span className="font-black text-slate-800">{roundBook.starting_amount} books</span>
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-muted-foreground">Total Sold</span>
                  <span className="font-black text-primarycolor">{booksSold} books</span>
                </div>
                <div className="border-t border-primarycolor/5 pt-2">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-bold text-muted-foreground">Returned</span>
                    <span className="font-black text-emerald-600">{roundBook.starting_amount - booksSold} books</span>
                  </div>
                </div>
              </div>
              <p className="text-[8px] font-bold text-muted-foreground text-center">
                Sold across {roundBook.stores.length} shop{roundBook.stores.length !== 1 ? "s" : ""}
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel asChild>
              <button className="flex-1 py-3 rounded-2xl border-2 border-slate-200 font-black text-[9px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                Cancel
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleEndRoute}
                disabled={isEnding}
                className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isEnding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <span className="size-2 rounded-full bg-white" />
                )}
                {isEnding ? "Ending..." : "End Route"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reverse Confirmation */}
      <AlertDialog open={showReverseConfirm} onOpenChange={setShowReverseConfirm}>
        <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-primarycolor uppercase tracking-tight italic">
              Reverse Round
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground">
              Reactivate the round for{" "}
              <span className="text-primarycolor">{roundBook.book.title}</span>?
              Status will be set back to active.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel asChild>
              <button className="flex-1 py-3 rounded-2xl border-2 border-slate-200 font-black text-[9px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                Cancel
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleReverse}
                disabled={isReversing}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isReversing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {isReversing ? "Reactivating..." : "Reactivate"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={showDeleteConfirm}
        onOpenChange={(o) => { if (!o) { setShowDeleteConfirm(false); setDeleteConfirmText(""); } }}
      >
        <AlertDialogContent className="rounded-[2rem] border-2 border-primarycolor/5 p-6 max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="size-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border-2 border-rose-500/20 shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-black text-rose-600 uppercase tracking-tight italic">
                  Delete Round Book
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[10px] font-bold text-muted-foreground mt-1">
                  This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-[9px] font-bold text-muted-foreground">
              Type <span className="font-black text-rose-600 underline decoration-2 underline-offset-2">DELETE</span> to confirm permanent removal of{" "}
              <span className="text-foreground">{roundBook.book.title}</span>
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE here..."
              className="h-12 px-4 rounded-2xl border-2 border-rose-200 font-black text-sm text-rose-600 tracking-[0.1em] uppercase focus:border-rose-400 placeholder:normal-case placeholder:font-bold placeholder:text-muted-foreground/40"
            />
          </div>

          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel asChild>
              <button
                onClick={() => setDeleteConfirmText("")}
                className="flex-1 py-3 rounded-2xl border-2 border-slate-200 font-black text-[9px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting || deleteConfirmText !== "DELETE"}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SelectStoreDialog
        open={showSelectStore}
        onClose={() => setShowSelectStore(false)}
        roundBookId={roundBook.id}
        bookId={roundBook.book.id}
        startingAmount={roundBook.starting_amount}
        existingShopIds={roundBook.stores.map((s) => s.shopId)}
      />

      <RoundRecordDetailDialog
        open={detailRecordId !== null}
        onClose={() => setDetailRecordId(null)}
        recordId={detailRecordId ?? 0}
      />
    </div>
  );
}
