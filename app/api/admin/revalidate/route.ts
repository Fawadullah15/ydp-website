import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user || !allowedRoles.includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  revalidatePath('/about');
  revalidatePath('/hwo');
  revalidatePath('/partner');
  revalidatePath('/privacy');
  revalidatePath('/terms');
  return NextResponse.json({ success: true, message: 'Public website cache refreshed.' });
}
