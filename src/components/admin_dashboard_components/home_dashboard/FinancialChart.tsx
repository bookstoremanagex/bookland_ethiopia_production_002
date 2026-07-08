"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
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
  return (
    <Card className="h-full rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:rounded-3xl">
      <CardHeader className="space-y-1 border-b border-slate-100 px-6 pb-4 pt-6 sm:px-8">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          Orders by Day (Last 30 Days)
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-slate-600">
          Approved order amounts per Ethiopian day in the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8">
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full sm:min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <ChartTooltip cursor={{ fill: "rgba(64, 138, 113, 0.06)" }} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar
                dataKey="orders"
                fill="#408A71"
                radius={[6, 6, 0, 0]}
                name="Orders"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-[#408A71]" /> Orders
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
