import { db } from "../src/lib/db";
import { categories } from "../src/lib/db/schema";

const defaultCategories = [
    // Income categories
    { name: "Gaji", type: "income", icon: "💰", color: "#22c55e", keywords: "gaji,salary,payroll", isDefault: true },
    { name: "Freelance", type: "income", icon: "💻", color: "#10b981", keywords: "freelance,project,side job", isDefault: true },
    { name: "Investasi", type: "income", icon: "📈", color: "#14b8a6", keywords: "dividen,return,profit", isDefault: true },
    { name: "Bonus", type: "income", icon: "🎁", color: "#06b6d4", keywords: "bonus,thr,insentif", isDefault: true },
    { name: "Lainnya", type: "income", icon: "💵", color: "#84cc16", keywords: "", isDefault: true },

    // Expense categories
    { name: "Makanan & Minuman", type: "expense", icon: "🍔", color: "#f97316", keywords: "gofood,grabfood,resto,makan,minum,kopi,starbucks,mcd,kfc", isDefault: true },
    { name: "Transportasi", type: "expense", icon: "🚗", color: "#ef4444", keywords: "grab,gojek,uber,bensin,parkir,tol,mrt,krl,busway", isDefault: true },
    { name: "Belanja", type: "expense", icon: "🛒", color: "#ec4899", keywords: "tokopedia,shopee,lazada,blibli,alfamart,indomaret", isDefault: true },
    { name: "Hiburan", type: "expense", icon: "🎮", color: "#8b5cf6", keywords: "netflix,spotify,game,bioskop,cinema,youtube", isDefault: true },
    { name: "Tagihan", type: "expense", icon: "📱", color: "#6366f1", keywords: "listrik,pln,pdam,internet,pulsa,hp", isDefault: true },
    { name: "Kesehatan", type: "expense", icon: "💊", color: "#0ea5e9", keywords: "apotek,dokter,rumah sakit,obat,vitamin", isDefault: true },
    { name: "Pendidikan", type: "expense", icon: "📚", color: "#14b8a6", keywords: "kursus,buku,udemy,sekolah,kuliah", isDefault: true },
    { name: "Transfer", type: "expense", icon: "💸", color: "#64748b", keywords: "transfer,kirim,tf", isDefault: true },
    { name: "Lainnya", type: "expense", icon: "📦", color: "#94a3b8", keywords: "", isDefault: true },
];

async function seed() {
    console.log("🌱 Seeding default categories...");

    for (const category of defaultCategories) {
        await db.insert(categories).values({
            ...category,
            userId: null, // Default categories have no user
        }).onConflictDoNothing();
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
