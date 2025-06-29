import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();
    const { title, content } = data;

    // メモの存在確認とユーザー権限確認
    const existingMemo = await prisma.memo.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id,
      } as any,
    });

    if (!existingMemo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    // メモを更新
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // メモの存在確認とユーザー権限確認
    const existingMemo = await prisma.memo.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id,
      } as any,
    });

    if (!existingMemo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    // メモを削除
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
