"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, PieChart, ShieldCheck, Wallet, ChevronRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { motion, Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-bold text-2xl text-blue-600 dark:text-blue-400"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Monity 
            </span>
          </motion.div>
          
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/50">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 px-6">
                Daftar Sekarang
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:bg-blue-900/20" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-400/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:bg-indigo-900/20" />

          <div className="container relative z-10">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center"
            >
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <motion.div variants={itemVariants} className="inline-flex items-center justify-center lg:justify-start gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 w-fit mx-auto lg:mx-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-300">New: AI Financial Assistant</span>
                  <ChevronRight className="h-3 w-3 text-blue-500" />
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Kelola Uang <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                    Tanpa Pusing
                  </span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Platform manajemen keuangan modern yang membantu Anda melacak, menganalisis, dan merencanakan masa depan finansial dengan cerdas.
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="text-white cursor-pointer w-full h-12 rounded-full text-base bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300">
                      Mulai Sekarang Gratis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex items-center gap-6 justify-center lg:justify-start pt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Free Tier
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> No Credit Card
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Secure
                  </div>
                </motion.div>
              </div>

              {/* Realistic Dashboard Mockup */}
              <motion.div 
                variants={itemVariants}
                className="relative lg:h-[600px] flex items-center justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-[540px] aspect-[4/3] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-900/10 overflow-hidden transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out perspective-1000 group">
                  {/* Mockup Header */}
                  <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="ml-4 h-6 w-64 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                  
                  {/* Mockup Content */}
                  <div className="p-6 grid gap-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                        <div className="text-blue-100 text-xs font-medium mb-1">Total Balance</div>
                        <div className="text-2xl font-bold">Rp 12.5M</div>
                        <div className="flex items-center text-xs mt-2 text-blue-100/80">
                          <TrendingUp className="h-3 w-3 mr-1" /> +12% vs last month
                        </div>
                      </div>
                       <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="text-slate-500 text-xs font-medium mb-1">Income</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rp 8.5M</div>
                         <div className="flex items-center text-xs mt-2 text-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" /> +5.2%
                        </div>
                      </div>
                       <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="text-slate-500 text-xs font-medium mb-1">Expenses</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rp 3.2M</div>
                         <div className="flex items-center text-xs mt-2 text-red-500">
                          <TrendingDown className="h-3 w-3 mr-1" /> -2.1%
                        </div>
                      </div>
                    </div>
                    
                    {/* Chart Area Mock */}
                    <div className="grid grid-cols-3 gap-6 h-48">
                      <div className="col-span-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                           <div className="h-4 w-24 bg-slate-100 dark:bg-slate-700 rounded" />
                           <div className="h-6 w-16 bg-slate-50 dark:bg-slate-800 rounded border" />
                        </div>
                        <div className="flex items-end gap-2 h-32 px-2">
                           {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                             <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                className="flex-1 bg-blue-500/10 dark:bg-blue-500/20 rounded-t hover:bg-blue-500/20 transition-colors relative group-hover/bar"
                             >
                                <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: `${h}%` }} />
                             </motion.div>
                           ))}
                        </div>
                      </div>
                      <div className="col-span-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex items-center justify-center relative">
                         <div className="relative w-32 h-32 rounded-full border-[12px] border-slate-100 dark:border-slate-700">
                            <div className="absolute inset-0 rounded-full border-[12px] border-indigo-500 border-r-transparent border-b-transparent transform -rotate-45" />
                            <div className="absolute inset-0 rounded-full border-[12px] border-blue-400 border-l-transparent border-b-transparent border-t-transparent transform rotate-45" />
                         </div>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs text-slate-400">Total</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">100%</span>
                         </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Action Badge */}
                  <div className="absolute -right-6 top-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce duration-[3000ms]">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                           <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                           <div className="text-xs text-slate-500">Income Received</div>
                           <div className="font-bold text-slate-800 dark:text-slate-100">+Rp 2.500.000</div>
                        </div>
                     </div>
                  </div>
                </div>
                
                {/* Decorative Blobs behind mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[80px] -z-10 mix-blend-multiply dark:bg-blue-900/10 pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-slate-900 relative">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Fitur Yang Anda Butuhkan</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Semua yang Anda perlukan untuk mencapai kebebasan finansial ada di sini.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BarChart3,
                  title: "Analisis Visual",
                  color: "text-blue-500",
                  bg: "bg-blue-50 dark:bg-blue-900/20",
                  desc: "Grafik interaktif yang indah untuk memahami kemana uang Anda pergi setiap bulannya."
                },
                {
                  icon: ShieldCheck,
                  title: "Aman & Privat",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50 dark:bg-emerald-900/20",
                  desc: "Keamanan setara bank. Data Anda dienkripsi dan hanya Anda yang bisa mengaksesnya."
                },
                {
                  icon: PieChart,
                  title: "Smart Budgeting",
                  color: "text-indigo-500",
                  bg: "bg-indigo-50 dark:bg-indigo-900/20",
                  desc: "AI cerdas yang membantu Anda membuat budget realistis berdasarkan kebiasaan belanja."
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
         <section className="py-24 relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-600" />
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50" />
             <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-50" />
             
          <div className="container relative z-10 text-center">
             <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">Siap Mengatur Keuangan?</h2>
             <p className="max-w-2xl mx-auto text-blue-100 text-xl mb-10">
                Bergabunglah dengan ribuan pengguna lain yang telah berhasil mencapai target tabungan mereka.
             </p>
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-xl font-bold text-lg">
                Buat Akun Gratis Sekarang
              </Button>
            </Link>
          </div>
         </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Wallet className="h-4 w-4" />
            </div>
            <span>FinanceTracker</span>
          </div>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; 2025 Monity. Built with ❤️ by Virgii.
          </p>
        </div>
      </footer>
    </div>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
