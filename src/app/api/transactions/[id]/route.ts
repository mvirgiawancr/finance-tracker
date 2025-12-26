import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, financeAccounts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { updateTransactionSchema } from "@/lib/validations";
import { eq, and, sql } from "drizzle-orm";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single transaction
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const transaction = await db.query.transactions.findFirst({
            where: and(
                eq(transactions.id, id),
                eq(transactions.userId, session.user.id)
            ),
            with: {
                account: true,
                category: true,
            },
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ transaction });
    } catch (error) {
        console.error("Get transaction error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

// PATCH update transaction
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const parsed = updateTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        // Get existing transaction
        const existing = await db.query.transactions.findFirst({
            where: and(
                eq(transactions.id, id),
                eq(transactions.userId, session.user.id)
            ),
        });

        if (!existing) {
            return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
        }

        const updateData: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
        if (parsed.data.amount !== undefined) {
            updateData.amount = String(parsed.data.amount);
        }

        const [updated] = await db
            .update(transactions)
            .set(updateData)
            .where(
                and(
                    eq(transactions.id, id),
                    eq(transactions.userId, session.user.id)
                )
            )
            .returning();

        // Update account balance if amount or type changed
        if (parsed.data.amount !== undefined || parsed.data.type !== undefined) {
            const oldAmount = Number(existing.amount);
            const newAmount = parsed.data.amount ?? oldAmount;
            const oldType = existing.type;
            const newType = parsed.data.type ?? oldType;

            const oldEffect = oldType === "income" ? oldAmount : -oldAmount;
            const newEffect = newType === "income" ? newAmount : -newAmount;
            const balanceChange = newEffect - oldEffect;

            if (balanceChange !== 0) {
                await db
                    .update(financeAccounts)
                    .set({
                        balance: sql`${financeAccounts.balance} + ${balanceChange}`,
                        updatedAt: new Date(),
                    })
                    .where(eq(financeAccounts.id, existing.accountId));
            }
        }

        return NextResponse.json({ transaction: updated });
    } catch (error) {
        console.error("Update transaction error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

// DELETE transaction
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get existing transaction to reverse balance
        const existing = await db.query.transactions.findFirst({
            where: and(
                eq(transactions.id, id),
                eq(transactions.userId, session.user.id)
            ),
        });

        if (!existing) {
            return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
        }

        // Delete transaction
        await db
            .delete(transactions)
            .where(
                and(
                    eq(transactions.id, id),
                    eq(transactions.userId, session.user.id)
                )
            );

        // Reverse balance effect
        const amount = Number(existing.amount);
        const balanceChange = existing.type === "income" ? -amount : amount;

        await db
            .update(financeAccounts)
            .set({
                balance: sql`${financeAccounts.balance} + ${balanceChange}`,
                updatedAt: new Date(),
            })
            .where(eq(financeAccounts.id, existing.accountId));

        return NextResponse.json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        console.error("Delete transaction error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
