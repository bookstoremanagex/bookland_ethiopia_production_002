"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { translatorSchema, type TranslatorFormValues } from "../../lib/validation/translator-schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { createTranslator } from "../../app/actions/translator-actions";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AddTranslatorForm() {
  const router = useRouter();
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TranslatorFormValues>({
    resolver: zodResolver(translatorSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: TranslatorFormValues) => {
    try {
      const response = await createTranslator(data);

      if (response.success) {
        toast.success("Translator added successfully!");
        router.push(`${dashboardRoot}/production/translators`);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to add translator.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 md:mb-8">
        <Button variant="ghost" asChild className="mb-4 hover:bg-primarycolor/10 text-primarycolor font-bold p-0 md:p-4 h-auto md:h-10">
          <Link href={`${dashboardRoot}/production/translators`} className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            <span className="text-xs md:text-sm">Back to Translators</span>
          </Link>
        </Button>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shadow-lg shadow-primarycolor/10 shrink-0">
            <UserPlus className="size-6 md:size-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-4xl font-black text-primarycolor uppercase tracking-tight italic leading-tight">
              Register <span className="text-secondarycolor not-italic">Translator</span>
            </h1>
            <p className="text-muted-foreground font-medium text-[10px] md:text-sm">Add a new creative member to your hub.</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card rounded-[1.8rem] md:rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl overflow-hidden transition-all duration-300 hover:border-primarycolor/20 p-6 md:p-10 space-y-6 md:space-y-10"
      >
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2 group">
            <label htmlFor="name" className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="Enter translator's full name"
              {...register("name")}
              className="h-14 px-6 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all text-lg font-medium"
            />
            {errors.name && (
              <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2 group">
              <label htmlFor="email" className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. name@example.com"
                {...register("email")}
                className="h-14 px-6 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all"
              />
              {errors.email && (
                <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2 group">
              <label htmlFor="phoneNumber" className="text-sm font-black text-secondarycolor uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                placeholder="e.g. +251..."
                {...register("phoneNumber")}
                className="h-14 px-6 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="flex-1 h-12 md:h-16 rounded-xl md:rounded-2xl border-2 border-primarycolor/20 text-primarycolor font-black uppercase tracking-widest hover:bg-primarycolor/5 transition-all text-xs"
          >
            Clear
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] h-14 md:h-16 bg-primarycolor hover:bg-secondarycolor text-white font-black rounded-xl md:rounded-2xl shadow-xl shadow-primarycolor/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            {isSubmitting ? (
              <>
                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="size-5" />
                Register Translator
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
