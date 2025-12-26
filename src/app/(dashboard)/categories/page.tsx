"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Tag, Plus } from "lucide-react"
import { toast } from "sonner"

const colors = [
  { value: "#22c55e", label: "Hijau" },
  { value: "#3b82f6", label: "Biru" },
  { value: "#f97316", label: "Oranye" },
  { value: "#ef4444", label: "Merah" },
  { value: "#8b5cf6", label: "Ungu" },
  { value: "#ec4899", label: "Pink" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#64748b", label: "Abu-abu" },
]

const emojis = ["💰", "💵", "🎁", "💻", "📈", "🍔", "🛒", "🚗", "🏠", "📱", "💊", "📚", "🎮", "✈️", "👕", "💸", "📦"]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [icon, setIcon] = useState("📦")
  const [color, setColor] = useState("#64748b")

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const json = await res.json()
        setCategories(json.categories || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Nama kategori wajib diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, icon, color }),
      })

      if (!res.ok) throw new Error("Gagal membuat kategori")

      toast.success("Kategori berhasil dibuat!")
      setOpen(false)
      setName("")
      setType("expense")
      setIcon("📦")
      setColor("#64748b")
      fetchCategories()
    } catch (error) {
      toast.error("Gagal membuat kategori")
    } finally {
      setIsSubmitting(false)
    }
  }

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Kategori</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Kelola kategori transaksi untuk pengelompokan otomatis</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
              <DialogDescription>
                Buat kategori custom sesuai kebutuhanmu
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Subscription"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select value={type} onValueChange={(v) => setType(v as "income" | "expense")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                        icon === emoji 
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" 
                          : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Warna</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === c.value 
                          ? "border-slate-900 dark:border-white scale-110" 
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: color + "20", color: color }}
                >
                  {icon}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{name || "Preview"}</p>
                  <p className="text-sm text-slate-500">{type === "income" ? "Pemasukan" : "Pengeluaran"}</p>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Kategori
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Tag className="h-5 w-5" /> Kategori Pemasukan
            </CardTitle>
            <CardDescription>Digunakan untuk mencatat sumber pendapatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : incomeCategories.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada kategori</p>
              ) : (
                incomeCategories.map((c) => (
                  <Badge 
                    key={c.id} 
                    variant="secondary" 
                    className="text-sm py-1.5 px-3 gap-1.5"
                    style={{ backgroundColor: c.color + "20", color: c.color }}
                  >
                    {c.icon} {c.name}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <Tag className="h-5 w-5" /> Kategori Pengeluaran
            </CardTitle>
            <CardDescription>Digunakan untuk melacak belanja dan tagihan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : expenseCategories.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada kategori</p>
              ) : (
                expenseCategories.map((c) => (
                  <Badge 
                    key={c.id} 
                    variant="secondary" 
                    className="text-sm py-1.5 px-3 gap-1.5"
                    style={{ backgroundColor: c.color + "20", color: c.color }}
                  >
                    {c.icon} {c.name}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
