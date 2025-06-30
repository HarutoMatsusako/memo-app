import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memos = await prisma.memo.findMany({
      where: {
        userId: session.user.id,
      } as any,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(memos);
  } catch (error) {
    console.error("Error fetching memos:", error);
    return NextResponse.json(
      { error: "Failed to fetch memos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { title, content } = data;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const memo = await prisma.memo.create({
      data: {
        title,
        content,
        userId: session.user.id,
      } as any,
    });

    return NextResponse.json(memo);
  } catch (error) {
    console.error("Error creating memo:", error);
    return NextResponse.json(
      { error: "Failed to create memo" },
      { status: 500 }
    );
  }
}
