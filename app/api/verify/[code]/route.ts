import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const verificationCodeSchema = z.string().trim().toUpperCase().regex(
  /^YDP-(?:CERT-)?[A-Z0-9-]{4,64}$/,
  'Enter a valid membership ID or certificate code.',
);

const publicMembershipStatus = (status: string, expiresAt: Date | null) => {
  if (expiresAt && expiresAt.getTime() < Date.now()) return 'EXPIRED';
  return status;
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code: rawCode } = await params;
    const parsedCode = verificationCodeSchema.safeParse(rawCode);
    if (!parsedCode.success) {
      return NextResponse.json({ valid: false, error: 'Enter a valid membership ID or certificate code.' }, { status: 400 });
    }
    const code = parsedCode.data;

    // Check if it's a member QR code
    if (code.startsWith('YDP-')) {
      const member = await prisma.member.findUnique({
        where: { memberId: code }
      });

      if (member) {
        const status = publicMembershipStatus(member.status, member.expiresAt);
        return NextResponse.json({
          valid: true,
          type: 'MEMBER',
          data: {
            name: `${member.firstName} ${member.lastName}`,
            memberId: member.memberId,
            status,
            chapter: member.province || member.city || null,
            position: member.occupation || null,
            membershipType: member.membershipType,
            verificationDate: member.approvedAt || member.joinedAt,
            expiresAt: member.expiresAt,
            photo: member.photo,
            qrCode: member.qrCode,
          }
        });
      }
    }

    // Check if it's a certificate QR code
    if (code.startsWith('YDP-CERT-')) {
      const certificate = await prisma.certificate.findUnique({
        where: { certificateId: code },
        include: { member: true }
      });

      if (certificate) {
        return NextResponse.json({
          valid: true,
          type: 'CERTIFICATE',
          data: {
            certificateId: certificate.certificateId,
            title: certificate.title,
            issuedAt: certificate.issuedAt,
            recipientName: certificate.member ? `${certificate.member.firstName} ${certificate.member.lastName}` : certificate.recipientName,
            description: certificate.description,
            status: certificate.status,
          }
        });
      }
    }

    return NextResponse.json({ valid: false, error: 'Invalid or unknown QR code' }, { status: 404 });
  } catch (error) {
    console.error('Credential verification failed', error);
    return NextResponse.json({ valid: false, error: 'The verification service is temporarily unavailable. Please try again.' }, { status: 500 });
  }
}
