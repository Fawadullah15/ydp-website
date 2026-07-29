import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const provinces = await prisma.province.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { members: true, leadership: true } } }
    });
    return NextResponse.json(provinces);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
