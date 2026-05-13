"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { translationProjectSchema, type TranslationProjectFormValues } from "../../lib/validation/translation-project-schema";
import { createTranslationProject } from "../../app/actions/translation-project-actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Controller } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { ArrowLeft, BookOpen, Calendar, Check, ChevronsUpDown, Clock, PenTool, Plus, User } from "lucide-react";

interface NewTranslationProjectFormProps {
  books: { id: number; title: string; unique_identification_code: string }[];
  translators: { id: number; name: string }[];
}

export function NewTranslationProjectForm({ books, translators }: NewTranslationProjectFormProps) {
  const [bookOpen, setBookOpen] = React.useState(false);
  const [translatorOpen, setTranslatorOpen] = React.useState(false);
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TranslationProjectFormValues>({
    resolver: zodResolver(translationProjectSchema) as any,
    defaultValues: {
      bookId: prefillBookId ? Number(books.find(b => b.unique_identification_code === prefillBookId)?.id) : undefined,
      translator_id: prefillTranslatorId ? Number(prefillTranslatorId) : undefined,
      Status: "NOT_STARTED",
      startDate: "",
      endDate: "",
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
          {/* Book Selection */}
          <div className="space-y-3">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <BookOpen className="size-4 text-primarycolor" />
              Select Book
            </label>
            <Controller
              name="bookId"
              control={control}
              render={({ field }) => (
                <Popover open={bookOpen} onOpenChange={setBookOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl justify-between font-bold",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? books.find((book) => book.id === field.value)?.title
                        : "Choose a book..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl">
                    <Command className="rounded-2xl">
                      <CommandInput placeholder="Search books..." className="h-12" />
                      <CommandList className="max-h-[240px]"> {/* ~5 items at 48px each */}
                        <CommandEmpty>No book found.</CommandEmpty>
                        <CommandGroup>
                          {books.map((book) => (
                            <CommandItem
                              key={book.id}
                              value={book.title}
                              onSelect={() => {
                                setValue("bookId", book.id);
                                setBookOpen(false);
                              }}
                              className="h-12 px-4 font-bold text-secondarycolor hover:bg-primarycolor/10 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primarycolor",
                                  field.value === book.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="line-clamp-1">{book.title}</span>
                                <span className="text-[10px] opacity-50">{book.unique_identification_code}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.bookId && <p className="text-xs font-bold text-destructive ml-1">{errors.bookId.message}</p>}
          </div>

          {/* Translator Selection */}
          <div className="space-y-3">
            <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
              <User className="size-4 text-primarycolor" />
              Assign Translator
            </label>
            <Controller
              name="translator_id"
              control={control}
              render={({ field }) => (
                <Popover open={translatorOpen} onOpenChange={setTranslatorOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full h-14 px-6 bg-background/50 border-2 border-primarycolor/10 focus:border-primarycolor rounded-2xl justify-between font-bold",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? translators.find((t) => t.id === field.value)?.name
                        : "Choose a translator..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-2 border-primarycolor/10 shadow-2xl">
                    <Command className="rounded-2xl">
                      <CommandInput placeholder="Search translators..." className="h-12" />
                      <CommandList className="max-h-[240px]">
                        <CommandEmpty>No translator found.</CommandEmpty>
                        <CommandGroup>
                          {translators.map((t) => (
                            <CommandItem
                              key={t.id}
                              value={t.name}
                              onSelect={() => {
                                setValue("translator_id", t.id);
                                setTranslatorOpen(false);
                              }}
                              className="h-12 px-4 font-bold text-secondarycolor hover:bg-primarycolor/10 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primarycolor",
                                  field.value === t.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {t.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.translator_id && <p className="text-xs font-bold text-destructive ml-1">{errors.translator_id.message}</p>}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2 pt-4 border-t-2 border-primarycolor/5">
            {/* Start Date */}
            <div className="space-y-3">
              <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="size-4 text-primarycolor" />
                Start Date
              </label>
              <Input
                type="date"
                {...register("startDate")}
                className="h-14 px-6 bg-background/50 border-primarycolor/10 focus:border-primarycolor rounded-2xl font-bold"
              />
            </div>

            {/* End Date */}
            <div className="space-y-3">
              <label className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="size-4 text-secondarycolor" />
                Target Deadline
              </label>
              <Input
                type="date"
                {...register("endDate")}
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
