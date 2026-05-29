"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookSchema,
  type BookFormValues,
} from "../../lib/validation/book-schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import {
  createBook,
  uploadBookImageAction,
} from "../../app/actions/book-actions";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AddBookFormProps {
  className?: string;
}

export function AddBookForm({ className }: AddBookFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dashboardRoot = pathname.split("/").slice(0, 2).join("/");

  const [imageType, setImageType] = React.useState<"upload" | "link">("upload");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("File size must be less than 4MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      pen_name: "",
      isbn: "",
      copyright_registration_number: "",
      translator: "",
      designer: "",
      language: "",
      edition: "",
      category: "",
      publication_year: "",
      print_batch_id: "",
      number_of_pages: null,
      info: "",
      book_image_url: "",
      translator_cost: null,
      cover_design_cost: null,
      text_design_cost: null,
      editor_cost: null,
      typewriting_cost: null,
      store_cost: null,
      distribution_cost: null,
      advertisement_cost: null,
      purchasing_right_cost: null,
      status: "available",
      productionstatus: "ON_PRODUCTION",
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    setIsUploading(true);
    try {
      let finalImageUrl = data.book_image_url || "";

      if (imageType === "upload" && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await uploadBookImageAction(formData);
        if (!uploadRes.success) {
          toast.error(uploadRes.error || "Failed to upload cover image");
          setIsUploading(false);
          return;
        }
        finalImageUrl = uploadRes.url || "";
      }

      const costFields = ['translator_cost','cover_design_cost','text_design_cost','editor_cost','typewriting_cost','store_cost','distribution_cost','advertisement_cost','purchasing_right_cost'] as const;
      const sanitizedData = { ...data } as any;
      for (const field of costFields) {
        if (sanitizedData[field] === undefined || sanitizedData[field] === null || Number.isNaN(Number(sanitizedData[field]))) {
          sanitizedData[field] = null;
        }
      }

      const response = await createBook({
        ...sanitizedData,
        book_image_url: finalImageUrl,
      });

      if (response.success) {
        toast.success("Book added successfully!");
        reset();
        setImageFile(null);
        setImagePreview(null);
        router.push(`${dashboardRoot}/books`);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to add book. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "w-full max-w-4xl bg-card rounded-2xl border-2 border-primarycolor/10 shadow-2xl overflow-hidden transition-all duration-300 hover:border-primarycolor/20",
          className,
        )}
      >
        {/* Header Section */}
        <div className="p-6 md:p-10 bg-linear-to-br from-primarycolor/5 to-secondarycolor/10 border-b border-primarycolor/10">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-primarycolor uppercase italic italic">
              Add <span className="text-secondarycolor not-italic">Book</span>
            </h2>
            <p className="text-muted-foreground font-bold text-[10px] md:text-sm uppercase tracking-widest opacity-60">
              Register a new addition to your collection.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-6 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Title */}
            <div className="space-y-2 group">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                placeholder="Enter book title"
                {...register("title")}
                aria-invalid={!!errors.title}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
              {errors.title && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2 group">
              <label
                htmlFor="author"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Author <span className="text-destructive">*</span>
              </label>
              <Input
                id="author"
                placeholder="Enter author name"
                {...register("author")}
                aria-invalid={!!errors.author}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
              {errors.author && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* Pen Name */}
            <div className="space-y-2 group">
              <label
                htmlFor="pen_name"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Pen Name
              </label>
              <Input
                id="pen_name"
                placeholder="Enter pen name"
                {...register("pen_name")}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
            </div>

            {/* ISBN */}
            <div className="space-y-2 group">
              <label
                htmlFor="isbn"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                ISBN
              </label>
              <Input
                id="isbn"
                placeholder="e.g. 978-3-16-148410-0"
                {...register("isbn")}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
            </div>

            {/* Copyright Registration Number */}
            <div className="space-y-2 group">
              <label
                htmlFor="copyright_registration_number"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Copyright Registration Number
              </label>
              <Input
                id="copyright_registration_number"
                placeholder="e.g. CR-2024-001234"
                {...register("copyright_registration_number")}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
            </div>

            {/* Language */}
            <div className="space-y-2 group">
              <label
                htmlFor="language"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Language
              </label>
              <Input
                id="language"
                placeholder="e.g. English, Amharic"
                {...register("language")}
                aria-invalid={!!errors.language}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
              {errors.language && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.language.message}
                </p>
              )}
            </div>

            {/* Edition */}
            <div className="space-y-2 group">
              <label
                htmlFor="edition"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Edition
              </label>
              <Input
                id="edition"
                placeholder="e.g. 1st Edition"
                {...register("edition")}
                aria-invalid={!!errors.edition}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
              {errors.edition && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.edition.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2 group">
              <label
                htmlFor="category"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Category <span className="text-destructive">*</span>
              </label>
              <Input
                id="category"
                placeholder="e.g. Fiction, Science"
                {...register("category")}
                aria-invalid={!!errors.category}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
              {errors.category && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Publication Year */}
            <div className="space-y-2 group">
              <label
                htmlFor="publication_year"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Publication Year <span className="text-destructive">*</span>
              </label>
              <Input
                id="publication_year"
                placeholder="e.g. 2024"
                {...register("publication_year")}
                aria-invalid={!!errors.publication_year}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
              {errors.publication_year && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.publication_year.message}
                </p>
              )}
            </div>

            {/* Number of Pages */}
            <div className="space-y-2 group">
              <label
                htmlFor="number_of_pages"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Number of Pages
              </label>
              <Input
                id="number_of_pages"
                type="number"
                placeholder="0"
                {...register("number_of_pages", { valueAsNumber: true })}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
            </div>

            {/* Translator */}
            <div className="space-y-2 group">
              <label
                htmlFor="translator"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Translator
              </label>
              <Input
                id="translator"
                placeholder="Enter translator name"
                {...register("translator")}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
            </div>

            {/* Designer */}
            <div className="space-y-2 group">
              <label
                htmlFor="designer"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Designer
              </label>
              <Input
                id="designer"
                placeholder="Enter designer name"
                {...register("designer")}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
            </div>

            {/* Print Batch ID */}
            <div className="space-y-2 group">
              <label
                htmlFor="print_batch_id"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Print Batch ID
              </label>
              <Input
                id="print_batch_id"
                placeholder="Batch ID"
                {...register("print_batch_id")}
                className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20"
              />
            </div>

            {/* Status */}
            <div className="space-y-2 group">
              <label
                htmlFor="status"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="flex h-9 w-full items-center justify-between rounded-lg border-2 border-primarycolor/20 bg-background px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:border-primarycolor focus:ring-2 focus:ring-primarycolor/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="available">Available</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            {/* Production Status */}
            <div className="space-y-2 group">
              <label
                htmlFor="productionstatus"
                className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
              >
                Production Status
              </label>
              <select
                id="productionstatus"
                {...register("productionstatus")}
                className="flex h-9 w-full items-center justify-between rounded-lg border-2 border-primarycolor/20 bg-background px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:border-primarycolor focus:ring-2 focus:ring-primarycolor/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="ON_PRODUCTION">On Production</option>
                <option value="TRANSLATION">Translation</option>
                <option value="DESIGN">Design</option>
                <option value="PRINTING">Printing</option>
                <option value="PREPRINTING">Pre-printing</option>
                <option value="DISTRIBUTION">Distribution</option>
                <option value="SALES">Sales</option>
              </select>
            </div>
          </div>

          {/* Cover Image Selection Options */}
          <div className="space-y-4 border-2 border-primarycolor/10 rounded-2xl p-6 bg-primarycolor/5">
            <label className="text-sm font-semibold text-secondarycolor block">
              Book Cover Image
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setImageType("upload")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
                  imageType === "upload"
                    ? "bg-primarycolor text-white border-primarycolor"
                    : "bg-white text-primarycolor/70 border-primarycolor/10 hover:border-primarycolor/20",
                )}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageType("link")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
                  imageType === "link"
                    ? "bg-primarycolor text-white border-primarycolor"
                    : "bg-white text-primarycolor/70 border-primarycolor/10 hover:border-primarycolor/20",
                )}
              >
                Provide Link
              </button>
            </div>

            {imageType === "upload" ? (
              <div className="space-y-4">
                <div
                  className={cn(
                    "border-2 border-dashed border-primarycolor/20 rounded-xl p-8 text-center bg-white cursor-pointer hover:border-primarycolor/40 transition-colors relative flex flex-col items-center justify-center min-h-[160px]",
                    imageFile && "border-solid border-primarycolor/30",
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-36 object-cover rounded-lg shadow-md border-2 border-primarycolor/10"
                      />
                      <span className="text-xs font-bold text-secondarycolor/80 bg-primarycolor/5 px-3 py-1 rounded-full">
                        {imageFile?.name} ({(imageFile!.size / 1024).toFixed(1)}{" "}
                        KB)
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-primarycolor font-black text-2xl uppercase tracking-widest">
                        +
                      </div>
                      <div className="text-sm font-bold text-secondarycolor">
                        Click to upload cover image
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold">
                        Supports JPG, PNG, WEBP (Max 4MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2 group">
                <Input
                  id="book_image_url"
                  placeholder="https://example.com/image.jpg"
                  {...register("book_image_url")}
                  className="border-primarycolor/20 focus:border-primarycolor focus:ring-primarycolor/20 h-12"
                />
              </div>
            )}
          </div>

          {/* Production Costs */}
          <div className="space-y-6 border-2 border-primarycolor/10 rounded-2xl p-6 bg-primarycolor/5">
            <label className="text-sm font-semibold text-secondarycolor block">
              Production Costs
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
              <div className="space-y-1.5 group">
                <label htmlFor="translator_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Translator</label>
                <Input id="translator_cost" type="number" step="0.01" placeholder="0.00" {...register("translator_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="cover_design_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Cover Design</label>
                <Input id="cover_design_cost" type="number" step="0.01" placeholder="0.00" {...register("cover_design_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="text_design_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Text Design</label>
                <Input id="text_design_cost" type="number" step="0.01" placeholder="0.00" {...register("text_design_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="editor_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Editor</label>
                <Input id="editor_cost" type="number" step="0.01" placeholder="0.00" {...register("editor_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="typewriting_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Typewriting</label>
                <Input id="typewriting_cost" type="number" step="0.01" placeholder="0.00" {...register("typewriting_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="store_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Store Cost</label>
                <Input id="store_cost" type="number" step="0.01" placeholder="0.00" {...register("store_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="distribution_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Distribution</label>
                <Input id="distribution_cost" type="number" step="0.01" placeholder="0.00" {...register("distribution_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="advertisement_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Advertisement</label>
                <Input id="advertisement_cost" type="number" step="0.01" placeholder="0.00" {...register("advertisement_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
              <div className="space-y-1.5 group">
                <label htmlFor="purchasing_right_cost" className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60 ml-1">Purchasing Right</label>
                <Input id="purchasing_right_cost" type="number" step="0.01" placeholder="0.00" {...register("purchasing_right_cost", { valueAsNumber: true })} className="border-primarycolor/20 focus:border-primarycolor h-11 px-4 rounded-xl font-bold text-sm" />
              </div>
            </div>
          </div>

          {/* Info / Description */}
          <div className="space-y-2 group">
            <label
              htmlFor="info"
              className="text-sm font-semibold text-secondarycolor transition-colors group-focus-within:text-primarycolor"
            >
              Additional Information
            </label>
            <textarea
              id="info"
              rows={4}
              placeholder="Provide a brief description or additional info about the book..."
              {...register("info")}
              className="flex min-h-[100px] w-full rounded-lg border-2 border-primarycolor/20 bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground transition-all focus-visible:outline-none focus-visible:border-primarycolor focus-visible:ring-2 focus-visible:ring-primarycolor/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setImageFile(null);
                setImagePreview(null);
              }}
              disabled={isSubmitting || isUploading}
              className="h-14 px-6 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] md:text-xs"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="h-14 px-10 bg-primarycolor hover:bg-secondarycolor text-white font-black rounded-xl md:rounded-2xl shadow-xl shadow-primarycolor/20 transition-all duration-300 transform active:scale-95 uppercase tracking-widest text-[10px] md:text-xs"
            >
              {isSubmitting || isUploading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isUploading && !isSubmitting
                    ? "Uploading image..."
                    : "Adding..."}
                </div>
              ) : (
                "Save Book"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
