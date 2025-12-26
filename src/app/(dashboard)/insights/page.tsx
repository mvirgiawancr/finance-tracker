"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  async function fetchInsights() {
    try {
      const res = await fetch("/api/insights")
      if (res.ok) {
        const json = await res.json()
        setInsights(json.insights || [])
      }
    } catch (error) {
      console.error("Failed to fetch insights", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  async function generateInsight(type: string) {
    setGenerating(true)
    try {
      toast.info("Sedang menganalisis data keuanganmu...", { duration: 5000 })
      
      const res = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })

      if (!res.ok) throw new Error("Gagal membuat insight")

      const json = await res.json()
      toast.success("Insight baru berhasil dibuat!")
      
      // Refresh insights list
      fetchInsights()
    } catch (error) {
      toast.error("Gagal membuat insight", {
        description: "Pastikan kamu memiliki data transaksi yang cukup"
      })
    } finally {
      setGenerating(false)
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'monthly_summary': return <TrendingUp className="h-5 w-5 text-blue-500" />
      case 'spending_alert': return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'saving_tip': return <Lightbulb className="h-5 w-5 text-yellow-500" />
      default: return <Sparkles className="h-5 w-5 text-primary" />
    }
  }

  const getLabel = (type: string) => {
    switch(type) {
      case 'monthly_summary': return "Ringkasan Bulanan"
      case 'spending_alert': return "Peringatan Pengeluaran"
      case 'saving_tip': return "Tips Hemat"
      default: return "Insight"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Insight AI <Sparkles className="h-6 w-6 text-yellow-500" />
          </h1>
          <p className="text-muted-foreground">Analisis cerdas dan rekomendasi personal dari asisten keuanganmu</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => generateInsight('spending_alert')}
            disabled={generating}
          >
            Cek Peringatan
          </Button>
          <Button 
            onClick={() => generateInsight('monthly_summary')}
            disabled={generating}
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analisis Bulan Ini
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.length === 0 ? (
            <div className="col-span-full flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8 text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>Belum ada insight. Klik tombol Analisis untuk memulai!</p>
            </div>
          ) : (
            insights.map((insight) => (
              <Card key={insight.id} className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Badge variant="outline" className="capitalize">
                    {getLabel(insight.type)}
                  </Badge>
                  {getIcon(insight.type)}
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="mb-2 text-lg">{insight.title}</CardTitle>
                  <CardDescription className="mb-4 text-xs">
                    {formatDate(new Date(insight.createdAt))}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {insight.content}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
