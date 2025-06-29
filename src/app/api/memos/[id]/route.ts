import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await req.json();
    const { title, content } = data;

    // メモの存在確認
    const existingMemo = await prisma.memo.findUnique({
      where: { id: parseInt(id) },
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
    const { id } = params;

    // メモの存在確認
    const existingMemo = await prisma.memo.findUnique({
      where: { id: parseInt(id) },
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
