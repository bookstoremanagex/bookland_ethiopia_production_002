"use client"

import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ProductionOverviewProps {
    data: {
        status: string;
        count: number;
        fill: string;
    }[]
}

const chartConfig = {
  count: {
    label: "Books",
  },
} satisfies ChartConfig

export function ProductionOverview({ data }: ProductionOverviewProps) {
  return (
    <Card className="rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden flex flex-col">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-black text-primarycolor uppercase tracking-tighter italic">
          Production <span className="text-secondarycolor not-italic">Status</span>
        </CardTitle>
        <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Book lifecycle distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-8 pt-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    strokeWidth={5}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-primarycolor">{value}</span>}
                />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
