"use client"

import { useEffect, useState, useCallback } from "react"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Filter } from "lucide-react"

export default function TransactionsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    limit: 50,
    offset: 0,
  })

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', String(filters.limit))
      params.append('offset', String(filters.offset))

      const res = await fetch(`/api/transactions?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setData(json.transactions || [])
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-muted-foreground">Catat dan kelola riwayat transaksi keuanganmu</p>
        </div>
        <TransactionForm onSuccess={fetchTransactions} />
      </div>

      <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari transaksi..." 
            className="pl-9" 
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <TransactionList 
          transactions={data} 
          onDelete={fetchTransactions}
        />
      )}
    </div>
  )
}
