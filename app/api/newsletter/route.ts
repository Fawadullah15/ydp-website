import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { email, name } = parsed.data;

    // Use upsert to handle duplicates easily without erroring
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { name, active: true },
      create: { email, name, active: true },
    });

    return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
