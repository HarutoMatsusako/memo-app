import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    console.log("Debug session - Starting request");
    const session = await getServerSession(authOptions);
    console.log("Debug session - Session:", JSON.stringify(session, null, 2));

    return NextResponse.json({
      session,
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      user: session?.user,
    });
  } catch (error) {
    console.error("Debug session - Error:", error);
    return NextResponse.json(
      { error: "Failed to get session", details: error },
      { status: 500 }
    );
  }
}
