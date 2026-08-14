"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Boxes } from "lucide-react";

interface ProductionOverviewProps {
  data: {
    status: string;
    count: number;
    fill: string;
  }[];
}

const chartConfig = {
  count: {
    label: "Books",
  },
} satisfies ChartConfig;

export function ProductionOverview({ data }: ProductionOverviewProps) {
  const total = data.reduce((sum, d) => sum + (d.count || 0), 0);
  const top = data.reduce(
    (acc, d) => (d.count > acc.count ? d : acc),
    { status: "-", count: 0 }
  );
  const topPct = total > 0 ? Math.round((top.count / total) * 100) : 0;

  return (
    <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white gradient-shadow lg:rounded-3xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor" aria-hidden />
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)" }} aria-hidden />

      <CardHeader className="relative space-y-1 border-b border-slate-100 px-6 pb-4 pt-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Production pipeline
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-slate-600">
              Titles distributed across production states.
            </CardDescription>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30">
            <Boxes className="size-5" strokeWidth={2} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-1 flex-col px-4 pb-6 pt-2 sm:px-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px] w-full sm:max-h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={72}
              outerRadius={105}
              strokeWidth={2}
              stroke="#fff"
              paddingAngle={3}
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          {data.map((entry) => (
            <span key={entry.status} className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
              <span className="size-2 rounded-full" style={{ background: entry.fill }} />
              {entry.status}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-primarycolor/5 to-transparent p-3 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total copies</p>
            <p className="text-lg font-black tabular-nums text-slate-900">{total.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-primarycolor/5 to-transparent p-3 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Top store</p>
            <p className="truncate text-sm font-black text-primarycolor" title={top.status}>{top.status}</p>
            <p className="text-[9px] font-bold text-slate-500">{topPct}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}