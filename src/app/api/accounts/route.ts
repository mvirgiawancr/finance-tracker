import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeAccounts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { createAccountSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

// GET all accounts for current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await db.query.financeAccounts.findMany({
      where: eq(financeAccounts.userId, session.user.id),
      orderBy: (accounts, { desc }) => [desc(accounts.createdAt)],
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Get accounts error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST create new account
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newAccount] = await db
      .insert(financeAccounts)
      .values({
        ...parsed.data,
        balance: String(parsed.data.balance),
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (error) {
    console.error("Create account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
