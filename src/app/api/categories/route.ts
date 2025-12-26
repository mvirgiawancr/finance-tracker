import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { createCategorySchema } from "@/lib/validations";
import { eq, or, isNull, and } from "drizzle-orm";

// Default categories to seed
const defaultCategories = [
  // Income categories
  { name: "Gaji", type: "income" as const, icon: "💰", color: "#22c55e", keywords: "gaji,salary,payroll" },
  { name: "Freelance", type: "income" as const, icon: "💻", color: "#10b981", keywords: "freelance,project,side job" },
  { name: "Investasi", type: "income" as const, icon: "📈", color: "#14b8a6", keywords: "dividen,return,profit" },
  { name: "Bonus", type: "income" as const, icon: "🎁", color: "#06b6d4", keywords: "bonus,thr,insentif" },
  { name: "Lainnya", type: "income" as const, icon: "💵", color: "#84cc16", keywords: "" },

  // Expense categories
  { name: "Makanan & Minuman", type: "expense" as const, icon: "🍔", color: "#f97316", keywords: "gofood,grabfood,resto,makan,minum,kopi,starbucks,mcd,kfc" },
  { name: "Transportasi", type: "expense" as const, icon: "🚗", color: "#ef4444", keywords: "grab,gojek,uber,bensin,parkir,tol,mrt,krl,busway" },
  { name: "Belanja", type: "expense" as const, icon: "🛒", color: "#ec4899", keywords: "tokopedia,shopee,lazada,blibli,alfamart,indomaret" },
  { name: "Hiburan", type: "expense" as const, icon: "🎮", color: "#8b5cf6", keywords: "netflix,spotify,game,bioskop,cinema,youtube" },
  { name: "Tagihan", type: "expense" as const, icon: "📱", color: "#6366f1", keywords: "listrik,pln,pdam,internet,pulsa,hp" },
  { name: "Kesehatan", type: "expense" as const, icon: "💊", color: "#0ea5e9", keywords: "apotek,dokter,rumah sakit,obat,vitamin" },
  { name: "Pendidikan", type: "expense" as const, icon: "📚", color: "#14b8a6", keywords: "kursus,buku,udemy,sekolah,kuliah" },
  { name: "Transfer", type: "expense" as const, icon: "💸", color: "#64748b", keywords: "transfer,kirim,tf" },
  { name: "Lainnya", type: "expense" as const, icon: "📦", color: "#94a3b8", keywords: "" },
];

// GET all categories (user's + default)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has any categories
    let allCategories = await db.query.categories.findMany({
      where: eq(categories.userId, session.user.id),
    });

    // If user has no categories, seed default ones for this user
    if (allCategories.length === 0) {
      const seededCategories = await db
        .insert(categories)
        .values(
          defaultCategories.map((cat) => ({
            ...cat,
            userId: session.user.id,
            isDefault: true,
          }))
        )
        .returning();
      allCategories = seededCategories;
    }

    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        ...parsed.data,
        userId: session.user.id,
        isDefault: false,
      })
      .returning();

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
