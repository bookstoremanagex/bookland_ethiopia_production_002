import { History, ArrowRight, User, Clock } from "lucide-react";
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

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:rounded-3xl">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primarycolor/10 text-primarycolor">
              <History className="size-5" strokeWidth={2} />
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
            className="rounded-xl border-primarycolor/20 font-medium text-primarycolor hover:bg-primarycolor/5"
          >
            View all
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-slate-100 px-4 py-2 sm:px-6">
        {activities.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col gap-2 py-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-primarycolor/5 flex items-center justify-center shrink-0">
                  <User className="size-4 text-primarycolor/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{activity.action}</p>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
