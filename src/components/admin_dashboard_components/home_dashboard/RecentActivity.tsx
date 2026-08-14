import { History, ArrowRight, User, Clock, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentActivityProps {
  activities: {
    id: number;
    action: string;
    accountName: string;
    date: string;
  }[];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white gradient-shadow lg:rounded-3xl">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor lg:rounded-t-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)" }} aria-hidden />

      <div className="relative flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30">
              <History className="size-5" strokeWidth={2} />
              <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-white ring-1 ring-primarycolor/20">
                <Activity className="size-2.5 text-primarycolor" />
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                Activity Log
              </h2>
              <p className="text-sm text-slate-600">
                Latest actions across the system.
              </p>
            </div>
          </div>
        </div>
        <Link href="/admin_dashboard/activity_log" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="group/btn rounded-xl border-primarycolor/20 font-medium text-primarycolor hover:bg-primarycolor hover:text-white transition-all duration-300"
          >
            View all
            <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </div>

      <div className="relative px-4 py-4 sm:px-6">
        {activities.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          <div className="relative">
            {/* timeline rail */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primarycolor via-tertiarycolor to-transparent" aria-hidden />
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group/item relative flex items-start gap-3 rounded-xl p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-primarycolor/5 hover:to-transparent hover:translate-x-1"
                >
                  {/* node */}
                  <div className="relative z-10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primarycolor to-secondarycolor text-[10px] font-black text-white ring-2 ring-white shadow-md shadow-primarycolor/30 transition-transform duration-300 group-hover/item:scale-110">
                    {initials(activity.accountName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 transition-colors group-hover/item:text-primarycolor">
                      {activity.action}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <User className="size-3" />
                        {activity.accountName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {activity.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}