# Monity - Personal Finance Tracker with AI Insights

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)

**Monity** adalah aplikasi pelacak keuangan pribadi berbasis web dengan fitur AI insights yang membantu Anda mengelola keuangan dengan lebih cerdas. Dibangun dengan teknologi modern dan UI yang elegan.

## ✨ Fitur Utama

- **📊 Dashboard Interaktif** - Ringkasan kesehatan finansial dengan visualisasi data real-time
- **💰 Manajemen Transaksi** - Catat pemasukan & pengeluaran dengan mudah
- **🏦 Multi-Rekening** - Kelola berbagai akun (Bank, E-Wallet, Cash)
- **📁 Kategori Otomatis** - Auto-kategorisasi transaksi berdasarkan merchant
- **🤖 AI Insights** - Analisis keuangan cerdas menggunakan Google Gemini AI
- **📈 Visualisasi Data** - Grafik dan chart untuk memahami pola keuangan
- **🌙 Dark Mode** - Tema gelap yang nyaman di mata
- **🔐 Autentikasi Aman** - Login dengan email/password atau Google OAuth

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) dengan App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **AI**: [Google Gemini](https://ai.google.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm atau pnpm
- Akun [Supabase](https://supabase.com/) (gratis)
- API Key [Google AI Studio](https://aistudio.google.com/) (untuk Gemini)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/monity.git
   cd monity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Copy file `env.template` ke `.env` dan isi dengan kredensial Anda:
   ```bash
   cp env.template .env
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. Buka [http://localhost:3000](http://localhost:3000) di browser

## ⚙️ Environment Variables

Buat file `.env` dengan variabel berikut:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

# NextAuth
AUTH_SECRET="your-auth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

### Cara Mendapatkan Kredensial

1. **DATABASE_URL**: Buat project di [Supabase](https://supabase.com/), lalu copy connection string dari Settings > Database
2. **AUTH_SECRET**: Generate dengan `openssl rand -base64 32`
3. **Google OAuth**: Buat credentials di [Google Cloud Console](https://console.cloud.google.com/)
4. **GEMINI_API_KEY**: Dapatkan dari [Google AI Studio](https://aistudio.google.com/app/apikey)

## 📜 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run db:push    # Push schema to database
npm run db:migrate # Run migrations
npm run db:studio  # Open Drizzle Studio
```

## 📁 Project Structure

```
monity/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Auth pages (login, register)
│   │   ├── (dashboard)/     # Dashboard pages
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Landing page
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── layout/          # Layout components
│   │   ├── transactions/    # Transaction components
│   │   └── ui/              # UI primitives
│   ├── lib/                 # Utilities & configs
│   │   ├── ai/              # Gemini AI client
│   │   ├── auth/            # NextAuth config
│   │   └── db/              # Drizzle ORM setup
│   └── types/               # TypeScript types
├── drizzle/                 # Drizzle migrations
└── public/                  # Static assets
```

## 🖼️ Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### AI Insights
![AI Insights](./screenshots/insights.png)

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Virgii**

- GitHub: [@mochvirgiawancr](https://github.com/mochvirgiawancr)

---

<p align="center">Built with ❤️ using Next.js and Gemini AI</p>
