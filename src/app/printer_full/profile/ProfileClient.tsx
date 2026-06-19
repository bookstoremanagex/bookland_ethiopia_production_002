"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Loader2,
  LogOut,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfileData } from "./actions";
import { logoutAction } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";

export default function ProfileClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    createdAt: string;
  } | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await getProfileData();
      if (result.success && result.user) {
        setUser(result.user);
        setFetchError(false);
      } else {
        setFetchError(true);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 min-h-[60vh]">
        <div className="size-12 rounded-2xl bg-primarycolor/10 flex items-center justify-center animate-pulse">
          <Loader2 className="size-6 text-primarycolor animate-spin" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading profile...</span>
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 min-h-[60vh]">
        <div className="size-16 rounded-2xl bg-rose-50 flex items-center justify-center">
          <AlertTriangle className="size-8 text-rose-400" />
        </div>
        <h2 className="text-lg font-black text-slate-800">Could not load profile</h2>
        <p className="text-xs text-muted-foreground text-center max-w-sm">You need to be signed in to view your profile.</p>
        <Button onClick={() => router.push("/")} className="h-11 px-6 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-xs uppercase tracking-widest">
          Go to Sign In
        </Button>
      </div>
    );
  }

  const dateStr = mounted
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "...";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Profile</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">View your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Card */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="size-20 rounded-2xl bg-gradient-to-br from-primarycolor/20 to-secondarycolor/20 flex items-center justify-center text-primarycolor border border-primarycolor/10 shadow-sm">
                <span className="text-3xl font-black text-primarycolor">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-black text-lg text-slate-800">{user.name}</h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">{user.role}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[9px] font-bold text-slate-400 border border-slate-100">
                <Calendar className="size-3" />
                Since {dateStr}
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Account Status</p>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
                </div>
                <BadgeCheck className="size-4 text-emerald-500" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              {isLoggingOut ? "Logging out..." : "Sign Out"}
            </button>
          </div>

        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                <User className="size-5 text-primarycolor" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Account Details</h3>
                <p className="text-[10px] font-bold text-slate-400">Your personal information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="size-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <User className="size-4 text-sky-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Full Name</p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5 truncate">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="size-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Mail className="size-4 text-sky-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Shield className="size-4 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Role</p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5 truncate">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <BadgeCheck className="size-4 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</p>
                  <p className="font-bold text-sm text-emerald-600 mt-0.5">{user.status ? "Active" : "Inactive"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Calendar className="size-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Account Activity</h3>
                <p className="text-[10px] font-bold text-slate-400">Timeline and history</p>
              </div>
            </div>
            <div className="space-y-0">
              <div className="flex items-start gap-4 pb-6 border-l-2 border-primarycolor/20 pl-5 relative">
                <div className="absolute -left-[9.5px] top-0 size-4 rounded-full bg-primarycolor border-2 border-white shadow-sm" />
                <div>
                  <p className="text-sm font-bold text-slate-700">Account Created</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{dateStr}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-6 border-l-2 border-slate-200 pl-5 relative">
                <div className="absolute -left-[9.5px] top-0 size-4 rounded-full bg-slate-300 border-2 border-white" />
                <div>
                  <p className="text-sm font-bold text-slate-700">Profile Updated</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Most recent changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
