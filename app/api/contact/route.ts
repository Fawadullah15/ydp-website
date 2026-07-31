import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma'; // Assuming prisma client is here
import { sendMail, contactConfirmationEmail, contactNotificationEmail } from '@/lib/email';
import { contactSchema } from '@/lib/validators';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count()
    ]);

    return NextResponse.json({
      contacts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// Simple in-memory rate limiting (IP -> { count, resetTime })
// In production, use Redis.
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const limit = 5;

    let rateInfo = rateLimit.get(ip);
    if (!rateInfo || now > rateInfo.resetTime) {
      rateInfo = { count: 0, resetTime: now + windowMs };
    }
    
    if (rateInfo.count >= limit) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    rateInfo.count += 1;
    rateLimit.set(ip, rateInfo);

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Save to DB
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      }
    });

    // Create Notification
    const { createAdminNotification } = await import('@/lib/notifications');
    await createAdminNotification({
      title: 'New Contact Form Submission',
      description: `${data.name} sent a message: ${data.subject}`,
      category: 'CONTACT',
      priority: 'LOW',
      link: '/admin/contacts',
      relatedId: contact.id,
    });

    // Send emails
    await Promise.all([
      sendMail('infoyda2024@gmail.com', `New Contact Submission: ${data.subject}`, contactNotificationEmail(data)),
      sendMail(data.email, 'Thank you for contacting YDP', contactConfirmationEmail(data.name))
    ]);

    return NextResponse.json({ success: true, message: 'Message sent successfully', contactId: contact.id }, { status: 201 });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
