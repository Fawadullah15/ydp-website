import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const user = await verifyAuth(req);
    const canManage = !!user && allowedRoles.includes(user.role);
    const event = await prisma.event.findUnique({
      where: { slug: slug },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event || (!canManage && !event.isPublic)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (body.registrationMode && !['INTERNAL', 'EXTERNAL', 'CLOSED'].includes(body.registrationMode)) {
      return NextResponse.json({ error: 'Registration mode is invalid.' }, { status: 400 });
    }
    if (body.registrationLink) {
      try {
        const registrationUrl = new URL(body.registrationLink);
        if (registrationUrl.protocol !== 'https:') throw new Error('Not HTTPS');
      } catch {
        return NextResponse.json({ error: 'Registration link must be a valid HTTPS URL.' }, { status: 400 });
      }
    }

    // Build clean update payload
    const updateData: any = {};
    const allowed = ['title', 'description', 'content', 'startDate', 'endDate', 'venue', 'city', 'image', 'coverImage', 'status', 'type', 'maxAttendees', 'isPublic', 'registrationOpen', 'registrationMode', 'registrationLink', 'registrationDeadline', 'provinceId', 'metaTitle', 'metaDesc'];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.registrationDeadline) updateData.registrationDeadline = new Date(updateData.registrationDeadline);
    if (updateData.registrationDeadline === '') updateData.registrationDeadline = null;
    if (updateData.startDate && Number.isNaN(updateData.startDate.getTime())) return NextResponse.json({ error: 'Event start date is invalid.' }, { status: 400 });
    if (updateData.endDate && Number.isNaN(updateData.endDate.getTime())) return NextResponse.json({ error: 'Event end date is invalid.' }, { status: 400 });
    if (updateData.registrationDeadline && Number.isNaN(updateData.registrationDeadline.getTime())) return NextResponse.json({ error: 'Registration deadline is invalid.' }, { status: 400 });
    if (updateData.maxAttendees) updateData.maxAttendees = parseInt(updateData.maxAttendees);
    if (updateData.registrationMode === 'EXTERNAL' && !updateData.registrationLink) {
      const existing = await prisma.event.findUnique({ where: { slug }, select: { registrationLink: true } });
      if (!existing?.registrationLink) return NextResponse.json({ error: 'An HTTPS registration link is required for external registration.' }, { status: 400 });
    }
    if (updateData.registrationMode === 'INTERNAL') updateData.registrationOpen = true;
    if (updateData.registrationMode === 'EXTERNAL' || updateData.registrationMode === 'CLOSED') updateData.registrationOpen = false;
    if (updateData.registrationLink === '') updateData.registrationLink = null;

    const event = await prisma.event.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Event PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.event.delete({
      where: { slug: slug }
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
