"use client";

import { Store, MapPin, Phone, Mail, Clock } from "lucide-react";

export function ProfileClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          Shop Profile
        </h1>
        <p className="text-sm font-semibold text-slate-400 mt-1">
          Retail shop information and settings
        </p>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primarycolor/5 overflow-hidden p-6 sm:p-10 space-y-8">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center shrink-0">
            <Store className="size-7 text-primarycolor" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              Bookland Retail Shop
            </h2>
            <p className="text-sm font-semibold text-slate-400 mt-0.5">
              Retail sales and inventory management
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <MapPin className="size-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Location
              </p>
              <p className="text-sm font-bold text-slate-700">Addis Ababa, Ethiopia</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Phone className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Phone
              </p>
              <p className="text-sm font-bold text-slate-700">+251 11 123 4567</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Mail className="size-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Email
              </p>
              <p className="text-sm font-bold text-slate-700">shop@bookland.et</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Clock className="size-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Hours
              </p>
              <p className="text-sm font-bold text-slate-700">Mon - Sat, 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
