"use client";

import React, { useState, useEffect } from 'react';
import { useCalendar } from "@/lib/calendar-context";
import { User, Mail, Shield, Calendar, Save, Loader2, KeyRound, LogOut } from "lucide-react";
import { getProfileData, updateAdminProfile } from './actions';
import { logoutAction } from '@/app/actions/auth-actions';
import { useRouter } from 'next/navigation';

export default function ProfileClient() {
  const { formatDate } = useCalendar();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    createdAt: Date;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await getProfileData();
      if (result.success && result.user) {
        setUser(result.user);
        setFormData({
          name: result.user.name,
          email: result.user.email,
          password: ''
        });
        setFetchError(false);
      } else {
        setFetchError(true);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage(null);

    const result = await updateAdminProfile(user.id, formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-3 min-h-screen">
        <Loader2 className="size-8 text-primarycolor animate-spin" />
        <span className="font-bold text-secondarycolor">Loading profile...</span>
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4 min-h-screen">
        <Shield className="size-12 text-rose-400" />
        <h2 className="text-xl font-black text-secondarycolor uppercase tracking-tight">Could not load profile</h2>
        <p className="text-sm text-muted-foreground max-w-md">You need to be signed in to view your profile.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-2 h-11 px-6 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black text-xs uppercase tracking-widest transition-all"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-12 bg-[#F8FAFC] min-h-screen">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter italic">
          {user.role} <span className="text-secondarycolor not-italic">Profile</span>
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
          Manage your personal identity and account security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Stats & Identity */}
        <div className="space-y-8">
          <div className="bg-primarycolor p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <User className="size-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="size-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20">
                <Shield className="size-10 text-secondarycolor" />
              </div>
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">{user.name}</h2>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">{user.role}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
                <Calendar className="size-3" />
                <span className="text-[9px] font-bold uppercase">Member since {mounted ? formatDate(new Date(user.createdAt)) : '...'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/5 shadow-xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-primarycolor">Account Status</h3>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600/60 uppercase">Verified Admin</span>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              {isLoggingOut ? 'Logging out...' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border-2 border-primarycolor/5 shadow-2xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-secondarycolor transition-colors" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-secondarycolor/20 focus:bg-white outline-none font-bold text-primarycolor transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-secondarycolor transition-colors" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-secondarycolor/20 focus:bg-white outline-none font-bold text-primarycolor transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-primarycolor/40 uppercase tracking-widest ml-1">Change Password</label>
              <div className="relative group max-w-md">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-secondarycolor transition-colors" />
                <input
                  type="password"
                  placeholder="Enter new password to change..."
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-secondarycolor/20 focus:bg-white outline-none font-bold text-primarycolor transition-all placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-tight ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
              <button
                type="submit"
                disabled={isSaving}
                className="h-14 px-10 rounded-2xl bg-primarycolor text-white font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-primarycolor/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
              </button>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest max-w-[200px]">
                Last synchronized: {mounted ? new Date().toLocaleTimeString() : '...'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
