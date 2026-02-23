"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Wallet, CreditCard, Banknote, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createAccountSchema, type CreateAccountInput } from "@/lib/validations"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<{ id: string; name: string } | null>(null)
  
  const form = useForm<CreateAccountInput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      type: "bank",
      balance: 0,
      icon: "",
      color: "",
    },
  })

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/accounts")
      if (res.ok) {
        const json = await res.json()
        setAccounts(json.accounts || [])
      }
    } catch (error) {
      console.error("Failed to fetch accounts", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function onSubmit(data: CreateAccountInput) {
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Gagal membuat akun")

      toast.success("Akun berhasil dibuat")
      setOpen(false)
      form.reset()
      fetchAccounts()
    } catch (error) {
      toast.error("Gagal membuat akun")
    }
  }

  function openDeleteDialog(id: string, name: string) {
    setAccountToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!accountToDelete) return
    
    const res = await fetch(`/api/accounts/${accountToDelete.id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Gagal menghapus")
    
    toast.success("Akun berhasil dihapus")
    setDeleteDialogOpen(false)
    setAccountToDelete(null)
    fetchAccounts()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rekening & Dompet</h1>
          <p className="text-muted-foreground">Kelola semua sumber danamu di satu tempat</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Akun
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Akun Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Akun</Label>
                <Input placeholder="Contoh: BCA Utama" {...form.register('name')} />
              </div>
              
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select onValueChange={(val) => form.setValue('type', val as any)} defaultValue="bank">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Akun Bank</SelectItem>
                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                    <SelectItem value="cash">Tunai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Saldo Awal</Label>
                <Input type="number" {...form.register('balance')} onChange={e => form.setValue('balance', Number(e.target.value))} />
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => (
            <Card key={acc.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                acc.type === 'bank' ? 'bg-blue-500' : 
                acc.type === 'e-wallet' ? 'bg-purple-500' : 'bg-green-500'
              }`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {acc.type === 'bank' ? 'Bank Account' : 
                   acc.type === 'e-wallet' ? 'E-Wallet' : 'Cash'}
                </CardTitle>
                {acc.type === 'bank' ? <Banknote className="h-4 w-4 text-muted-foreground" /> :
                 acc.type === 'e-wallet' ? <CreditCard className="h-4 w-4 text-muted-foreground" /> :
                 <Wallet className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(Number(acc.balance))}</div>
                <p className="text-xs text-muted-foreground mt-1">{acc.name}</p>
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                <Button variant="ghost" size="sm" className="text-destructive h-8 px-2" onClick={() => openDeleteDialog(acc.id, acc.name)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(val) => {
          setDeleteDialogOpen(val)
          if (!val) setAccountToDelete(null)
        }}
        title="Hapus Rekening?"
        description={`Rekening "${accountToDelete?.name}" akan dihapus secara permanen beserta semua transaksi yang terkait. Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
