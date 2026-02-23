"use client"

import { useEffect, useState, useCallback } from "react"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { Input } from "@/components/ui/input"
import { Loader2, Search, X } from "lucide-react"
import { useDebounce } from "@/lib/hooks/use-debounce"

export default function TransactionsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const debouncedSearch = useDebounce(search, 400)

  // Triggered whenever debouncedSearch or refreshKey changes
  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append("limit", "50")
        params.append("offset", "0")
        if (debouncedSearch) {
          params.append("search", debouncedSearch)
        }

        const res = await fetch(`/api/transactions?${params.toString()}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const json = await res.json()
          setData(json.transactions || [])
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch transactions", error)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()
    // Cleanup: cancel the in-flight request when search changes or component unmounts
    return () => controller.abort()
  }, [debouncedSearch, refreshKey])

  // Called after add/delete to re-fetch while keeping current search
  const fetchTransactions = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

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
            className="pl-9 pr-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {debouncedSearch && (
            <p className="text-sm text-muted-foreground">
              {data.length > 0
                ? `Ditemukan ${data.length} transaksi untuk "${debouncedSearch}"`
                : `Tidak ada transaksi yang cocok dengan "${debouncedSearch}"`}
            </p>
          )}
          <TransactionList transactions={data} onDelete={fetchTransactions} />
        </>
      )}
    </div>
  )
}
