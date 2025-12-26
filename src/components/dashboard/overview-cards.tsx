"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Wallet, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"

interface MonthlyTrendItem {
  month: string
  period: string
  income: number
  expense: number
}

interface OverviewCardsProps {
  summary: {
    totalBalance: number
    totalIncome: number
    totalExpense: number
    netCashFlow: number
  }
  monthlyTrend?: MonthlyTrendItem[]
}

function calculateChange(current: number, previous: number): { value: number; type: 'up' | 'down' | 'neutral' | 'new' } {
  if (previous === 0 && current === 0) return { value: 0, type: 'neutral' }
  if (previous === 0 && current > 0) return { value: current, type: 'new' } // Can't calculate % from 0
  if (current === 0 && previous > 0) return { value: 100, type: 'down' } // 100% decrease
  const change = ((current - previous) / previous) * 100
  return { 
    value: Math.abs(change), 
    type: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral' 
  }
}

export function OverviewCards({ summary, monthlyTrend }: OverviewCardsProps) {
  // Get current and previous month data
  const currentMonth = monthlyTrend?.[monthlyTrend.length - 1]
  const previousMonth = monthlyTrend?.[monthlyTrend.length - 2]

  const incomeChange = calculateChange(
    currentMonth?.income ?? 0, 
    previousMonth?.income ?? 0
  )
  const expenseChange = calculateChange(
    currentMonth?.expense ?? 0, 
    previousMonth?.expense ?? 0
  )

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Saldo</CardTitle>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
               <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(summary.totalBalance)}</div>
            <p className="text-xs text-blue-100 mt-1 opacity-80">
              Total aset likuid saat ini
            </p>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="bg-card shadow-sm relative overflow-hidden group hover:border-green-500/50 transition-colors h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Bulan Ini</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500/20 transition-colors">
              <ArrowUpIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(summary.totalIncome)}
            </div>
            {incomeChange.type === 'new' ? (
              <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" /> Baru bulan ini
              </p>
            ) : incomeChange.type === 'up' || incomeChange.type === 'down' ? (
              <p className={`text-xs flex items-center mt-1 font-medium ${incomeChange.type === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {incomeChange.type === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {incomeChange.type === 'up' ? '+' : '-'}{incomeChange.value.toFixed(1)}% dari bulan lalu
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Minus className="h-3 w-3 mr-1" /> Belum ada data pembanding
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="bg-card shadow-sm relative overflow-hidden group hover:border-red-500/50 transition-colors h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pengeluaran Bulan Ini</CardTitle>
             <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500/20 transition-colors">
              <ArrowDownIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(summary.totalExpense)}
            </div>
            {expenseChange.type === 'new' ? (
              <p className="text-xs text-orange-500 flex items-center mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" /> Baru bulan ini
              </p>
            ) : expenseChange.type === 'up' || expenseChange.type === 'down' ? (
              <p className={`text-xs flex items-center mt-1 font-medium ${expenseChange.type === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                {expenseChange.type === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {expenseChange.type === 'up' ? '+' : '-'}{expenseChange.value.toFixed(1)}% dari bulan lalu
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Minus className="h-3 w-3 mr-1" /> Belum ada data pembanding
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
