"use client"

import { useEffect, useState } from "react"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { CategoryPie } from "@/components/dashboard/category-pie"
import { MonthlyComparison } from "@/components/dashboard/monthly-comparison"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 p-8 max-w-7xl mx-auto"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
           <p className="text-muted-foreground mt-2">Ringkasan kesehatan finansial Anda hari ini.</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <OverviewCards summary={data.summary} monthlyTrend={data.monthlyTrend} />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        <MonthlyComparison data={data.monthlyTrend} />
        <CategoryPie data={data.categoryBreakdown} />
      </motion.div>
    </motion.div>
  )
}
