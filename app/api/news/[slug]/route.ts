import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const user = await verifyAuth(req);
    const canManage = !!user && allowedRoles.includes(user.role);
    const news = await prisma.news.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, image: true } },
        category: true,
      }
    });

    if (!news || (!canManage && news.status !== 'PUBLISHED')) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Increment views in background (non-blocking)
    prisma.news.update({
      where: { slug },
      data: { views: { increment: 1 } }
    }).catch(() => {});

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    let categoryId = undefined;
    if (body.category) {
      let dbCategory = await prisma.newsCategory.findFirst({ where: { name: body.category } });
      if (!dbCategory) {
        dbCategory = await prisma.newsCategory.create({
          data: { name: body.category, slug: body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        });
      }
      categoryId = dbCategory.id;
    }

    const updateData: Record<string, unknown> = {};
    for (const key of ['title', 'excerpt', 'content', 'image', 'coverImage', 'status', 'type', 'tags', 'metaTitle', 'metaDesc', 'provinceId']) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }
    if (body.status === 'PUBLISHED' && body.publishedAt === undefined) updateData.publishedAt = new Date();
    const news = await prisma.news.update({
      where: { slug: slug },
      data: {
        ...updateData,
        categoryId: categoryId || body.categoryId
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.news.delete({
      where: { slug: slug }
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
