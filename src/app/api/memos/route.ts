import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const memos = await prisma.memo.findMany();
  return NextResponse.json(memos);
}
