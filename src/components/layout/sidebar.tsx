"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Wallet, 
  Target,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Transaksi",
    href: "/transactions",
    icon: Receipt
  },
  {
    title: "Insight AI",
    href: "/insights",
    icon: PieChart
  },
  {
    title: "Rekening",
    href: "/accounts",
    icon: Wallet
  },
  {
    title: "Kategori",
    href: "/categories",
    icon: Target
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Trigger */}
      <Button
        variant="ghost" 
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 transform border-r bg-card/80 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 border-border",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center px-8 border-b border-slate-200/50 dark:border-slate-800/50">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                 <Wallet className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Monity
              </span>
            </Link>
          </div>
          
          <nav className="flex-1 space-y-1 p-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu Utama</div>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              
              return (
                <motion.div
                  key={item.href}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", isActive && "animate-pulse")} />
                    <span className="relative z-10">{item.title}</span>
                    {!isActive && <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <div className="border-t border-slate-200/50 dark:border-slate-800/50 p-6">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl h-11 px-4"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-5 w-5" />
              Keluar Sesi
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
