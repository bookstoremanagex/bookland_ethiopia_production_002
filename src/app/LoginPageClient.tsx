"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { loginAction } from "./actions/auth-actions";
import { toast } from "sonner";

type LoginPageClientProps = {
  printerName: string | null;
  printerFetchFailed: boolean;
  databaseUrl: string;
};

export default function LoginPageClient({
  printerName,
  printerFetchFailed,
  databaseUrl,
}: LoginPageClientProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginAction(email, password);

      if (result.success && result.redirectPath) {
        router.push(result.redirectPath);
      } else {
        setError(result.error || "Invalid email or password");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-3 sm:p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 bg-gray-900 rounded-[2rem] shadow-2xl shadow-black/50 overflow-hidden border border-gray-800/50">

        {/* Left Panel - Brand */}
        <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-primarycolor/90 via-primarycolor to-primarycolor/80 p-10 lg:p-12 relative overflow-hidden flex-col justify-between">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-black/10 blur-3xl" />
          <div className="absolute top-1/3 -left-10 size-24 rounded-full border border-white/10" />
          <div className="absolute bottom-1/4 right-8 size-16 rounded-lg rotate-45 border border-white/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/10">
                <BookOpen className="size-6 text-white" />
              </div>
              <span className="text-lg font-black tracking-widest uppercase text-white/90">Book Land Ethiopia</span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/60">
              <Sparkles className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Management System</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="md:col-span-3 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto space-y-8">
            {/* Mobile Header */}
            <div className="flex items-center gap-3 md:hidden">
              <div className="size-10 rounded-xl bg-primarycolor/15 flex items-center justify-center">
                <BookOpen className="size-5 text-primarycolor" />
              </div>
              <div>
                <span className="text-sm font-black tracking-wider text-white uppercase">Book Land Ethiopia</span>
                <p className="text-[9px] font-semibold text-white/30 uppercase tracking-widest">Management System</p>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Sign in</h1>
              <p className="text-sm text-gray-500 font-medium">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/30 text-red-400 p-4 rounded-xl text-sm font-medium flex items-start gap-3">
                <div className="size-5 rounded-full bg-red-900/50 flex items-center justify-center text-red-400 font-bold shrink-0 mt-0.5 text-xs">!</div>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="email">Email or Phone</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-600 group-focus-within:text-primarycolor transition-colors" />
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm font-medium outline-none transition-all placeholder:text-gray-600 focus:border-primarycolor/50 focus:bg-gray-800 focus:ring-2 focus:ring-primarycolor/10"
                    id="email"
                    type="text"
                    placeholder="email@bookstore.com or phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="password">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-600 group-focus-within:text-primarycolor transition-colors" />
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm font-medium outline-none transition-all placeholder:text-gray-600 focus:border-primarycolor/50 focus:bg-gray-800 focus:ring-2 focus:ring-primarycolor/10"
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Contact the admin!");
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-primarycolor transition-colors bg-transparent border-none p-0 outline-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                disabled={isLoading}
                className="w-full h-12 bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primarycolor/20 hover:shadow-xl hover:shadow-primarycolor/30 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primarycolor/30 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
                type="submit"
              >
                {isLoading ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
