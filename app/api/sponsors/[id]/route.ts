import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sponsor = await prisma.sponsor.findUnique({ where: { id } });
    if (!sponsor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(sponsor);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const allowed = ['name', 'logo', 'website', 'tier', 'isActive', 'sortOrder'];
    const data: any = {};
    for (const k of allowed) {
      if (body[k] !== undefined) data[k] = body[k];
    }
    if (data.sortOrder !== undefined) data.sortOrder = parseInt(data.sortOrder);
    const sponsor = await prisma.sponsor.update({ where: { id }, data });
    return NextResponse.json(sponsor);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await prisma.sponsor.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
