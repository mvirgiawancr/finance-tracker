import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

// GET all insights for current user
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const unreadOnly = searchParams.get("unreadOnly") === "true";

        const conditions = [eq(insights.userId, session.user.id)];

        if (type) {
            conditions.push(eq(insights.type, type));
        }
        if (unreadOnly) {
            conditions.push(eq(insights.isRead, false));
        }

        const result = await db.query.insights.findMany({
            where: conditions.length > 1
                ? (fields, { and }) => and(...conditions.map(c => c))
                : conditions[0],
            orderBy: [desc(insights.createdAt)],
            limit: 20,
        });

        return NextResponse.json({ insights: result });
    } catch (error) {
        console.error("Get insights error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
