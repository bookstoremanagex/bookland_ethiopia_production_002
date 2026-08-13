"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditionsStore } from "../../../store/use-editions-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Plus,
  Trash2,
  DollarSign,
  FileText,
  BookOpen,
  Hash,
  Activity,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Edit3,
  Store,
  Printer,
  Info,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Toggle } from "../../ui/toggle";
import { cn } from "../../../lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../ui/sheet";
import {
  createEdition,
  deleteEdition,
} from "../../../app/actions/edition-actions";
import { getAllStores, batchAssignEditionToStores } from "../../../app/actions/store-inventory-actions";
import { toast } from "sonner";

interface EditionsInfoProps {
  book: any;
}

export default function EditionsInfo({ book }: EditionsInfoProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split("/").slice(0, 2).join("/");
  const editions = useEditionsStore((s) => s.editions);
  const setEditions = useEditionsStore((s) => s.setEditions);
  const addEdition = useEditionsStore((s) => s.addEdition);
  const removeEdition = useEditionsStore((s) => s.removeEdition);

  const initialized = useRef(false);
  if (!initialized.current && book.bookedition) {
    setEditions(book.bookedition);
    initialized.current = true;
  }

  useEffect(() => {
    if (book.bookedition) setEditions(book.bookedition);
  }, [book.bookedition]);

  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMoreForm, setShowMoreForm] = useState(false);
  const [sheetEdition, setSheetEdition] = useState<any | null>(null);
  const [sheetStep, setSheetStep] = useState(1);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([]);
  const [storeQuantities, setStoreQuantities] = useState<Record<number, string>>({});
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  const emptyFormData = {
    edition_name: "",
    selling_price: "",
    production_price: "",
    printing_cost: "",
    binding_cost: "",
    design_cost: "",
    editing_cost: "",
    other_expenses: "",
    transportation_cost: "",
    translation_cost: "",
    translator_cost: "",
    cover_design_cost: "",
    text_design_cost: "",
    editor_cost: "",
    typewriting_cost: "",
    store_cost: "",
    distribution_cost: "",
    advertisement_cost: "",
    purchasing_right_cost: "",
    memo: "",
    book_image_url: "",
    total_print_count: "",
    number_of_pages: "",
  };

  const getPrefilledFormData = () => ({
    ...emptyFormData,
    translator_cost: book.translator_cost ? String(book.translator_cost) : "",
    cover_design_cost: book.cover_design_cost
      ? String(book.cover_design_cost)
      : "",
    text_design_cost: book.text_design_cost ? String(book.text_design_cost) : "",
    editor_cost: book.editor_cost ? String(book.editor_cost) : "",
    typewriting_cost: book.typewriting_cost ? String(book.typewriting_cost) : "",
    store_cost: book.store_cost ? String(book.store_cost) : "",
    distribution_cost: book.distribution_cost ? String(book.distribution_cost) : "",
    advertisement_cost: book.advertisement_cost
      ? String(book.advertisement_cost)
      : "",
    purchasing_right_cost: book.purchasing_right_cost
      ? String(book.purchasing_right_cost)
      : "",
    number_of_pages: book.number_of_pages ? String(book.number_of_pages) : "",
    book_image_url: book.book_image_url || "",
  });

  const [formData, setFormData] = useState(emptyFormData);

  const lastEdition = book.bookedition && book.bookedition.length > 0
    ? book.bookedition[0]
    : null;
  const lastEditionPrice = lastEdition?.selling_price;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createEdition({
        ...formData,
        bookId: book.id,
        book_unique_code: book.unique_identification_code,
      });
      if (response.success) {
        toast.success("Edition added successfully");
        addEdition(response.data);
        setIsAdding(false);
        setFormData(getPrefilledFormData());
      } else {
        toast.error(response.error || "Failed to add edition");
      }
    } catch (err: any) {
      console.error("Edition Creation Error:", err);
      toast.error(err.message || "Failed to create edition");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this edition?")) return;
    try {
      const response = await deleteEdition(id, book.unique_identification_code);
      if (response.success) {
        toast.success("Edition deleted");
        removeEdition(id);
      } else {
        toast.error(response.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-[2.5rem] p-10 border-2 border-primarycolor/10 shadow-2xl space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="size-20 rounded-[2rem] bg-secondarycolor/10 flex items-center justify-center text-secondarycolor border-2 border-secondarycolor/20 shadow-lg shadow-secondarycolor/5">
              <Layers className="size-10" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-primarycolor uppercase tracking-tight italic">
                Book{" "}
                <span className="text-secondarycolor not-italic">Editions</span>
              </h2>
              <p className="text-muted-foreground font-bold tracking-tight">
                Manage specialized releases, print runs, and pricing structures.
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setFormData(getPrefilledFormData());
              setShowMoreForm(false);
              setIsAdding(true);
            }}
            className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primarycolor/20 transition-all active:scale-95"
          >
            <Plus className="size-5" /> Add New Edition
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-hidden rounded-3xl border-2 border-primarycolor/5 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primarycolor/5 border-b-2 border-primarycolor/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Edition Profile
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                  Print Metrics
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                  Central Inventory
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                  Printer
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primarycolor/5">
              {editions.length > 0 ? (
                editions.map((edition: any) => (
                  <tr
                    key={edition.id}
                    className="group hover:bg-primarycolor/2 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-white border-2 border-primarycolor/10 flex items-center justify-center text-primarycolor shadow-md overflow-hidden">
                          {edition.book_image_url ? (
                            <img
                              src={edition.book_image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Layers className="size-6 opacity-40" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-primarycolor text-lg tracking-tight uppercase">
                            {edition.edition_name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                            {edition.memo || "No memo provided"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primarycolor/5 text-primarycolor border border-primarycolor/10">
                          <Activity className="size-3" />
                          <span className="text-[10px] font-black">
                            {edition.total_print_count?.toLocaleString() || 0}{" "}
                            Units
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          {edition.number_of_pages || 0} Pages
                        </div>
                      </div>
                    </td>
                      <td className="p-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-secondarycolor/10 text-secondarycolor border border-secondarycolor/20">
                          <Store className="size-3" />
                          <span className="text-[10px] font-black">
                            {edition.count_remening_for_transfer?.toLocaleString() ||
                              0}{" "}
                            Left
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          To Transfer
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col items-center gap-1.5">
                        {(() => {
                          const bep = (edition.bookeditionprinters?.length > 0)
                            ? edition.bookeditionprinters[0]
                            : null;
                          const printerName = bep
                            ? bep.printer?.name
                            : edition.printorder_items?.[0]?.printorder?.printer?.name;
                          if (printerName) {
                            return (
                              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primarycolor/5 text-primarycolor border border-primarycolor/10">
                                <Printer className="size-3" />
                                <span className="text-[10px] font-black whitespace-nowrap">
                                  {printerName}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200">
                              <Printer className="size-3" />
                              <span className="text-[10px] font-black">
                                Not Assigned
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="h-10 px-5 border-2 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primarycolor hover:text-white transition-all shadow-sm"
                        >
                          <Link
                            href={`${dashboardRoot}/books/editions/${edition.id}`}
                          >
                            View Details
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={async () => {
                            setSheetEdition(edition);
                            setSheetStep(1);
                            setSelectedStoreIds([]);
                            setStoreQuantities({});
                            setIsSheetLoading(true);
                            const res = await getAllStores();
                            if (res.success) {
                              setAllStores(res.data);
                            }
                            setIsSheetLoading(false);
                          }}
                          className="h-9 px-4 rounded-xl font-black uppercase tracking-widest text-[9px] text-secondarycolor hover:bg-secondarycolor/10 border-2 border-secondarycolor/10 hover:border-secondarycolor/20 transition-all"
                        >
                          Add to
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <div className="size-24 rounded-full bg-primarycolor/10 flex items-center justify-center border-4 border-dashed border-primarycolor/20">
                        <Layers className="size-12 text-primarycolor" />
                      </div>
                      <div>
                        <p className="text-xl font-black uppercase tracking-[0.2em] text-primarycolor">
                          No Specialized Editions
                        </p>
                        <p className="font-bold text-muted-foreground">
                          Define different print versions for this title.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {editions.length > 0 ? (
            editions.map((edition: any) => {
              const bep = (edition.bookeditionprinters?.length > 0)
                ? edition.bookeditionprinters[0]
                : null;
              const printerName = bep
                ? bep.printer?.name
                : edition.printorder_items?.[0]?.printorder?.printer?.name;
              return (
                <div
                  key={edition.id}
                  className="bg-white rounded-2xl border-2 border-primarycolor/5 p-4 space-y-3"
                >
                  {/* Header: image + name */}
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-white border-2 border-primarycolor/10 flex items-center justify-center text-primarycolor shadow-md overflow-hidden shrink-0">
                      {edition.book_image_url ? (
                        <img src={edition.book_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Layers className="size-5 opacity-40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-primarycolor text-sm tracking-tight uppercase truncate">
                        {edition.edition_name}
                      </div>
                      <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest truncate">
                        {edition.memo || "No memo"}
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-primarycolor/5 text-primarycolor border border-primarycolor/10">
                      <Activity className="size-3 shrink-0" />
                      <span className="text-[9px] font-black">
                        {edition.total_print_count?.toLocaleString() || 0} Units
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-secondarycolor/10 text-secondarycolor border border-secondarycolor/20">
                      <Store className="size-3 shrink-0" />
                      <span className="text-[9px] font-black">
                        {edition.count_remening_for_transfer?.toLocaleString() || 0} Left
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-200">
                      <Printer className="size-3 shrink-0" />
                      <span className="text-[9px] font-black truncate">
                        {printerName || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Pages + Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                      {edition.number_of_pages || 0} Pages
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="h-8 px-3 border-2 rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-primarycolor hover:text-white transition-all"
                      >
                        <Link href={`${dashboardRoot}/books/editions/${edition.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          setSheetEdition(edition);
                          setSheetStep(1);
                          setSelectedStoreIds([]);
                          setStoreQuantities({});
                          setIsSheetLoading(true);
                          const res = await getAllStores();
                          if (res.success) {
                            setAllStores(res.data);
                          }
                          setIsSheetLoading(false);
                        }}
                        className="h-8 px-3 rounded-lg font-black uppercase tracking-widest text-[9px] text-secondarycolor hover:bg-secondarycolor/10 border-2 border-secondarycolor/10"
                      >
                        Add to
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-4 opacity-30">
                <div className="size-20 rounded-full bg-primarycolor/10 flex items-center justify-center border-4 border-dashed border-primarycolor/20">
                  <Layers className="size-10 text-primarycolor" />
                </div>
                <div>
                  <p className="text-base font-black uppercase tracking-[0.2em] text-primarycolor">
                    No Specialized Editions
                  </p>
                  <p className="font-bold text-muted-foreground text-sm">
                    Define different print versions for this title.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay for Adding Edition */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-8 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg shrink-0">
                  <Plus className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-primarycolor uppercase tracking-tight italic leading-tight">
                    New{" "}
                    <span className="text-secondarycolor not-italic">
                      Edition
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-bold">
                    Configure production costs and market pricing.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl shrink-0"
                onClick={() => setIsAdding(false)}
              >
                <X className="size-6" />
              </Button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form
                id="add-edition-form"
                onSubmit={handleAdd}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                    Edition Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={formData.edition_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        edition_name: e.target.value,
                      })
                    }
                    placeholder="e.g. Collector's Hardcover"
                    className="h-14 px-6 rounded-2xl border-2 font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                      Print Count <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      type="number"
                      value={formData.total_print_count}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_print_count: e.target.value,
                        })
                      }
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      onFocus={(e) => e.target.select()}
                      className="h-14 px-6 rounded-2xl border-2 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                      Selling Price <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={formData.selling_price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            selling_price: e.target.value,
                          })
                        }
                        onWheel={(e) =>
                          (e.target as HTMLInputElement).blur()
                        }
                        onFocus={(e) => e.target.select()}
                        className="h-14 pl-10 rounded-2xl border-2 font-bold"
                      />
                    </div>
                    {lastEditionPrice != null && (
                      <p className="text-[9px] font-bold text-secondarycolor/80 ml-1 flex items-center gap-1.5 pt-1">
                        <Info className="size-3 shrink-0" />
                        Last edition sold at{" "}
                        {Number(lastEditionPrice).toLocaleString()} ETB
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border-2 border-primarycolor/10 bg-primarycolor/5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primarycolor">
                      Show more form parts
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground mt-1">
                      Reveal cost breakdown, page count, and memo (pre-filled
                      from the main book info — editable here).
                    </p>
                  </div>
                  <Toggle
                    pressed={showMoreForm}
                    onPressedChange={setShowMoreForm}
                    aria-label="Show more form parts"
                    className="data-[state=on]:bg-primarycolor data-[state=on]:text-white rounded-xl h-10 w-12 shrink-0"
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        showMoreForm && "rotate-180",
                      )}
                    />
                  </Toggle>
                </div>

                {showMoreForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                          Base Cost
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.production_price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                production_price: e.target.value,
                              })
                            }
                            onWheel={(e) =>
                              (e.target as HTMLInputElement).blur()
                            }
                            onFocus={(e) => e.target.select()}
                            className="h-14 pl-10 rounded-2xl border-2 font-bold bg-slate-50"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50/80 p-6 rounded-[2rem] border-2 border-primarycolor/5 space-y-4">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                          Cost Breakdown Details
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Printing</label>
                            <Input type="number" step="0.01" value={formData.printing_cost} onChange={(e) => setFormData({ ...formData, printing_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Binding</label>
                            <Input type="number" step="0.01" value={formData.binding_cost} onChange={(e) => setFormData({ ...formData, binding_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Design</label>
                            <Input type="number" step="0.01" value={formData.design_cost} onChange={(e) => setFormData({ ...formData, design_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                          </div>

                          <div className="space-y-1.5 col-span-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Other Expenses</label>
                            <Input type="number" step="0.01" value={formData.other_expenses} onChange={(e) => setFormData({ ...formData, other_expenses: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50/80 p-6 rounded-[2rem] border-2 border-emerald-200/50 space-y-4">
                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-2">
                          Additional Production Costs
                        </p>
                        <p className="text-[8px] font-bold text-emerald-600/60 -mt-2 mb-2">
                          Pre-filled from the main book info. Leave blank to use
                          book-level defaults, or override per-edition.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Translator</label>
                            <Input type="number" step="0.01" value={formData.translator_cost} onChange={(e) => setFormData({ ...formData, translator_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Cover Design</label>
                            <Input type="number" step="0.01" value={formData.cover_design_cost} onChange={(e) => setFormData({ ...formData, cover_design_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Text Design</label>
                            <Input type="number" step="0.01" value={formData.text_design_cost} onChange={(e) => setFormData({ ...formData, text_design_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Editor</label>
                            <Input type="number" step="0.01" value={formData.editor_cost} onChange={(e) => setFormData({ ...formData, editor_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Typewriting</label>
                            <Input type="number" step="0.01" value={formData.typewriting_cost} onChange={(e) => setFormData({ ...formData, typewriting_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Store Cost</label>
                            <Input type="number" step="0.01" value={formData.store_cost} onChange={(e) => setFormData({ ...formData, store_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Distribution</label>
                            <Input type="number" step="0.01" value={formData.distribution_cost} onChange={(e) => setFormData({ ...formData, distribution_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Advertisement</label>
                            <Input type="number" step="0.01" value={formData.advertisement_cost} onChange={(e) => setFormData({ ...formData, advertisement_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Purchasing Right</label>
                            <Input type="number" step="0.01" value={formData.purchasing_right_cost} onChange={(e) => setFormData({ ...formData, purchasing_right_cost: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} onFocus={(e) => e.target.select()} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                          Page Count
                        </label>
                        <Input
                          type="number"
                          value={formData.number_of_pages}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              number_of_pages: e.target.value,
                            })
                          }
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          onFocus={(e) => e.target.select()}
                          className="h-14 px-6 rounded-2xl border-2 font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                          Production Memo
                        </label>
                        <textarea
                          value={formData.memo}
                          onChange={(e) =>
                            setFormData({ ...formData, memo: e.target.value })
                          }
                          rows={6}
                          className="w-full p-6 rounded-2xl border-2 border-primarycolor/10 focus:border-primarycolor outline-none font-bold text-sm bg-slate-50/50 transition-all resize-none"
                          placeholder="Add notes about paper quality, binding type, etc."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="p-8 pt-4 border-t border-slate-100 bg-slate-50/30">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  form="add-edition-form"
                  disabled={isSubmitting}
                  className="flex-2 py-2 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20 transition-all text-white"
                >
                  {isSubmitting ? "Generating..." : "Create Edition"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 rounded-2xl border-2 font-black uppercase tracking-widest"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sheet for Add-to-store */}
      <Sheet open={!!sheetEdition} onOpenChange={(open) => { if (!open) { setSheetEdition(null); setSheetStep(1); setSelectedStoreIds([]); setStoreQuantities({}); } }}>
        <SheetContent side="right" className="w-full sm:max-w-lg border-l-2 border-primarycolor/10 p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4 border-b border-primarycolor/5 shrink-0">
            <div className="flex items-center gap-4">
              {sheetStep === 2 && (
                <button
                  onClick={() => { setSheetStep(1); setStoreQuantities({}); }}
                  className="size-8 rounded-lg border-2 border-primarycolor/10 hover:bg-primarycolor/5 flex items-center justify-center text-primarycolor font-black text-lg transition-all cursor-pointer shrink-0"
                >
                  ←
                </button>
              )}
              <div>
                <SheetTitle className="text-lg font-black text-primarycolor uppercase tracking-tight">
                  {sheetStep === 1 ? "Select" : "Assign to"}{" "}
                  <span className="text-secondarycolor">Stores</span>
                </SheetTitle>
                <SheetDescription className="text-xs font-bold text-muted-foreground">
                  {sheetEdition?.edition_name}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {isSheetLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="size-8 border-4 border-primarycolor/20 border-t-primarycolor rounded-full animate-spin" />
              </div>
            ) : sheetStep === 1 ? (
              /* Step 1: Select stores */
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                  Choose stores to receive inventory
                </p>
                                  {allStores.map((store) => {
                  const existing = sheetEdition?.bookeditionstores?.find(
                    (bes: any) => bes.storeId === store.id && !bes.is_deleted
                  );
                  const alreadyAssigned = !!existing;
                  const checked = selectedStoreIds.includes(store.id);
                  return (
                    <label
                      key={store.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                        checked
                          ? "border-primarycolor bg-primarycolor/5"
                          : "border-primarycolor/10 hover:border-primarycolor/30"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedStoreIds((prev) => {
                            if (checked) return prev.filter((id) => id !== store.id);
                            return [...prev, store.id];
                          });
                          if (!checked && alreadyAssigned) {
                            setStoreQuantities((prev) => ({
                              ...prev,
                              [store.id]: String(existing.quantity ?? 0),
                            }));
                          } else if (checked) {
                            setStoreQuantities((prev) => {
                              const next = { ...prev };
                              delete next[store.id];
                              return next;
                            });
                          }
                        }}
                        className="size-5 accent-primarycolor rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm text-primarycolor truncate">
                          {store.name}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground truncate">
                          {store.location}
                        </div>
                      </div>
                      {alreadyAssigned && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-secondarycolor/60 shrink-0 bg-secondarycolor/5 px-2 py-1 rounded-lg">
                          Update ({existing.quantity ?? 0})
                        </span>
                      )}
                    </label>
                  );
                })}
                {allStores.length === 0 && (
                  <p className="text-sm font-bold text-center text-muted-foreground py-12">
                    No stores available
                  </p>
                )}
              </div>
            ) : (
              /* Step 2: Enter quantities */
              <div className="space-y-6">
                <div className="bg-secondarycolor/5 p-4 rounded-2xl border-2 border-secondarycolor/10 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Remaining for Transfer
                  </p>
                  <p className="text-3xl font-black text-secondarycolor tabular-nums">
                    {Number(sheetEdition?.count_remening_for_transfer || 0).toLocaleString()}{" "}
                    <span className="text-sm font-bold text-muted-foreground">units</span>
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedStoreIds.map((storeId) => {
                    const store = allStores.find((s) => s.id === storeId);
                    const existing = sheetEdition?.bookeditionstores?.find(
                      (bes: any) => bes.storeId === storeId && !bes.is_deleted
                    );
                    const currentQty = existing ? Number(existing.quantity || 0) : 0;
                    return (
                      <div
                        key={storeId}
                        className="flex items-center gap-4 p-4 rounded-2xl border-2 border-primarycolor/10"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-sm text-primarycolor truncate">
                            {store?.name || `Store #${storeId}`}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground truncate">
                            {store?.location}
                          </div>
                          {existing && (
                            <div className="text-[9px] font-bold text-secondarycolor/60 mt-1">
                              Currently: {currentQty.toLocaleString()} units
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            placeholder="Qty"
                            value={storeQuantities[storeId] ?? (existing ? String(currentQty) : "")}
                            onChange={(e) =>
                              setStoreQuantities((prev) => ({
                                ...prev,
                                [storeId]: e.target.value,
                              }))
                            }
                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            onFocus={(e) => e.target.select()}
                            className="w-24 h-12 text-center rounded-xl border-2 border-primarycolor/10 font-black text-sm outline-none focus:border-primarycolor transition-all"
                          />
                          <span className="text-[10px] font-bold text-muted-foreground">
                            units
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-primarycolor/5 shrink-0">
            {sheetStep === 1 ? (
              <Button
                onClick={() => {
                  if (selectedStoreIds.length === 0) {
                    toast.error("Select at least one store");
                    return;
                  }
                  // Pre-fill quantities for already-assigned stores
                  setStoreQuantities((prev) => {
                    const next = { ...prev };
                    for (const id of selectedStoreIds) {
                      if (!next[id]) {
                        const existing = sheetEdition?.bookeditionstores?.find(
                          (bes: any) => bes.storeId === id && !bes.is_deleted
                        );
                        if (existing) {
                          next[id] = String(existing.quantity ?? 0);
                        }
                      }
                    }
                    return next;
                  });
                  setSheetStep(2);
                }}
                disabled={selectedStoreIds.length === 0}
                className="w-full h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs shadow-xl shadow-primarycolor/20 transition-all"
              >
                Next ({selectedStoreIds.length} store{selectedStoreIds.length !== 1 ? "s" : ""})
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                {(() => {
                  const remaining = Number(sheetEdition?.count_remening_for_transfer || 0);
                  let netDelta = 0;
                  let totalNew = 0;
                  for (const id of selectedStoreIds) {
                    const existing = sheetEdition?.bookeditionstores?.find(
                      (bes: any) => bes.storeId === id && !bes.is_deleted
                    );
                    const oldQty = existing ? Number(existing.quantity || 0) : 0;
                    const newQty = Number(storeQuantities[id]) || 0;
                    netDelta += newQty - oldQty;
                    totalNew += newQty;
                  }
                  const hasAny = selectedStoreIds.some((id) => Number(storeQuantities[id]) > 0);
                  const exceeds = netDelta > remaining;
                  return (
                    <>
                      {(totalNew > 0 || netDelta !== 0) && (
                        <div className={cn(
                          "text-center text-xs font-bold px-3 py-2 rounded-xl",
                          exceeds
                            ? "bg-rose-50 text-rose-600"
                            : netDelta > 0
                              ? "bg-amber-50 text-amber-600"
                              : "bg-emerald-50 text-emerald-600"
                        )}>
                          {exceeds
                            ? `Net increase (${netDelta.toLocaleString()}) exceeds remaining (${remaining.toLocaleString()})`
                            : netDelta > 0
                              ? `Taking ${netDelta.toLocaleString()} of ${remaining.toLocaleString()} remaining units`
                              : netDelta < 0
                                ? `Returning ${Math.abs(netDelta).toLocaleString()} units to remaining`
                                : `${totalNew.toLocaleString()} units allocated`}
                        </div>
                      )}
                      <Button
                        onClick={async () => {
                          if (!hasAny) {
                            toast.error("Enter quantities for selected stores");
                            return;
                          }
                          if (exceeds) {
                            toast.error("Net increase exceeds remaining for transfer");
                            return;
                          }
                          setIsSheetLoading(true);
                          const res = await batchAssignEditionToStores({
                            editionId: sheetEdition.id,
                            stores: selectedStoreIds.map((storeId) => ({
                              storeId,
                              quantity: Number(storeQuantities[storeId]) || 0,
                            })),
                          });
                          setIsSheetLoading(false);
                          if (res.success) {
                            toast.success(`Updated ${selectedStoreIds.length} store(s) successfully`);
                            setSheetEdition(null);
                            setSheetStep(1);
                            setSelectedStoreIds([]);
                            setStoreQuantities({});
                          } else {
                            toast.error(res.error || "Failed to assign");
                          }
                        }}
                        disabled={isSheetLoading || !hasAny}
                        className="w-full h-14 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs shadow-xl shadow-primarycolor/20 transition-all disabled:opacity-40"
                      >
                        {isSheetLoading ? "Assigning..." : "Confirm Assignment"}
                      </Button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
