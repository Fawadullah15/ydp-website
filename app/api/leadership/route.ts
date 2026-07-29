import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import { leadershipSchema } from '@/lib/leadership';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    const includeInactive = new URL(req.url).searchParams.get('includeInactive') === 'true';
    const canManage = Boolean(user && allowedRoles.includes(user.role));
    const leaders = await prisma.leadershipProfile.findMany({
      where: includeInactive && canManage ? undefined : { isActive: true },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' }
      ],
      include: { province: true }
    });

    // Group by level
    const grouped = leaders.reduce((acc: any, curr) => {
      if (!acc[curr.level]) acc[curr.level] = [];
      acc[curr.level].push(curr);
      return acc;
    }, {});

    return NextResponse.json(grouped);
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

    const parsed = leadershipSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    const body = parsed.data;

    const leader = await prisma.leadershipProfile.create({
      data: {
        name: body.name,
        position: body.position,
        bio: body.bio || null,
        photo: body.photo || null,
        email: body.email || null,
        phone: body.phone || null,
        facebook: body.facebook || null,
        twitter: body.twitter || null,
        linkedin: body.linkedin || null,
        instagram: body.instagram || null,
        level: body.level,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
        provinceId: body.provinceId || null,
      }
    });

    return NextResponse.json(leader, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

