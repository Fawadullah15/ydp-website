import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const albumId = searchParams.get('albumId');
    const fetchItems = searchParams.get('fetchItems');

    const user = await verifyAuth(req);
    const canManage = Boolean(user && allowedRoles.includes(user.role));

    if (albumId) {
      const items = await prisma.galleryItem.findMany({
        where: canManage ? { albumId } : { albumId, isPublic: true },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(items);
    } else if (fetchItems) {
      const items = await prisma.galleryItem.findMany({
        where: { isPublic: true, album: { is: { isPublic: true } } },
        orderBy: { createdAt: 'desc' },
        include: { album: true }
      });
      return NextResponse.json(items);
    } else {
      const albums = await prisma.galleryAlbum.findMany({
        where: canManage ? undefined : { isPublic: true },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { items: true } }, province: { select: { id: true, name: true, slug: true } } }
      });
      return NextResponse.json(albums);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type } = body;

    if (type === 'album') {
      if (typeof body.title !== 'string' || body.title.trim().length < 2) {
        return NextResponse.json({ error: 'Album title must contain at least two characters' }, { status: 400 });
      }
      const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
      const album = await prisma.galleryAlbum.create({
        data: {
          title: body.title.trim(),
          slug,
          description: body.description,
          coverImage: body.coverImage || null,
          isPublic: body.isPublic !== false,
          provinceId: typeof body.provinceId === 'string' && body.provinceId ? body.provinceId : null,
        }
      });
      return NextResponse.json(album, { status: 201 });
    } else if (type === 'item') {
      if (
        typeof body.albumId !== 'string' ||
        typeof body.url !== 'string'
      ) {
        return NextResponse.json({ error: 'A valid uploaded image and album are required' }, { status: 400 });
      }
      const item = await prisma.galleryItem.create({
        data: {
          albumId: body.albumId,
          title: body.title,
          url: body.url,
          type: body.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE',
          isPublic: body.isPublic !== false,
        }
      });
      return NextResponse.json(item, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
