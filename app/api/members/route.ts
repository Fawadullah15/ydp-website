import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

const adminMemberSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(10),
  cnic: z.string().trim().min(1).optional().or(z.literal('')),
  city: z.string().trim().min(1).optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']).default('PENDING'),
  membershipType: z.string().trim().min(1).default('GENERAL'),
  photo: z.string().regex(/^\/(?:api\/)?uploads\/[A-Za-z0-9._-]+$/, 'Invalid upload path').optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const province = searchParams.get('province');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (province) where.province = province;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.member.count({ where })
    ]);

    return NextResponse.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Members GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = adminMemberSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const existing = await prisma.member.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const memberId = `YDP-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const member = await prisma.member.create({
      data: {
        ...data,
        cnic: data.cnic || null,
        city: data.city || null,
        photo: data.photo || null,
        memberId,
        approvedAt: data.status === 'ACTIVE' ? new Date() : null,
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Members POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
