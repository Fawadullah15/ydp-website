import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { memberRegistrationSchema } from '@/lib/validators';
import { sendMail, welcomeEmail } from '@/lib/email';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = memberRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    const existingMember = await prisma.member.findUnique({ where: { email: data.email } });
    if (existingMember) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const year = new Date().getFullYear();
    const memberId = `YDP-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const qrDataUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify/${memberId}`
    );

    const member = await prisma.member.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        memberId,
        qrCode: qrDataUrl,
        status: 'PENDING',
      }
    });

    await sendMail(data.email, 'Welcome to YDP - Application Received', welcomeEmail(data.firstName));

    return NextResponse.json({ success: true, member: { id: member.id, memberId: member.memberId, status: member.status } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
