"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Cell,
  YAxis,
} from "recharts";
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
import { TrendingUp } from "lucide-react";

interface FinancialChartProps {
  data: {
    name: string;
    orders: number;
  }[];
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--color-primarycolor)",
  },
} satisfies ChartConfig;

export function FinancialChart({ data }: FinancialChartProps) {
  const total = data.reduce((sum, d) => sum + (d.orders || 0), 0);
  const best = data.reduce((acc, d) => (d.orders > acc.orders ? d : acc), { name: "-", orders: 0 });

  return (
    <Card className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white gradient-shadow lg:rounded-3xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primarycolor via-tertiarycolor to-secondarycolor" aria-hidden />
      <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle at center, var(--color-primarycolor), transparent 70%)" }} aria-hidden />

      <CardHeader className="relative space-y-1 border-b border-slate-100 px-6 pb-4 pt-6 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Orders by Day
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-slate-600">
              Approved orders over the last 30 days.
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">30-day total</span>
              <span className="text-xl font-black tabular-nums bg-gradient-to-r from-primarycolor to-secondarycolor bg-clip-text text-transparent">
                {total.toLocaleString()}
              </span>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primarycolor to-secondarycolor text-white shadow-lg shadow-primarycolor/30">
              <TrendingUp className="size-5" strokeWidth={2} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-4 pb-6 pt-4 sm:px-8 sm:pb-8">
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full sm:min-h-[300px]">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#408A71" />
                <stop offset="100%" stopColor="#285A48" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis hide />
            <ChartTooltip cursor={{ fill: "rgba(64, 138, 113, 0.08)" }} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar
              dataKey="orders"
              radius={[6, 6, 0, 0]}
              name="Orders"
              fill="url(#barGradient)"
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill="url(#barGradient)"
                  fillOpacity={entry.orders === best.orders ? 1 : 0.45}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-gradient-to-b from-primarycolor to-secondarycolor" /> Orders
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-primarycolor/45" /> Avg
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primarycolor/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primarycolor">
            Best day: {best.name} · {best.orders}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}