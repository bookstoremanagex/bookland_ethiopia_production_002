"use client";

import React, { useState } from "react";
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
  ExternalLink,
  Edit3,
  Store,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { cn } from "../../../lib/utils";
import {
  createEdition,
  deleteEdition,
} from "../../../app/actions/edition-actions";
import { toast } from "sonner";

interface EditionsInfoProps {
  book: any;
}

export default function EditionsInfo({ book }: EditionsInfoProps) {
  const pathname = usePathname();
  const dashboardRoot = pathname.split("/").slice(0, 2).join("/");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
  });

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
        setIsAdding(false);
        setFormData({
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
        });
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
            onClick={() => setIsAdding(true)}
            className="h-14 px-8 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primarycolor/20 transition-all active:scale-95"
          >
            <Plus className="size-5" /> Add New Edition
          </Button>
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-primarycolor/5 shadow-sm">
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
                  Market Pricing
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primarycolor/5">
              {book.bookedition && book.bookedition.length > 0 ? (
                book.bookedition.map((edition: any) => (
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
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-xl font-black text-secondarycolor italic">
                          ${edition.selling_price || 0}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          Cost: ${edition.production_price || 0}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button
                        asChild
                        variant="outline"
                        className="h-12 px-6 border-2 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primarycolor hover:text-white transition-all shadow-sm"
                      >
                        <Link
                          href={`${dashboardRoot}/books/editions/${edition.id}`}
                        >
                          View Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
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
                className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primarycolor ml-1">
                      Edition Name
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
                        Selling Price{" "}
                        <span className="text-destructive">*</span>
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
                          className="h-14 pl-10 rounded-2xl border-2 font-bold"
                        />
                      </div>
                    </div>
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
                          className="h-14 pl-10 rounded-2xl border-2 font-bold bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 p-6 rounded-[2rem] border-2 border-primarycolor/5 space-y-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                      Cost Breakdown Details
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Printing</label>
                        <Input type="number" step="0.01" value={formData.printing_cost} onChange={(e) => setFormData({ ...formData, printing_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Binding</label>
                        <Input type="number" step="0.01" value={formData.binding_cost} onChange={(e) => setFormData({ ...formData, binding_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Design</label>
                        <Input type="number" step="0.01" value={formData.design_cost} onChange={(e) => setFormData({ ...formData, design_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Editing</label>
                        <Input type="number" step="0.01" value={formData.editing_cost} onChange={(e) => setFormData({ ...formData, editing_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Transport</label>
                        <Input type="number" step="0.01" value={formData.transportation_cost} onChange={(e) => setFormData({ ...formData, transportation_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Translation</label>
                        <Input type="number" step="0.01" value={formData.translation_cost} onChange={(e) => setFormData({ ...formData, translation_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[8px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Other Expenses</label>
                        <Input type="number" step="0.01" value={formData.other_expenses} onChange={(e) => setFormData({ ...formData, other_expenses: e.target.value })} className="h-11 px-4 rounded-xl border-2 font-bold text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/80 p-6 rounded-[2rem] border-2 border-emerald-200/50 space-y-4">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-2">
                      Additional Production Costs
                    </p>
                    <p className="text-[8px] font-bold text-emerald-600/60 -mt-2 mb-2">
                      Leave blank to use book-level defaults, or override per-edition.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Translator</label>
                        <Input type="number" step="0.01" value={formData.translator_cost} onChange={(e) => setFormData({ ...formData, translator_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Cover Design</label>
                        <Input type="number" step="0.01" value={formData.cover_design_cost} onChange={(e) => setFormData({ ...formData, cover_design_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Text Design</label>
                        <Input type="number" step="0.01" value={formData.text_design_cost} onChange={(e) => setFormData({ ...formData, text_design_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Editor</label>
                        <Input type="number" step="0.01" value={formData.editor_cost} onChange={(e) => setFormData({ ...formData, editor_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Typewriting</label>
                        <Input type="number" step="0.01" value={formData.typewriting_cost} onChange={(e) => setFormData({ ...formData, typewriting_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Store Cost</label>
                        <Input type="number" step="0.01" value={formData.store_cost} onChange={(e) => setFormData({ ...formData, store_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Distribution</label>
                        <Input type="number" step="0.01" value={formData.distribution_cost} onChange={(e) => setFormData({ ...formData, distribution_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Advertisement</label>
                        <Input type="number" step="0.01" value={formData.advertisement_cost} onChange={(e) => setFormData({ ...formData, advertisement_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[8px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">Purchasing Right</label>
                        <Input type="number" step="0.01" value={formData.purchasing_right_cost} onChange={(e) => setFormData({ ...formData, purchasing_right_cost: e.target.value })} className="h-11 px-4 rounded-xl border-2 border-emerald-200 font-bold text-sm bg-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
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
                      className="h-14 px-6 rounded-2xl border-2 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                        className="h-14 px-6 rounded-2xl border-2 font-bold"
                      />
                    </div>
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
                        className="h-14 px-6 rounded-2xl border-2 font-bold"
                      />
                    </div>
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
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="p-8 pt-4 border-t border-slate-100 bg-slate-50/30">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  form="add-edition-form"
                  disabled={isSubmitting}
                  className="flex-2 h-16 rounded-2xl bg-primarycolor hover:bg-secondarycolor font-black uppercase tracking-widest shadow-2xl shadow-primarycolor/20 transition-all text-white"
                >
                  {isSubmitting ? "Generating..." : "Create Edition"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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
