import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH mark insight as read
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const [updated] = await db
            .update(insights)
            .set({ isRead: true })
            .where(
                and(
                    eq(insights.id, id),
                    eq(insights.userId, session.user.id)
                )
            )
            .returning();

        if (!updated) {
            return NextResponse.json({ error: "Insight tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ insight: updated });
    } catch (error) {
        console.error("Update insight error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

// DELETE insight
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const [deleted] = await db
            .delete(insights)
            .where(
                and(
                    eq(insights.id, id),
                    eq(insights.userId, session.user.id)
                )
            )
            .returning();

        if (!deleted) {
            return NextResponse.json({ error: "Insight tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Insight berhasil dihapus" });
    } catch (error) {
        console.error("Delete insight error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
