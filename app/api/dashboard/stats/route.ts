import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Execute multiple aggregations in parallel
    const [
      totalMembers,
      pendingMembers,
      totalEvents,
      upcomingEvents,
      totalNews,
      totalVolunteers,
      pendingVolunteers,
      totalContacts,
      recentLogs,
      provinceCounts
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'PENDING' } }),
      prisma.event.count(),
      prisma.event.count({ where: { status: 'UPCOMING' } }),
      prisma.news.count(),
      prisma.volunteerApplication.count(),
      prisma.volunteerApplication.count({ where: { status: 'PENDING' } }),
      prisma.contact.count(),
      prisma.activityLog.findMany({ take: 6, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } }),
      prisma.member.groupBy({ by: ['province'], where: { province: { not: null } }, _count: { _all: true } })
    ]);

    const now = new Date();
    const memberGrowth = await Promise.all(Array.from({ length: 7 }, async (_, index) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const members = await prisma.member.count({ where: { createdAt: { gte: start, lt: end } } });
      return { name: start.toLocaleString('en-US', { month: 'short' }), members };
    }));

    // Construct response
    const stats = {
      members: { total: totalMembers, pending: pendingMembers },
      events: { total: totalEvents, upcoming: upcomingEvents },
      news: { total: totalNews },
      volunteers: { total: totalVolunteers, pending: pendingVolunteers },
      contacts: { total: totalContacts },
      memberGrowth,
      provinceData: provinceCounts.map(item => ({ name: item.province || 'Unspecified', value: item._count._all })),
      recentActivity: recentLogs.map(m => ({
        id: m.id,
        action: m.action,
        details: m.details || m.action,
        date: m.createdAt
        ,user: m.user
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
