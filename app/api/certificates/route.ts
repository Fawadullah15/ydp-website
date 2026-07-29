import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import QRCode from 'qrcode';
import { sendMail, certificateEmail } from '@/lib/email';

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

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
        include: { member: { select: { firstName: true, lastName: true, email: true } } }
      }),
      prisma.certificate.count()
    ]);

    return NextResponse.json({
      certificates,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
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
    const { memberId, recipientName, recipientEmail, type, description } = body;

    const year = new Date().getFullYear();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const certId = `YDP-CERT-${year}-${randomDigits}`;

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    // Use member ID if provided, otherwise generic recipient details
    const certData: any = {
      certificateId: certId,
      title: type || 'Certificate of Participation',
      description,
      qrCode: qrDataUrl,
      verifyUrl,
      recipientName: recipientName || '',
    };

    if (memberId) certData.memberId = memberId;
    if (recipientName) certData.recipientName = recipientName;
    if (recipientEmail) certData.recipientEmail = recipientEmail;

    const certificate = await prisma.certificate.create({
      data: certData,
      include: { member: true }
    });

    const emailTo = certificate.member?.email || recipientEmail;
    const nameTo = certificate.member ? `${certificate.member.firstName} ${certificate.member.lastName}` : recipientName;

    if (emailTo) {
      await sendMail(emailTo, 'Your YDP Certificate is Ready', certificateEmail(nameTo || 'User', certId, verifyUrl));
    }

    return NextResponse.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    console.error('Certificate error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
