"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface CategoryPieProps {
  data: {
    name: string
    amount: number
    color: string | null
    percentage: number
  }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function CategoryPie({ data }: CategoryPieProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: item.color || COLORS[index % COLORS.length]
  }))

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Distribusi Pengeluaran</CardTitle>
        <CardDescription>Berdasarkan kategori bulan ini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), ""]}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Belum ada data pengeluaran
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
