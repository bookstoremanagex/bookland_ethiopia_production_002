"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail, ArrowRight } from "lucide-react";
import { loginAction } from "./actions/auth-actions";

export default function Home() {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primarycolor/10 via-gray-50 to-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-primarycolor/20 overflow-hidden border border-primarycolor/10 transition-all duration-500 hover:-translate-y-2 group/card">

        {/* Left Side - Creative Brand Presentation */}
        <div className="w-full md:w-5/12 bg-primarycolor p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 size-80 bg-black/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <BookOpen className="size-8 text-white" />
              </div>
              <span className="text-xl font-black tracking-widest uppercase">Book land Ethiopia</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-6 tracking-tight group-hover/card:scale-105 transition-transform duration-700 origin-left">
              Manage your <br /> inventory with <br /> ease.
            </h1>
            <p className="text-primarycolor/20 text-white/80 text-lg font-medium max-w-sm leading-relaxed">
              Access your dashboard to track sales, manage books, and oversee your entire store operations from one place.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-4">
              <div className="size-12 rounded-full bg-white/20 border-2 border-primarycolor backdrop-blur-sm flex items-center justify-center font-bold">JD</div>
              <div className="size-12 rounded-full bg-white/30 border-2 border-primarycolor backdrop-blur-sm flex items-center justify-center font-bold">AS</div>
              <div className="size-12 rounded-full bg-white/40 border-2 border-primarycolor backdrop-blur-sm flex items-center justify-center font-bold">MK</div>
            </div>
            <p className="mt-4 text-sm font-semibold text-white/80">Join your team on the dashboard</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="flex items-center gap-3 mb-8 md:hidden">
              <div className="bg-primarycolor/10 p-3 rounded-2xl">
                <BookOpen className="size-8 text-primarycolor" />
              </div>
              <span className="text-xl font-black tracking-widest text-primarycolor uppercase">Bookstore</span>
            </div>

            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-500 font-medium">Please enter your details to sign in</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-8 text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                <div className="size-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold shrink-0">!</div>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-primarycolor" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors" />
                  <input
                    className="pl-12 w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-primarycolor/30 hover:shadow-md focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/10 focus:shadow-lg focus:shadow-primarycolor/10 transition-all duration-300 text-gray-700 font-medium outline-none bg-gray-50/50 hover:bg-white focus:bg-white"
                    id="email"
                    type="email"
                    placeholder="admin@bookstore.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-gray-700 transition-colors group-focus-within:text-primarycolor" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primarycolor transition-colors" />
                  <input
                    className="pl-12 w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-primarycolor/30 hover:shadow-md focus:border-primarycolor focus:ring-4 focus:ring-primarycolor/10 focus:shadow-lg focus:shadow-primarycolor/10 transition-all duration-300 text-gray-700 font-medium outline-none bg-gray-50/50 hover:bg-white focus:bg-white"
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 mb-8">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="size-5 border-2 border-gray-300 rounded-md peer-checked:border-primarycolor peer-checked:bg-primarycolor transition-all"></div>
                    <svg className="absolute size-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                      <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-primarycolor hover:text-primarycolor/80 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                disabled={isLoading}
                className="w-full h-14 bg-primarycolor hover:bg-primarycolor/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primarycolor/30 hover:shadow-2xl hover:shadow-primarycolor/40 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primarycolor/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                type="submit"
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
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
