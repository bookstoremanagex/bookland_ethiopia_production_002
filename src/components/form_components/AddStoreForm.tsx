"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSchema, type StoreFormValues } from "@/lib/validation/store-schema";
import { createStore } from "@/app/actions/store-actions";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Building2, MapPin, Phone, Mail, CheckCircle2, Loader2, Store } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function AddStoreForm() {
  const router = useRouter();
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      location: "",
      phone: "",
      email: "",
      status: "available",
    },
  });

  const onSubmit = async (data: StoreFormValues) => {
    setIsSubmitting(true);
    const result = await createStore(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Store added successfully!");
      router.push(`${dashboardRoot}/stores`);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-20 rounded-3xl bg-primarycolor/10 text-primarycolor shadow-xl shadow-primarycolor/5 mb-2 group transition-all hover:scale-110">
          <Store className="size-10 group-hover:rotate-12 transition-transform" />
        </div>
        <h2 className="text-4xl font-black text-primarycolor uppercase italic tracking-tight">
          New <span className="text-secondarycolor not-italic">Store</span>
        </h2>
        <p className="text-muted-foreground font-bold text-lg max-w-md mx-auto leading-relaxed">
          Expand your reach. Register a new physical location in the system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info Card */}
        <div className="bg-card p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl shadow-primarycolor/5 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 size-32 bg-primarycolor/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

          <div className="flex items-center gap-4 border-b-2 border-primarycolor/5 pb-4 relative">
            <Building2 className="size-6 text-primarycolor" />
            <h3 className="text-xl font-black text-secondarycolor uppercase tracking-tight">Core Details</h3>
          </div>

          <div className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/60 ml-1">Store Name</label>
              <Input
                {...register("name")}
                placeholder="Central Plaza Bookstore"
                className={`h-14 rounded-2xl border-2 border-primarycolor/10 focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/5 transition-all text-lg font-bold px-6 ${errors.name ? 'border-destructive/50 focus:border-destructive' : ''}`}
              />
              {errors.name && <p className="text-destructive text-xs font-black mt-1 ml-2 uppercase">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/60 ml-1">Location / Address</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                <Input
                  {...register("location")}
                  placeholder="Street 123, Downtown"
                  className={`pl-14 h-14 rounded-2xl border-2 border-primarycolor/10 focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/5 transition-all text-lg font-bold ${errors.location ? 'border-destructive/50' : ''}`}
                />
              </div>
              {errors.location && <p className="text-destructive text-xs font-black mt-1 ml-2 uppercase">{errors.location.message}</p>}
            </div>
          </div>
        </div>

        {/* Contact & Status Card */}
        <div className="bg-card p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl shadow-primarycolor/5 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 size-32 bg-secondarycolor/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

          <div className="flex items-center gap-4 border-b-2 border-primarycolor/5 pb-4 relative">
            <Phone className="size-6 text-primarycolor" />
            <h3 className="text-xl font-black text-secondarycolor uppercase tracking-tight">Contact Info</h3>
          </div>

          <div className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/60 ml-1">Phone Number</label>
              <Input
                {...register("phone")}
                placeholder="+251 ..."
                className="h-14 rounded-2xl border-2 border-primarycolor/10 focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/5 transition-all text-lg font-bold px-6"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondarycolor/60 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-colors" />
                <Input
                  {...register("email")}
                  placeholder="store@example.com"
                  className={`pl-14 h-14 rounded-2xl border-2 border-primarycolor/10 focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/5 transition-all text-lg font-bold ${errors.email ? 'border-destructive/50' : ''}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs font-black mt-1 ml-2 uppercase">{errors.email.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Status Picker */}
      <div className="bg-primarycolor/5 p-8 rounded-[2.5rem] border-2 border-primarycolor/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-lg font-black text-secondarycolor uppercase tracking-tight">Operational Status</h4>
          <p className="text-sm font-bold text-muted-foreground">Is this store ready to receive inventory?</p>
        </div>
        <div className="flex gap-4 p-2 bg-background/50 rounded-2xl border-2 border-primarycolor/10">
          {["available", "closed", "maintenance"].map((s) => (
            <label key={s} className="relative group cursor-pointer">
              <input
                type="radio"
                {...register("status")}
                value={s}
                className="sr-only peer"
              />
              <div className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all peer-checked:bg-primarycolor peer-checked:text-white hover:bg-primarycolor/5 text-secondarycolor/40 peer-checked:shadow-lg peer-checked:shadow-primarycolor/20">
                {s}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-48 h-16 rounded-2xl border-2 border-primarycolor/20 text-primarycolor font-black uppercase tracking-widest hover:bg-primarycolor/5 active:scale-95 transition-all text-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-80 h-16 rounded-2xl bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-primarycolor/30 active:scale-95 transition-all text-sm group relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center gap-3">
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-5 transition-transform group-hover:scale-110" />
                Register Store
              </>
            )}
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </div>
    </form>
  );
}
