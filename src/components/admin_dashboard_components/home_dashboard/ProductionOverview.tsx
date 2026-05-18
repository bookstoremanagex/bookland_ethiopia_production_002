"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";
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
  return (
    <Card className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:rounded-3xl">
      <CardHeader className="space-y-1 border-b border-slate-100 px-6 pb-4 pt-6">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          Production pipeline
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-slate-600">
          How titles are distributed across production states.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-4 pb-6 pt-2 sm:px-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px] w-full sm:max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                innerRadius={70}
                outerRadius={105}
                strokeWidth={2}
                stroke="#fff"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={40}
                formatter={(value) => (
                  <span className="text-xs font-medium text-slate-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
