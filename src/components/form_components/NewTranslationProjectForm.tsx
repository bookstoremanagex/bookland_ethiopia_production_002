"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { translationProjectSchema, type TranslationProjectFormValues } from "../../lib/validation/translation-project-schema";
import { createTranslationProject } from "../../app/actions/translation-project-actions";
import { Button } from "../ui/button";
import { DateInput } from "../ui/date-input";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Controller } from "react-hook-form";
import { ArrowLeft, Banknote, Calendar, Clock, FileText, PenTool, Plus, User } from "lucide-react";
import TranslatorMultiSelect from "./TranslatorMultiSelect";
import BookEditionPicker, { type PickerBook } from "./BookEditionPicker";

interface NewTranslationProjectFormProps {
  books: PickerBook[];
  translators: { id: number; name: string }[];
}

export function NewTranslationProjectForm({ books, translators }: NewTranslationProjectFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const searchParams = useSearchParams();
  const prefillBookId = searchParams.get("bookId");
  const prefillTranslatorId = searchParams.get("translatorId");
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TranslationProjectFormValues>({
    resolver: zodResolver(translationProjectSchema) as any,
    defaultValues: {
      bookId: prefillBookId ? Number(books.find(b => b.unique_identification_code === prefillBookId)?.id) : undefined,
      edition_id: undefined,
      translator_ids: prefillTranslatorId ? [Number(prefillTranslatorId)] : [],
      Status: "NOT_STARTED",
      cost: undefined,
      payment_status: "PENDING",
      currently_paid: 0,
      startDate: "",
      endDate: "",
      info: "",
    },
  });

  const onSubmit = async (data: TranslationProjectFormValues) => {
    try {
      const response = await createTranslationProject(data);

      if (response.success) {
        toast.success("Translation project created!");
        router.push(`${dashboardRoot}/production/translation_work`);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to create project.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Button variant="ghost" asChild className="mb-4 hover:bg-primarycolor/10 text-primarycolor font-bold p-0 h-auto hover:bg-transparent">
            <Link href={`${dashboardRoot}/production/translation_work`} className="flex items-center gap-2 group">
              <div className="size-8 rounded-full bg-primarycolor/10 flex items-center justify-center group-hover:bg-primarycolor group-hover:text-white transition-all">
                <ArrowLeft className="size-4" />
              </div>
              <span className="text-xs md:text-base">Back to Pipeline</span>
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg shadow-primarycolor/10">
              <PenTool className="size-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-primarycolor uppercase tracking-tight italic leading-none">
                New <span className="text-secondarycolor not-italic">Project</span>
              </h1>
              <p className="text-muted-foreground font-bold tracking-tight mt-1">Assign a title to a translator and set the timeline.</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-card rounded-2xl border-2 border-primarycolor/5 shadow-md">
          <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Ready for Assignment</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card rounded-[1.8rem] md:rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl overflow-hidden p-6 md:p-10 space-y-8 md:space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Book + Edition */}
          <div className="md:col-span-2">
            <Controller
              name="bookId"
              control={control}
              render={({ field: bookField }) => (
                <Controller
                  name="edition_id"
                  control={control}
                  render={({ field: editionField }) => (
                    <BookEditionPicker
                      books={books}
                      bookId={bookField.value}
                      editionId={editionField.value}
                      onChange={({ bookId, editionId }) => {
                        bookField.onChange(bookId);
                        editionField.onChange(editionId);
                      }}
                      bookError={errors.bookId?.message}
                      editionError={errors.edition_id?.message}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* Translator Selection (multiple allowed) */}
          <div className="space-y-3">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <User className="size-4 text-primarycolor" />
              Assign Translators
            </label>
            <Controller
              name="translator_ids"
              control={control}
              render={({ field }) => (
                <TranslatorMultiSelect
                  translators={translators}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Choose one or more translators..."
                  error={errors.translator_ids?.message as string | undefined}
                />
              )}
            />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">
              The first translator you pick is the lead.
            </p>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <Clock className="size-4 text-primarycolor" />
              Initial Status
            </label>
            <select
              {...register("Status")}
              className="w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl outline-none transition-all font-bold appearance-none cursor-pointer hover:bg-background"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="STARTED">Started</option>
              <option value="ONPROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Cost */}
          <div className="space-y-3">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <Banknote className="size-4 text-primarycolor" />
              Cost (ETB)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("cost")}
              placeholder="0.00"
              className="w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl outline-none transition-all font-bold"
            />
            {errors.cost && <p className="text-xs font-bold text-destructive ml-1">{errors.cost.message}</p>}
          </div>

          {/* Payment Status */}
          <div className="space-y-3">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <Clock className="size-4 text-primarycolor" />
              Payment Status
            </label>
            <select
              {...register("payment_status")}
              className="w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl outline-none transition-all font-bold appearance-none cursor-pointer hover:bg-background"
            >
              <option value="PENDING">Pending</option>
              <option value="CURRENTLY_PAID">Currently Paid</option>
              <option value="SUCCEEDED">Succeeded</option>
            </select>
          </div>

          {/* Currently Paid */}
          <div className="space-y-3">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <Banknote className="size-4 text-primarycolor" />
              Amount Paid (ETB)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("currently_paid")}
              placeholder="0.00"
              className="w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl outline-none transition-all font-bold"
            />
            {errors.currently_paid && <p className="text-xs font-bold text-destructive ml-1">{errors.currently_paid.message}</p>}
          </div>

          {/* Translation memo */}
          <div className="space-y-3 col-span-1 md:col-span-2">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <FileText className="size-4 text-primarycolor" />
              Translation Memo
            </label>
            <textarea
              {...register("info")}
              rows={4}
              placeholder="Notes about this translation work — scope, references, expectations..."
              className="w-full px-6 py-4 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl outline-none transition-all font-bold resize-y min-h-[120px]"
            />
            {errors.info && <p className="text-xs font-bold text-destructive ml-1">{errors.info.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2 pt-4 border-t-2 border-primarycolor/5">
            {/* Start Date */}
            <div className="space-y-3">
              <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="size-4 text-primarycolor" />
                Start Date
              </label>
              <DateInput
                {...register("startDate")}
                value={watch("startDate") ?? ""}
                className="h-14 px-6 bg-background/50 border-primarycolor/10 focus:border-primarycolor rounded-2xl font-bold"
              />
            </div>

            {/* End Date */}
            <div className="space-y-3">
              <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="size-4 text-secondarycolor" />
                Target Deadline
              </label>
              <DateInput
                {...register("endDate")}
                value={watch("endDate") ?? ""}
                className="h-14 px-6 bg-background/50 border-primarycolor/10 focus:border-primarycolor rounded-2xl font-bold"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="flex-1 h-12 md:h-16 rounded-xl md:rounded-2xl border-2 border-primarycolor/20 text-primarycolor font-black uppercase tracking-widest hover:bg-primarycolor/5 text-xs"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] h-14 md:h-16 bg-primarycolor hover:bg-secondarycolor text-white font-black rounded-xl md:rounded-2xl shadow-xl shadow-primarycolor/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            {isSubmitting ? (
              <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="size-5" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
