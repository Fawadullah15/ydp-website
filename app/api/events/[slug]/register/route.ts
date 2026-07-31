import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventRegistrationSchema } from '@/lib/validators';
import { sendMail, eventRegistrationEmail } from '@/lib/email';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const parsed = eventRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { slug: slug },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    const now = new Date();
    if (!event.isPublic || event.status !== 'UPCOMING' || !event.registrationOpen || event.registrationMode !== 'INTERNAL') {
      return NextResponse.json({ error: 'Registration is not open for this event' }, { status: 400 });
    }
    if (event.startDate <= now || (event.registrationDeadline && event.registrationDeadline < now)) {
      return NextResponse.json({ error: 'Registration for this event has closed' }, { status: 400 });
    }

    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      return NextResponse.json({ error: 'Event is at full capacity' }, { status: 400 });
    }

    // Check if already registered
    const existing = await prisma.eventRegistration.findFirst({
      where: { eventId: event.id, email: parsed.data.email }
    });

    if (existing) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 409 });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        ...parsed.data
      }
    });

    const { createAdminNotification } = await import('@/lib/notifications');
    await createAdminNotification({
      title: 'New Event Registration',
      description: `${parsed.data.name} registered for ${event.title}.`,
      category: 'EVENT',
      priority: 'LOW',
      link: `/admin/events/${event.slug}`,
      relatedId: registration.id,
    });

    await sendMail(
      parsed.data.email, 
      `Registration Confirmed: ${event.title}`, 
      eventRegistrationEmail(parsed.data.name, {
        title: event.title,
        date: event.startDate.toLocaleDateString(),
        venue: event.venue || 'TBD'
      })
    );

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
