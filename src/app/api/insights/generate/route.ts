import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insights, transactions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { generateInsightSchema } from "@/lib/validations";
import { generateFinancialInsight, type FinancialSummary } from "@/lib/ai/gemini";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { getCurrentPeriod, calculatePercentageChange } from "@/lib/utils";

// POST generate new AI insight
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = generateInsightSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { type, period: inputPeriod } = parsed.data;
        const period = inputPeriod || getCurrentPeriod();

        // Get financial summary for the period
        const summary = await getFinancialSummary(session.user.id, period);

        if (summary.totalIncome === 0 && summary.totalExpense === 0) {
            return NextResponse.json(
                { error: "Tidak ada data transaksi untuk periode ini" },
                { status: 400 }
            );
        }

        // Generate AI insight
        const { title, content } = await generateFinancialInsight(summary, type);

        // Check if insight for this period/type already exists
        const existingInsight = await db.query.insights.findFirst({
            where: and(
                eq(insights.userId, session.user.id),
                eq(insights.type, type),
                eq(insights.period, period)
            ),
        });

        let resultInsight;

        if (existingInsight) {
            // Update existing insight with new content
            const [updatedInsight] = await db
                .update(insights)
                .set({
                    title,
                    content,
                    isRead: false,
                    createdAt: new Date(), // Update timestamp so it appears at top
                })
                .where(eq(insights.id, existingInsight.id))
                .returning();
            resultInsight = updatedInsight;
        } else {
            // Create new insight
            const [newInsight] = await db
                .insert(insights)
                .values({
                    userId: session.user.id,
                    type,
                    title,
                    content,
                    period,
                })
                .returning();
            resultInsight = newInsight;
        }

        return NextResponse.json({ insight: resultInsight }, { status: 201 });
    } catch (error) {
        console.error("Generate insight error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat membuat insight" },
            { status: 500 }
        );
    }
}

async function getFinancialSummary(
    userId: string,
    period: string
): Promise<FinancialSummary> {
    const [year, month] = period.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    // Get current month transactions
    const currentMonthTx = await db.query.transactions.findMany({
        where: and(
            eq(transactions.userId, userId),
            gte(transactions.transactionDate, startDate),
            lte(transactions.transactionDate, endDate)
        ),
        with: {
            category: true,
        },
    });

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses: Record<string, number> = {};

    for (const tx of currentMonthTx) {
        const amount = Number(tx.amount);
        if (tx.type === "income") {
            totalIncome += amount;
        } else {
            totalExpense += amount;
            const categoryName = tx.category?.name || "Lainnya";
            categoryExpenses[categoryName] = (categoryExpenses[categoryName] || 0) + amount;
        }
    }

    // Sort categories by expense amount
    const topExpenseCategories = Object.entries(categoryExpenses)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount }));

    // Get previous month for comparison
    const prevStartDate = new Date(year, month - 2, 1);
    const prevEndDate = new Date(year, month - 1, 0);

    const prevMonthTx = await db.query.transactions.findMany({
        where: and(
            eq(transactions.userId, userId),
            eq(transactions.type, "expense"),
            gte(transactions.transactionDate, prevStartDate),
            lte(transactions.transactionDate, prevEndDate)
        ),
    });

    const previousMonthExpense = prevMonthTx.reduce(
        (sum, tx) => sum + Number(tx.amount),
        0
    );

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        topExpenseCategories,
        monthlyComparison: {
            currentMonth: totalExpense,
            previousMonth: previousMonthExpense,
            percentageChange: calculatePercentageChange(totalExpense, previousMonthExpense),
        },
    };
}
