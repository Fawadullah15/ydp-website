import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendMail, passwordResetEmail } from '@/lib/email';
import crypto from 'crypto';

const requestResetSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expires,
      }
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ydp.org.pk'}/reset-password?token=${token}`;
    
    // Strict requirement: Password reset requests must send a link only to fawadimraj@gmail.com
    const resetRecipient = 'fawadimraj@gmail.com';
    await sendMail(resetRecipient, `Password Reset Request for ${user.email}`, passwordResetEmail(user.name || 'User', resetUrl));

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' }, { status: 200 });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
