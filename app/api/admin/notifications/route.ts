import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import { auth } from '@/lib/auth';

async function getAuthenticatedUser(req: NextRequest) {
  const customUser = await verifyAuth(req);
  if (customUser) return customUser;
  const session = await auth();
  if (session?.user) return session.user;
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        take: isNaN(limit) || limit <= 0 ? 20 : limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({
        where: { isRead: false },
      }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body
    }

    const targetId = body?.id || body?.notificationId;

    if (targetId && typeof targetId === 'string') {
      await prisma.notification.update({
        where: { id: targetId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    } else {
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
