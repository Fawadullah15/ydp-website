import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [volunteers, total] = await Promise.all([
      prisma.volunteerApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' }
      }),
      prisma.volunteerApplication.count({ where })
    ]);

    return NextResponse.json({
      volunteers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const volunteer = await prisma.volunteerApplication.create({
      data: {
        ...body,
        status: 'PENDING'
      }
    });

    const { createAdminNotification } = await import('@/lib/notifications');
    await createAdminNotification({
      title: 'New Volunteer Application',
      description: `${body.firstName} ${body.lastName} applied to volunteer.`,
      category: 'VOLUNTEER',
      priority: 'MEDIUM',
      link: `/admin/volunteers/${volunteer.id}`,
      relatedId: volunteer.id,
    });

    return NextResponse.json({ success: true, volunteer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
