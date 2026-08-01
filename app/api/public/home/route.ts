import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [events, news, provinces, leaders, galleryItems, testimonials, sponsors, memberCount, volunteerCount, eventCount, settings] = await Promise.all([
      prisma.event.findMany({ where: { isPublic: true, status: 'UPCOMING' }, orderBy: { startDate: 'asc' }, take: 3 }),
      prisma.news.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 3 }),
      prisma.province.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 5 }),
      prisma.leadershipProfile.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }], take: 4 }),
      prisma.galleryItem.findMany({ where: { isPublic: true, type: 'IMAGE' }, include: { album: { select: { title: true, isPublic: true } } }, orderBy: { createdAt: 'desc' }, take: 30 }),
      prisma.testimonial.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], take: 4 }),
      prisma.sponsor.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], take: 8 }),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.volunteerApplication.count({ where: { status: 'APPROVED' } }),
      prisma.event.count({ where: { isPublic: true } }),
      prisma.setting.findMany({ where: { key: { in: ['contact_email', 'contact_phone', 'contact_address', 'stat_members', 'stat_provinces', 'stat_events', 'stat_volunteers'] } } }),
    ]);

    const seenUrls = new Set<string>();
    const gallery = galleryItems.filter((item) => {
      if ((item.album && !item.album.isPublic) || seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return true;
    }).slice(0, 6);
    const siteSettings = Object.fromEntries(settings.map((setting) => [setting.key, setting.value || '']));

    const displayStat = (key: string, fallback: number) => {
      const value = siteSettings[key]?.trim();
      if (!value || !/^\d+$/.test(value)) return fallback;
      return Number(value);
    };

    return NextResponse.json({
      events, news, provinces, leaders, gallery, testimonials, sponsors,
      stats: {
        members: displayStat('stat_members', 2550 + memberCount),
        provinces: displayStat('stat_provinces', provinces.length > 0 ? provinces.length : 5),
        events: displayStat('stat_events', 34 + eventCount),
        volunteers: displayStat('stat_volunteers', 5392 + volunteerCount),
      },
      settings: siteSettings,
    }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    console.error('Public home data error:', error);
    return NextResponse.json({ error: 'Unable to load home page data' }, { status: 500 });
  }
}
