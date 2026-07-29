import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];
const displayStatKeys = new Set(['stat_members', 'stat_provinces', 'stat_events', 'stat_volunteers']);

const publicSettingKeys = [
  'site_name', 'site_tagline', 'site_description', 'site_logo', 'site_favicon',
  'contact_email', 'contact_phone', 'contact_address', 'contact_hours',
  'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin', 'social_youtube',
  'seo_title', 'seo_description', 'seo_keywords', 'seo_og_image',
  'mission_image', 'founder_image',
];

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    const canReadAll = !!user && allowedRoles.includes(user.role);
    const settings = await prisma.setting.findMany({
      where: canReadAll ? undefined : { key: { in: publicSettingKeys } },
    });
    
    // Convert array of key-value pairs to object
    const settingsObj: Record<string, any> = {};
    for (const s of settings) {
      try {
        settingsObj[s.key] = s.type === 'json' ? JSON.parse(s.value || '{}') : s.value;
      } catch {
        settingsObj[s.key] = s.value;
      }
    }

    return NextResponse.json(settingsObj);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid settings payload.' }, { status: 400 });
    
    // body is an object of key-value pairs to upsert
    const results = [];
    for (const [key, value] of Object.entries(body)) {
      if (displayStatKeys.has(key) && value !== '' && (!/^\d+$/.test(String(value)) || Number(value) > 1_000_000_000)) {
        return NextResponse.json({ error: 'Display statistics must be whole numbers between 0 and 1,000,000,000.' }, { status: 400 });
      }
      const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const type = typeof value === 'object' ? 'json' : typeof value === 'boolean' ? 'boolean' : 'text';
      
      const setting = await prisma.setting.upsert({
        where: { key },
        update: { value: strValue },
        create: { key, value: strValue, type, label: key }
      });
      results.push(setting);
    }

    return NextResponse.json({ success: true, settings: results });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

