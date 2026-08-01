import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import { memberApprovalEmail, memberRejectionEmail, sendMail } from '@/lib/email';
import { z } from 'zod';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];
const memberUpdateSchema = z.object({
  firstName: z.string().trim().min(2).optional(), lastName: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(), phone: z.string().trim().min(10).optional(),
  cnic: z.string().trim().regex(/^\d{5}-\d{7}-\d$/, 'CNIC must use 00000-0000000-0 format').nullable().optional(),
  city: z.string().trim().min(1).nullable().optional(), province: z.string().trim().min(1).nullable().optional(),
  address: z.string().trim().min(5).nullable().optional(), occupation: z.string().trim().min(1).nullable().optional(),
  dateOfBirth: z.string().datetime().nullable().optional(),
  photo: z.string().trim().max(4096).nullable().optional(), membershipType: z.string().trim().min(1).optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: id }
    });

    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(member);
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

    const parsed = memberUpdateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    const { status, ...otherData } = parsed.data;

    const existing = await prisma.member.findUnique({ where: { id: id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.member.update({
      where: { id: id },
      data: {
        ...(status ? { status } : {}),
        ...otherData,
        ...(otherData.dateOfBirth ? { dateOfBirth: new Date(otherData.dateOfBirth) } : {}),
        ...(status === 'ACTIVE' && existing.status !== 'ACTIVE' ? { approvedAt: new Date() } : {}),
      }
    });

    // Send emails based on status change
    if (existing.status !== 'ACTIVE' && status === 'ACTIVE') {
      await sendMail(updated.email, 'YDP Membership Approved', memberApprovalEmail(updated.firstName, updated.memberId || 'N/A'));
    } else if (existing.status !== 'SUSPENDED' && status === 'SUSPENDED') {
      await sendMail(updated.email, 'YDP Membership Update', memberRejectionEmail(updated.firstName));
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'A member with this email or CNIC already exists.' }, { status: 409 });
    }
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

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.member.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
