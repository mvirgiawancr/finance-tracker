import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { updateCategorySchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single category
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    // User can only view their own categories or default categories
    if (category.userId && category.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PATCH update category
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Only allow updating user's own categories (not default ones)
    const [updated] = await db
      .update(categories)
      .set(parsed.data)
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan atau tidak dapat diubah" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Only allow deleting user's own categories (not default ones)
    const [deleted] = await db
      .delete(categories)
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, session.user.id)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan atau tidak dapat dihapus" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
