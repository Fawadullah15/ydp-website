import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];
const schema = z.object({ email: z.string().trim().email().optional(), currentPassword: z.string().min(1), newPassword: z.string().min(8).optional() });

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user || !allowedRoles.includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const account = await prisma.user.findUnique({ where: { id: user.id }, select: { email: true, name: true } });
  return NextResponse.json(account);
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await verifyAuth(request);
    if (!session || !allowedRoles.includes(session.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email and a new password of at least 8 characters.' }, { status: 400 });
    const account = await prisma.user.findUnique({ where: { id: session.id } });
    if (!account?.password || !(await bcrypt.compare(parsed.data.currentPassword, account.password))) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    if (!parsed.data.email && !parsed.data.newPassword) return NextResponse.json({ error: 'Enter a new login email or password.' }, { status: 400 });
    const updated = await prisma.user.update({ where: { id: account.id }, data: { ...(parsed.data.email ? { email: parsed.data.email } : {}), ...(parsed.data.newPassword ? { password: await bcrypt.hash(parsed.data.newPassword, 12) } : {}) }, select: { email: true } });
    return NextResponse.json({ success: true, email: updated.email });
  } catch (error: any) {
    if (error?.code === 'P2002') return NextResponse.json({ error: 'That login email is already in use.' }, { status: 409 });
    return NextResponse.json({ error: 'Unable to update login details.' }, { status: 500 });
  }
}
