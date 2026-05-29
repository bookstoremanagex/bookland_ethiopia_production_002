"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Package,
  Banknote,
  Calendar,
  ArrowLeft,
  Edit3,
  FileText,
  Receipt,
  History,
  TrendingUp,
  AlertCircle,
  Save,
  X,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar } from "@/lib/calendar-context";
import { toast } from "sonner";
import { updateBookShopEdition } from "@/app/actions/book-shop-edition-actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AssignmentDetailsContentProps {
  assignment: any;
}

const EditableField = ({
  label,
  field,
  value,
  icon: Icon,
  type = "number",
  suffix = "",
  editValues,
  setEditValues,
  handleSaveEdit,
  isUpdating,
}: any) => {
  return (
    <div className="group relative bg-white p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl transition-all hover:border-primarycolor/20">
      <div
        className={`size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 ${field === "already_paid" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}
      >
        <Icon className="size-5 md:size-6" />
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        <div className="flex items-center justify-between group/val">
          <h4 className="text-2xl md:text-3xl font-black text-primarycolor">
            {type === "number" ? Number(value).toLocaleString() : value}{" "}
            <span className="text-xs md:text-sm">{suffix}</span>
          </h4>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-all size-8 rounded-lg hover:bg-primarycolor/10 text-primarycolor"
              >
                <Edit3 className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-3xl p-6 shadow-2xl border-2 border-primarycolor/10 animate-in zoom-in-95 duration-200">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-black text-primarycolor uppercase tracking-tight text-sm">
                    Update {label}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Adjust distribution records
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type={type}
                    defaultValue={value}
                    onChange={(e) =>
                      setEditValues({ ...editValues, [field]: e.target.value })
                    }
                    className="h-12 rounded-xl border-2 focus:border-primarycolor font-black"
                  />
                  <Button
                    onClick={() => handleSaveEdit(field)}
                    disabled={isUpdating}
                    className="h-12 w-12 rounded-xl bg-primarycolor shrink-0 shadow-lg shadow-primarycolor/20"
                  >
                    <Save className="size-5" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default function AssignmentDetailsContent({
  assignment: initialAssignment,
}: AssignmentDetailsContentProps) {
  const { formatDate } = useCalendar();
  const [assignment, setAssignment] = useState(initialAssignment);
  const pathname = usePathname();
  const dashboardRoot = pathname.split("/").slice(0, 2).join("/");
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editValues, setEditValues] = useState<any>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const financialHealth =
    ((assignment.already_paid || 0) / (assignment.total_price || 1)) * 100;

  const handleSaveEdit = async (field: string) => {
    const newValue = editValues[field];
    if (newValue === undefined || newValue === assignment[field]) return;

    setIsUpdating(true);
    try {
      const dataToUpdate: any = {
        [field]: field === "memo" ? newValue : Number(newValue),
      };

      const res = await updateBookShopEdition(assignment.id, dataToUpdate);
      if (res.success) {
        toast.success("Updated successfully");
        setAssignment((prev: any) => {
          const updated = { ...prev, ...dataToUpdate };
          // Recalculate financial derived fields
          const newTotal =
            Number(updated.quantity) * Number(updated.price_per_peice);
          updated.total_price = newTotal;
          updated.remaining_amount = newTotal - Number(updated.already_paid);
          return updated;
        });
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-10">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href={`${dashboardRoot}/book_shops`}>
          <Button
            variant="ghost"
            className="rounded-2xl gap-3 font-bold text-muted-foreground hover:text-primarycolor p-0 h-auto md:p-4 md:h-10"
          >
            <ArrowLeft className="size-4 md:size-5" />{" "}
            <span className="text-xs md:text-sm">Back to Shops</span>
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest">
            Active Assignment
          </div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            ID: #{assignment.id}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Core Identity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border-2 border-primarycolor/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-primarycolor/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            <div className="relative space-y-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <div className="size-20 md:size-24 rounded-[1.8rem] md:rounded-[2.5rem] bg-primarycolor/10 flex items-center justify-center text-primarycolor border-4 border-white shadow-xl shrink-0">
                  <Building2 className="size-10 md:size-12" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-primarycolor uppercase tracking-tighter italic leading-tight">
                    {assignment.bookshopes.name}
                  </h1>
                  <p className="text-sm md:text-xl font-bold text-muted-foreground mt-1 md:mt-2 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-secondarycolor">
                      {assignment.bookshopes.branch || "Main"}
                    </span>{" "}
                    Branch
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] bg-slate-50 border-2 border-white shadow-inner space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3 text-primarycolor">
                    <Package className="size-5 md:size-6" />
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      Content
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-black text-primarycolor uppercase line-clamp-2">
                      {assignment.bookedition.books.title}
                    </h3>
                    <p className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {assignment.bookedition.edition_name}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] bg-primarycolor text-white shadow-xl shadow-primarycolor/20 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3 opacity-60">
                    <TrendingUp className="size-5 md:size-6" />
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      Total Revenue
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black">
                      {mounted
                        ? assignment.total_price?.toLocaleString()
                        : "..."}{" "}
                      <span className="text-lg md:text-xl opacity-60">ETB</span>
                    </h3>
                    <p className="text-[8px] md:text-xs font-bold uppercase tracking-widest mt-1 md:mt-2 opacity-60">
                      Wholesale Value
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EditableField
              label="Inventory"
              field="quantity"
              value={assignment.quantity}
              icon={Package}
              suffix="Units"
              editValues={editValues}
              setEditValues={setEditValues}
              handleSaveEdit={handleSaveEdit}
              isUpdating={isUpdating}
            />
            <EditableField
              label="Unit Price"
              field="price_per_peice"
              value={assignment.price_per_peice}
              icon={Receipt}
              suffix="ETB"
              editValues={editValues}
              setEditValues={setEditValues}
              handleSaveEdit={handleSaveEdit}
              isUpdating={isUpdating}
            />
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl space-y-4">
              <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Calendar className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Assignment Date
                </p>
                <h4 className="text-xl font-black text-primarycolor mt-1">
                  {mounted
                    ? formatDate(new Date(assignment.createdAt))
                    : "..."}
                </h4>
              </div>
            </div>
          </div>

          {/* Memo / Notes Section */}
          <div className="group relative bg-white rounded-[3rem] p-10 border-2 border-primarycolor/5 shadow-xl space-y-6 transition-all hover:border-primarycolor/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-primarycolor">
                <FileText className="size-6" />
                <h3 className="text-xl font-black uppercase tracking-tight italic">
                  Partnership{" "}
                  <span className="text-secondarycolor not-italic">
                    Notes & Memo
                  </span>
                </h3>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-all size-10 rounded-xl hover:bg-primarycolor/10 text-primarycolor"
                  >
                    <Edit3 className="size-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] rounded-[2rem] p-8 shadow-2xl border-2 border-primarycolor/10 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-black text-primarycolor uppercase tracking-tight text-lg">
                        Update Memo
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        Internal notes and distribution history
                      </p>
                    </div>
                    <Textarea
                      defaultValue={assignment.memo}
                      onChange={(e) =>
                        setEditValues({ ...editValues, memo: e.target.value })
                      }
                      placeholder="Add internal notes or distribution memo..."
                      className="min-h-[150px] rounded-[1.5rem] border-2 border-slate-100 focus:border-primarycolor font-medium italic p-6"
                    />
                    <Button
                      onClick={() => handleSaveEdit("memo")}
                      disabled={isUpdating}
                      className="w-full h-14 rounded-2xl bg-primarycolor font-black uppercase tracking-widest text-xs shadow-xl shadow-primarycolor/20 gap-3"
                    >
                      <Save className="size-5" /> Save Memo
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 min-h-[120px]">
              {assignment.memo ? (
                <p className="text-slate-600 font-medium italic leading-relaxed whitespace-pre-wrap">
                  "{assignment.memo}"
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-30 text-center py-10">
                  <AlertCircle className="size-8 mb-2" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">
                    No memo recorded. Click the edit icon to add notes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Integrity */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border-2 border-primarycolor/5 shadow-2xl space-y-10 relative overflow-hidden">
            <div className="flex items-center gap-4 text-primarycolor">
              <Banknote className="size-8" />
              <h3 className="text-2xl font-black uppercase tracking-tight italic">
                Financial{" "}
                <span className="text-secondarycolor not-italic">Status</span>
              </h3>
            </div>

            <div className="space-y-8">
              <div className="relative size-48 mx-auto">
                <svg className="size-full" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-100 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-emerald-500 stroke-current transition-all duration-1000 ease-in-out"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * financialHealth) / 100}
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-primarycolor">
                    {Math.round(financialHealth)}%
                  </span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Paid
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="group relative flex items-center justify-between p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 hover:border-emerald-300 transition-all">
                  <div className="flex-grow space-y-2">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                      Amount Paid Instantly
                    </p>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={
                          editValues.already_paid ??
                          (mounted ? assignment.already_paid : 0)
                        }
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            already_paid: e.target.value,
                          })
                        }
                        className="h-10 w-32 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 font-black text-lg bg-white"
                      />
                      <Button
                        onClick={() => handleSaveEdit("already_paid")}
                        disabled={
                          isUpdating ||
                          editValues.already_paid === undefined ||
                          Number(editValues.already_paid) ===
                            assignment.already_paid
                        }
                        size="sm"
                        className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 gap-2 font-black text-[10px] uppercase tracking-widest"
                      >
                        <Save className="size-4" /> Save
                      </Button>
                    </div>
                  </div>
                  <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm ml-4 shrink-0">
                    <Receipt className="size-6" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-rose-50 border border-rose-100">
                  <div>
                    <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">
                      Remaining Debt
                    </p>
                    <p className="text-2xl font-black text-rose-700">
                      {mounted
                        ? assignment.remaining_amount?.toLocaleString()
                        : "..."}{" "}
                      ETB
                    </p>
                  </div>
                  <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
                    <AlertCircle className="size-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <History className="size-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Last Updated
                </span>
              </div>
              <p className="text-sm font-bold text-slate-600">
                {mounted
                  ? new Date(assignment.updatedAt).toLocaleString()
                  : "..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
