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
        <Loader2 className="size-6 text-primarycolor animate-spin" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading profile...</span>
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 min-h-[60vh]">
        <Shield className="size-10 text-rose-400" />
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500">Manage your personal identity and account security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-primarycolor/5 p-6 shadow-xl space-y-5">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor">
                <User className="size-7" />
              </div>
              <div>
                <h2 className="font-black text-lg text-slate-800">{user.name}</h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{user.role}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primarycolor/5 text-[9px] font-bold text-primarycolor/70">
                <Calendar className="size-3" />
                Since {dateStr}
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Account Status</p>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
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
              className="w-full h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              {isLoggingOut ? "Logging out..." : "Sign Out"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border-2 border-primarycolor/5 p-6 shadow-xl space-y-5">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Account Details</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                  <User className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Full Name</p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center text-primarycolor shrink-0">
                  <Shield className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Role</p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
