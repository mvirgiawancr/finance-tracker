import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, financeAccounts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, lte, sql } from "drizzle-orm";

// GET dashboard summary
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const periodParam = searchParams.get("period"); // e.g., '2024-01'

        // Default to current month
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;

        if (periodParam) {
            const [y, m] = periodParam.split("-").map(Number);
            year = y;
            month = m;
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Get all accounts with balances
        const accounts = await db.query.financeAccounts.findMany({
            where: eq(financeAccounts.userId, session.user.id),
        });

        const totalBalance = accounts.reduce(
            (sum, acc) => sum + Number(acc.balance),
            0
        );

        // Get transactions for the period
        const monthTransactions = await db.query.transactions.findMany({
            where: and(
                eq(transactions.userId, session.user.id),
                gte(transactions.transactionDate, startDate),
                lte(transactions.transactionDate, endDate)
            ),
            with: {
                category: true,
            },
        });

        // Calculate totals and category breakdown
        let totalIncome = 0;
        let totalExpense = 0;
        const categoryBreakdown: Record<string, { amount: number; color: string | null }> = {};

        for (const tx of monthTransactions) {
            const amount = Number(tx.amount);
            if (tx.type === "income") {
                totalIncome += amount;
            } else {
                totalExpense += amount;
                const categoryName = tx.category?.name || "Lainnya";
                if (!categoryBreakdown[categoryName]) {
                    categoryBreakdown[categoryName] = { amount: 0, color: tx.category?.color || null };
                }
                categoryBreakdown[categoryName].amount += amount;
            }
        }

        // Get last 6 months trend
        const monthlyTrend = await getMonthlyTrend(session.user.id, 6);

        return NextResponse.json({
            summary: {
                totalBalance,
                totalIncome,
                totalExpense,
                netCashFlow: totalIncome - totalExpense,
                period: `${year}-${String(month).padStart(2, "0")}`,
            },
            accounts: accounts.map((acc) => ({
                id: acc.id,
                name: acc.name,
                type: acc.type,
                balance: Number(acc.balance),
                icon: acc.icon,
                color: acc.color,
            })),
            categoryBreakdown: Object.entries(categoryBreakdown)
                .map(([name, data]) => ({
                    name,
                    amount: data.amount,
                    color: data.color,
                    percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
                }))
                .sort((a, b) => b.amount - a.amount),
            monthlyTrend,
            transactionCount: monthTransactions.length,
        });
    } catch (error) {
        console.error("Get dashboard error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

async function getMonthlyTrend(userId: string, months: number) {
    const trend = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthTx = await db.query.transactions.findMany({
            where: and(
                eq(transactions.userId, userId),
                gte(transactions.transactionDate, startDate),
                lte(transactions.transactionDate, endDate)
            ),
        });

        let income = 0;
        let expense = 0;

        for (const tx of monthTx) {
            const amount = Number(tx.amount);
            if (tx.type === "income") {
                income += amount;
            } else {
                expense += amount;
            }
        }

        const monthName = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date);

        trend.push({
            month: monthName,
            period: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
            income,
            expense,
        });
    }

    return trend;
}
