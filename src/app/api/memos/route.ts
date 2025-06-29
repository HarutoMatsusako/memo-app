import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("GET /api/memos - Starting request");
    const session = await getServerSession(authOptions);
    console.log("GET /api/memos - Session:", JSON.stringify(session, null, 2));
    console.log("GET /api/memos - Session user:", session?.user);
    console.log("GET /api/memos - Session user id:", session?.user?.id);

    if (!session?.user?.id) {
      console.log("GET /api/memos - Unauthorized: No session or user ID");
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

    console.log("GET /api/memos - Found memos:", memos.length);
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
    console.log("POST /api/memos - Session:", session);

    if (!session?.user?.id) {
      console.log("POST /api/memos - Unauthorized: No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log("POST /api/memos - Request data:", data);
    const { title, content } = data;

    if (!title || !content) {
      console.log(
        "POST /api/memos - Validation error: Missing title or content"
      );
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    console.log(
      "POST /api/memos - Creating memo with userId:",
      session.user.id
    );
    const memo = await prisma.memo.create({
      data: {
        title,
        content,
        userId: session.user.id,
      } as any,
    });

    console.log("POST /api/memos - Created memo:", memo);
    return NextResponse.json(memo);
  } catch (error) {
    console.error("Error creating memo:", error);
    return NextResponse.json(
      { error: "Failed to create memo" },
      { status: 500 }
    );
  }
}
