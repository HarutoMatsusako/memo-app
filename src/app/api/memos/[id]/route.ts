import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Session } from "next-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    const { title, content } = data;

    const existingMemo = await prisma.memo.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id,
      },
    });

    if (!existingMemo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    const updatedMemo = await prisma.memo.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    return NextResponse.json(updatedMemo);
  } catch (error) {
    console.error("Error updating memo:", error);
    return NextResponse.json(
      { error: "Failed to update memo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingMemo = await prisma.memo.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id,
      },
    });

    if (!existingMemo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    await prisma.memo.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Memo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting memo:", error);
    return NextResponse.json(
      { error: "Failed to delete memo" },
      { status: 500 }
    );
  }
}
