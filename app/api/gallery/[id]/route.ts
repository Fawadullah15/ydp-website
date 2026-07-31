import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await verifyAuth(req);
    const canManage = Boolean(user && allowedRoles.includes(user.role));
    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: { items: true }
    });
    if (!album || (!canManage && !album.isPublic)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(canManage ? album : { ...album, items: album.items.filter((item) => item.isPublic) });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    if (body.type === 'item') {
      const data: { title?: string | null; description?: string | null; url?: string; isPublic?: boolean; sortOrder?: number } = {};
      for (const key of ['title', 'description', 'url', 'isPublic', 'sortOrder'] as const) if (body[key] !== undefined) data[key] = body[key];
      return NextResponse.json(await prisma.galleryItem.update({ where: { id }, data }));
    }
    const allowed = ['title', 'description', 'coverImage', 'isPublic', 'sortOrder', 'provinceId'] as const;
    const data: { title?: string; description?: string | null; coverImage?: string | null; isPublic?: boolean; sortOrder?: number; provinceId?: string | null } = {};
    for (const k of allowed) {
      if (body[k] !== undefined) data[k] = body[k];
    }
    const album = await prisma.galleryAlbum.update({ where: { id }, data });
    return NextResponse.json(album);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const { id } = await params;
    
    if (type === 'item') {
      await prisma.galleryItem.delete({ where: { id } });
      return NextResponse.json({ message: 'Item deleted successfully' });
    } else {
      await prisma.$transaction([
        prisma.galleryItem.deleteMany({ where: { albumId: id } }),
        prisma.galleryAlbum.delete({ where: { id } }),
      ]);
      return NextResponse.json({ message: 'Album and all items deleted successfully' });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
