"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatShortDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface TransactionListProps {
  transactions: any[]
  onDelete: () => void
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus transaksi ini?")) return

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Gagal menghapus")

      toast.success("Transaksi dihapus")
      onDelete()
    } catch (error) {
      toast.error("Gagal menghapus transaksi")
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Akun</TableHead>
            <TableHead className="text-right">Nominal</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Belum ada transaksi
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{formatShortDate(new Date(tx.transactionDate))}</TableCell>
                <TableCell className="font-medium">{tx.merchant || tx.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{tx.category?.icon}</span>
                    <span>{tx.category?.name}</span>
                  </div>
                </TableCell>
                <TableCell>{tx.account.name}</TableCell>
                <TableCell className={`text-right font-medium ${
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'income' ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(tx.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
