import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import { z } from 'zod';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];
const provinceSchema = z.object({
  name: z.string().trim().min(2).optional(),
  capital: z.string().trim().max(120).nullable().optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  image: z.string().trim().max(2048).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const province = await prisma.province.findUnique({
      where: { slug: slug },
      include: {
        districts: true,
        leadership: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        },
        events: { where: { isPublic: true, status: 'UPCOMING' }, orderBy: { startDate: 'asc' }, take: 6 },
        galleryAlbums: { where: { isPublic: true }, orderBy: { sortOrder: 'asc' }, include: { _count: { select: { items: true } } } },
      }
    });

    if (!province) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(province);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { slug } = await params;
    const parsed = provinceSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    const province = await prisma.province.update({ where: { slug }, data: parsed.data });
    return NextResponse.json(province);
  } catch (error: any) {
    if (error?.code === 'P2002') return NextResponse.json({ error: 'Province name already exists.' }, { status: 409 });
    if (error?.code === 'P2025') return NextResponse.json({ error: 'Province not found.' }, { status: 404 });
    return NextResponse.json({ error: 'Unable to update province.' }, { status: 500 });
  }
}
