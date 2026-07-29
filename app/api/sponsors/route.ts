import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: [{ tier: 'asc' }, { sortOrder: 'asc' }]
    });

    return NextResponse.json(sponsors);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const sponsor = await prisma.sponsor.create({
      data: {
        name: body.name,
        logo: body.logo,
        website: body.website,
        tier: body.tier || 'BRONZE',
        sortOrder: body.sortOrder || 0
      }
    });

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
