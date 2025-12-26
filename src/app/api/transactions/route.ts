import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, financeAccounts, categories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { createTransactionSchema, transactionQuerySchema } from "@/lib/validations";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

// GET all transactions with filters
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = transactionQuerySchema.parse({
            accountId: searchParams.get("accountId") ?? undefined,
            categoryId: searchParams.get("categoryId") ?? undefined,
            type: searchParams.get("type") ?? undefined,
            startDate: searchParams.get("startDate") ?? undefined,
            endDate: searchParams.get("endDate") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
            offset: searchParams.get("offset") ?? undefined,
        });

        const conditions = [eq(transactions.userId, session.user.id)];

        if (query.accountId) {
            conditions.push(eq(transactions.accountId, query.accountId));
        }
        if (query.categoryId) {
            conditions.push(eq(transactions.categoryId, query.categoryId));
        }
        if (query.type) {
            conditions.push(eq(transactions.type, query.type));
        }
        if (query.startDate) {
            conditions.push(gte(transactions.transactionDate, query.startDate));
        }
        if (query.endDate) {
            conditions.push(lte(transactions.transactionDate, query.endDate));
        }

        const result = await db.query.transactions.findMany({
            where: and(...conditions),
            with: {
                account: true,
                category: true,
            },
            orderBy: [desc(transactions.transactionDate), desc(transactions.createdAt)],
            limit: query.limit,
            offset: query.offset,
        });

        return NextResponse.json({ transactions: result });
    } catch (error) {
        console.error("Get transactions error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

// POST create new transaction
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = createTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        // Verify account belongs to user
        const account = await db.query.financeAccounts.findFirst({
            where: and(
                eq(financeAccounts.id, parsed.data.accountId),
                eq(financeAccounts.userId, session.user.id)
            ),
        });

        if (!account) {
            return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
        }

        // Auto-categorize if no category provided
        let categoryId = parsed.data.categoryId;
        if (!categoryId && parsed.data.merchant) {
            const matchedCategory = await autoCategorize(
                parsed.data.merchant,
                parsed.data.type,
                session.user.id
            );
            categoryId = matchedCategory?.id;
        }

        // Create transaction
        const [newTransaction] = await db
            .insert(transactions)
            .values({
                ...parsed.data,
                categoryId,
                amount: String(parsed.data.amount),
                userId: session.user.id,
            })
            .returning();

        // Update account balance
        const balanceChange = parsed.data.type === "income"
            ? parsed.data.amount
            : -parsed.data.amount;

        await db
            .update(financeAccounts)
            .set({
                balance: sql`${financeAccounts.balance} + ${balanceChange}`,
                updatedAt: new Date(),
            })
            .where(eq(financeAccounts.id, parsed.data.accountId));

        return NextResponse.json({ transaction: newTransaction }, { status: 201 });
    } catch (error) {
        console.error("Create transaction error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

// Auto-categorize based on merchant/description keywords
async function autoCategorize(
    merchant: string,
    type: string,
    userId: string
) {
    const allCategories = await db.query.categories.findMany({
        where: eq(categories.type, type),
    });

    const merchantLower = merchant.toLowerCase();

    for (const category of allCategories) {
        if (category.keywords) {
            const keywords = category.keywords.split(",").map((k) => k.trim().toLowerCase());
            if (keywords.some((keyword) => merchantLower.includes(keyword))) {
                return category;
            }
        }
    }

    return null;
}
