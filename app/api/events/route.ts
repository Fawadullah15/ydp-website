import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import { eventSchema } from '@/lib/validators';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    const canManage = !!user && allowedRoles.includes(user.role);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100'); // Fetch more for now
    const status = searchParams.get('status');
    const province = searchParams.get('province');
    const type = searchParams.get('type');
    
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!canManage) where.isPublic = true;
    if (status) where.status = status;
    if (province) where.provinceId = province;
    if (type) where.type = type;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: { province: { select: { id: true, name: true } } }
      }),
      prisma.event.count({ where })
    ]);

    return NextResponse.json(events); // Returning array directly for simpler frontend logic
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
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    // Generate unique slug from title
    const baseSlug = parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const timestamp = Date.now().toString(36);
    const slug = `${baseSlug}-${timestamp}`;

    const event = await prisma.event.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
        venue: parsed.data.venue,
        city: parsed.data.city,
        type: parsed.data.type || 'WORKSHOP',
        maxAttendees: parsed.data.maxAttendees,
        image: parsed.data.image,
        coverImage: parsed.data.coverImage || null,
        registrationMode: parsed.data.registrationMode,
        registrationLink: parsed.data.registrationLink || null,
        registrationDeadline: parsed.data.registrationDeadline ? new Date(parsed.data.registrationDeadline) : null,
        registrationOpen: parsed.data.registrationMode === 'INTERNAL',
        slug,
        status: parsed.data.status || 'UPCOMING',
        authorId: user.id,
        provinceId: parsed.data.provinceId || null,
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error('Event POST error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}
