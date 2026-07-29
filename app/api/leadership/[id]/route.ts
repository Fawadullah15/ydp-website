import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import { leadershipSchema } from '@/lib/leadership';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const leader = await prisma.leadershipProfile.findUnique({
      where: { id: id }
    });

    if (!leader) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(leader);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = leadershipSchema.partial().safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    const data = parsed.data;
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'No changes supplied' }, { status: 400 });
    for (const field of ['bio', 'photo', 'email', 'phone', 'facebook', 'twitter', 'linkedin', 'instagram'] as const) {
      if (data[field] === '') data[field] = null as never;
    }
    
    const leader = await prisma.leadershipProfile.update({
      where: { id: id },
      data
    });

    return NextResponse.json(leader);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.leadershipProfile.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
