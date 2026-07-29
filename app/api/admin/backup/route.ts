import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];
const backupVersion = 1;

async function requireAdmin(request: NextRequest) {
  const user = await verifyAuth(request);
  return user && allowedRoles.includes(user.role) ? user : null;
}

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [users, provinces, districts, members, leadershipProfiles, events, eventRegistrations, news, newsCategories, galleryAlbums, galleryItems, certificates, certificateTemplates, resources, volunteerApplications, contacts, newsletters, newsletterSubscribers, sponsors, partners, testimonials, settings, activityLogs] = await Promise.all([
    prisma.user.findMany(), prisma.province.findMany(), prisma.district.findMany(), prisma.member.findMany(), prisma.leadershipProfile.findMany(), prisma.event.findMany(), prisma.eventRegistration.findMany(), prisma.news.findMany(), prisma.newsCategory.findMany(), prisma.galleryAlbum.findMany(), prisma.galleryItem.findMany(), prisma.certificate.findMany(), prisma.certificateTemplate.findMany(), prisma.resource.findMany(), prisma.volunteerApplication.findMany(), prisma.contact.findMany(), prisma.newsletter.findMany(), prisma.newsletterSubscriber.findMany(), prisma.sponsor.findMany(), prisma.partner.findMany(), prisma.testimonial.findMany(), prisma.setting.findMany(), prisma.activityLog.findMany(),
  ]);

  const backup = {
    version: backupVersion,
    exportedAt: new Date().toISOString(),
    data: { users, provinces, districts, members, leadershipProfiles, events, eventRegistrations, news, newsCategories, galleryAlbums, galleryItems, certificates, certificateTemplates, resources, volunteerApplications, contacts, newsletters, newsletterSubscribers, sponsors, partners, testimonials, settings, activityLogs },
  };
  return new NextResponse(JSON.stringify(backup), { headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="ydp-backup-${new Date().toISOString().slice(0, 10)}.json"`, 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const backup = await request.json();
    if (backup?.version !== backupVersion || !backup?.data || typeof backup.data !== 'object') return NextResponse.json({ error: 'Invalid YDP backup file.' }, { status: 400 });
    const d = backup.data as Record<string, any[]>;
    const list = (key: string) => Array.isArray(d[key]) ? d[key] : [];

    await prisma.$transaction(async (tx) => {
      await tx.eventRegistration.deleteMany(); await tx.certificate.deleteMany(); await tx.galleryItem.deleteMany(); await tx.activityLog.deleteMany();
      await tx.event.deleteMany(); await tx.news.deleteMany(); await tx.leadershipProfile.deleteMany(); await tx.district.deleteMany(); await tx.member.deleteMany();
      await tx.galleryAlbum.deleteMany(); await tx.certificateTemplate.deleteMany(); await tx.newsCategory.deleteMany(); await tx.province.deleteMany();
      await tx.resource.deleteMany(); await tx.volunteerApplication.deleteMany(); await tx.contact.deleteMany(); await tx.newsletter.deleteMany(); await tx.newsletterSubscriber.deleteMany();
      await tx.sponsor.deleteMany(); await tx.partner.deleteMany(); await tx.testimonial.deleteMany(); await tx.setting.deleteMany();
      await tx.session.deleteMany(); await tx.account.deleteMany(); await tx.user.deleteMany();

      if (list('users').length) await tx.user.createMany({ data: list('users') });
      if (list('provinces').length) await tx.province.createMany({ data: list('provinces') });
      if (list('districts').length) await tx.district.createMany({ data: list('districts') });
      if (list('members').length) await tx.member.createMany({ data: list('members') });
      if (list('leadershipProfiles').length) await tx.leadershipProfile.createMany({ data: list('leadershipProfiles') });
      if (list('events').length) await tx.event.createMany({ data: list('events') });
      if (list('eventRegistrations').length) await tx.eventRegistration.createMany({ data: list('eventRegistrations') });
      if (list('newsCategories').length) await tx.newsCategory.createMany({ data: list('newsCategories') });
      if (list('news').length) await tx.news.createMany({ data: list('news') });
      if (list('galleryAlbums').length) await tx.galleryAlbum.createMany({ data: list('galleryAlbums') });
      if (list('galleryItems').length) await tx.galleryItem.createMany({ data: list('galleryItems') });
      if (list('certificateTemplates').length) await tx.certificateTemplate.createMany({ data: list('certificateTemplates') });
      if (list('certificates').length) await tx.certificate.createMany({ data: list('certificates') });
      if (list('resources').length) await tx.resource.createMany({ data: list('resources') });
      if (list('volunteerApplications').length) await tx.volunteerApplication.createMany({ data: list('volunteerApplications') });
      if (list('contacts').length) await tx.contact.createMany({ data: list('contacts') });
      if (list('newsletters').length) await tx.newsletter.createMany({ data: list('newsletters') });
      if (list('newsletterSubscribers').length) await tx.newsletterSubscriber.createMany({ data: list('newsletterSubscribers') });
      if (list('sponsors').length) await tx.sponsor.createMany({ data: list('sponsors') });
      if (list('partners').length) await tx.partner.createMany({ data: list('partners') });
      if (list('testimonials').length) await tx.testimonial.createMany({ data: list('testimonials') });
      if (list('settings').length) await tx.setting.createMany({ data: list('settings') });
      if (list('activityLogs').length) await tx.activityLog.createMany({ data: list('activityLogs') });
    }, { timeout: 30000 });
    return NextResponse.json({ success: true, message: 'Backup restored. Sign in again to continue.' });
  } catch (error) {
    console.error('Backup restore error:', error);
    return NextResponse.json({ error: 'Restore failed. The existing database was not changed if validation failed.' }, { status: 500 });
  }
}
