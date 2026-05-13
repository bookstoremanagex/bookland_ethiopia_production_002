"use client"

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
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

interface FinancialChartProps {
    data: {
        name: string;
        revenue: number;
        debt: number;
    }[]
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  debt: {
    label: "Debt",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function FinancialChart({ data }: FinancialChartProps) {
  return (
    <Card className="rounded-[2.5rem] border-2 border-primarycolor/5 shadow-2xl overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-black text-primarycolor uppercase tracking-tighter italic">
          Financial <span className="text-secondarycolor not-italic">Performance</span>
        </CardTitle>
        <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Revenue vs Outstanding Debt per month
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    className="text-[10px] font-bold uppercase"
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar 
                    dataKey="revenue" 
                    fill="#1e293b" 
                    radius={8} 
                    name="Gross Revenue"
                />
                <Bar 
                    dataKey="debt" 
                    fill="#f43f5e" 
                    radius={8} 
                    name="Pending Debt"
                />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
