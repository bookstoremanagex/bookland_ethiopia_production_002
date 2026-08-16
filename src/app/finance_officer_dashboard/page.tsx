import { getAllShopsDebt } from "@/app/actions/order-actions";
import { formatLongServer } from "@/lib/server-calendar";
import {
  Calendar,
  ShieldCheck,
  Building2,
  Banknote,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FinanceHomePage() {
  const today = await formatLongServer(new Date());

  const res = await getAllShopsDebt();
  const data = (res.success ? res.data || [] : [])
    .slice()
    .sort((a, b) => b.totalDebt - a.totalDebt);

  const totalOrderDebt = data.reduce((sum, s) => sum + s.orderDebt, 0);
  const totalRoundDebt = data.reduce((sum, s) => sum + s.roundDebt, 0);
  const totalPreviousDebt = data.reduce((sum, s) => sum + s.previousDebt, 0);
  const totalDebt = totalOrderDebt + totalRoundDebt + totalPreviousDebt;
  const shopsWithDebt = data.filter((s) => s.totalDebt > 0).length;
  const topDebtors = data.slice(0, 5);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-primarycolor/[0.04]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="space-y-8 lg:space-y-10">
          {/* Welcome Hero */}
          <header className="relative overflow-hidden rounded-2xl border border-primarycolor/20 bg-gradient-to-br from-primarycolor via-secondarycolor to-quaternarycolor p-6 gradient-shadow-lg sm:p-8 lg:rounded-3xl lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-25" style={{ background: "radial-gradient(circle at center, #B0E4CC, transparent 70%)" }} />
            <div className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle at center, #059669, transparent 70%)" }} />
            <div className="pointer-events-none absolute right-[12%] bottom-[-40%] size-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle at center, #FFFFFF, transparent 70%)" }} />
            <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                  <ShieldCheck className="size-3.5 shrink-0 text-tertiarycolor" aria-hidden />
                  <span>Finance Officer Overview</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Welcome back
                  </h1>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-white/70">
                    Here is a snapshot of shop receivables, outstanding debts, and collections — all in one place.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <Calendar className="size-4 text-tertiarycolor" aria-hidden />
                    {today}
                  </span>
                  <span className="hidden h-4 w-px bg-white/20 sm:inline" aria-hidden />
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
                    </span>
                    All systems operational
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest text-tertiarycolor">Shops with debt</p>
                  <p className="mt-1 text-2xl font-black tabular-nums text-white">{shopsWithDebt}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest text-tertiarycolor">Total receivable</p>
                  <p className="mt-1 text-2xl font-black tabular-nums text-white">{totalDebt.toLocaleString()} <span className="text-sm font-bold text-tertiarycolor">ETB</span></p>
                </div>
              </div>
            </div>
          </header>

          {/* Payments Due Preview */}
          <section className="relative overflow-hidden rounded-2xl border border-primarycolor/10 bg-white p-5 gradient-shadow sm:p-6 lg:rounded-3xl lg:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)" }} aria-hidden />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30">
                  <Banknote className="size-5" />
                  <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white">
                    {topDebtors.length}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-slate-900">
                    Payments <span className="bg-gradient-to-r from-primarycolor to-secondarycolor bg-clip-text text-transparent">Due</span>
                  </h2>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    Top outstanding debts
                  </p>
                </div>
              </div>
              <Link
                href="/finance_officer_dashboard/payments-due"
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-primarycolor to-secondarycolor text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primarycolor/30 hover:shadow-xl hover:shadow-primarycolor/40 hover:brightness-110 active:scale-[0.98] transition-all duration-300"
              >
                View All <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Totals chips */}
            <div className="relative flex flex-wrap items-center gap-3 mb-5">
              <div className="rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-amber-600/70">Order Debt</p>
                <p className="text-sm font-black text-amber-600">{totalOrderDebt.toLocaleString()} <span className="text-[9px] opacity-50">ETB</span></p>
              </div>
              <div className="rounded-2xl border border-rose-200/60 bg-rose-50 px-4 py-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-rose-600/70">Round Debt</p>
                <p className="text-sm font-black text-rose-500">{totalRoundDebt.toLocaleString()} <span className="text-[9px] opacity-50">ETB</span></p>
              </div>
              <div className="rounded-2xl border border-purple-200/60 bg-purple-50 px-4 py-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-purple-600/70">Prev. Debt</p>
                <p className="text-sm font-black text-purple-500">{totalPreviousDebt.toLocaleString()} <span className="text-[9px] opacity-50">ETB</span></p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total Debt</p>
                <p className="text-sm font-black text-slate-800">{totalDebt.toLocaleString()} <span className="text-[9px] opacity-50">ETB</span></p>
              </div>
            </div>

            {topDebtors.length === 0 ? (
              <div className="relative flex flex-col items-center justify-center py-16 text-muted-foreground">
                <TrendingUp className="size-14 mb-3 opacity-20" />
                <p className="text-base font-bold uppercase tracking-widest">No outstanding debts</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-muted-foreground/70">All shops are settled</p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-primarycolor/5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px]">
                    <thead>
                      <tr className="border-b border-primarycolor/10 bg-slate-50/80">
                        <th className="text-left px-5 py-4 text-[9px] font-black uppercase tracking-widest text-primarycolor/40">Shop Name</th>
                        <th className="text-right px-5 py-4 text-[9px] font-black uppercase tracking-widest text-primarycolor/40">Order Debt</th>
                        <th className="text-right px-5 py-4 text-[9px] font-black uppercase tracking-widest text-primarycolor/40">Round Debt</th>
                        <th className="text-right px-5 py-4 text-[9px] font-black uppercase tracking-widest text-primarycolor/40">Prev. Debt</th>
                        <th className="text-right px-5 py-4 text-[9px] font-black uppercase tracking-widest text-primarycolor/40">Total Debt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDebtors.map((shop) => (
                        <tr key={shop.id} className="border-b border-primarycolor/5 last:border-0 hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center text-primarycolor shrink-0">
                                <Building2 className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-black text-primarycolor uppercase text-xs truncate">{shop.name}</div>
                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{shop.branch || "Main Branch"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-right text-amber-600">{shop.orderDebt.toLocaleString()}</td>
                          <td className="px-5 py-4 text-sm font-bold text-right text-rose-500">{shop.roundDebt.toLocaleString()}</td>
                          <td className="px-5 py-4 text-sm font-bold text-right text-purple-500">{shop.previousDebt.toLocaleString()}</td>
                          <td className={`px-5 py-4 text-sm font-black text-right ${shop.totalDebt > 0 ? "text-slate-800" : "text-emerald-600"}`}>
                            {shop.totalDebt.toLocaleString()}
                            {shop.totalDebt > 0 && <AlertCircle className="inline-block size-3.5 ml-1.5 text-rose-500" aria-hidden />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}