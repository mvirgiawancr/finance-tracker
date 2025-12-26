"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface MonthlyComparisonProps {
  data: {
    month: string
    income: number
    expense: number
  }[]
}

export function MonthlyComparison({ data }: MonthlyComparisonProps) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Arus Kas Bulanan</CardTitle>
        <CardDescription>Perbandingan pemasukan vs pengeluaran 6 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="month" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}jt`}
              />
              <Tooltip 
                 formatter={(value: any) => [formatCurrency(value), ""]}
                 contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                 itemStyle={{ color: 'hsl(var(--foreground))' }}
                 labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="income" 
                name="Pemasukan" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="expense" 
                name="Pengeluaran" 
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
