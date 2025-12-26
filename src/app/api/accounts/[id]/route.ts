import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeAccounts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { updateAccountSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single account
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const account = await db.query.financeAccounts.findFirst({
      where: and(
        eq(financeAccounts.id, id),
        eq(financeAccounts.userId, session.user.id)
      ),
    });

    if (!account) {
      return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (error) {
    console.error("Get account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PATCH update account
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
    if (parsed.data.balance !== undefined) {
      updateData.balance = String(parsed.data.balance);
    }

    const [updated] = await db
      .update(financeAccounts)
      .set(updateData)
      .where(
        and(
          eq(financeAccounts.id, id),
          eq(financeAccounts.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ account: updated });
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE account
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [deleted] = await db
      .delete(financeAccounts)
      .where(
        and(
          eq(financeAccounts.id, id),
          eq(financeAccounts.userId, session.user.id)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
