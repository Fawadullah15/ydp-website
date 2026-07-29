import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/custom-auth';
import { newsArticleSchema } from '@/lib/validators';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    const canManage = !!user && allowedRoles.includes(user.role);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const province = searchParams.get('province');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    const where: any = {};
    if (!canManage) where.status = 'PUBLISHED';
    if (category) where.category = category;
    if (type) where.type = type;
    if (province) where.province = province;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, image: true } },
          category: true,
        }
      }),
      prisma.news.count({ where })
    ]);

    return NextResponse.json(news);
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
    const parsed = newsArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const timestamp = Date.now().toString(36);
    const slug = `${baseSlug}-${timestamp}`;

    let categoryId: string | undefined = undefined;
    if (parsed.data.category) {
      let dbCategory = await prisma.newsCategory.findFirst({ where: { name: parsed.data.category } });
      if (!dbCategory) {
        dbCategory = await prisma.newsCategory.create({
          data: { name: parsed.data.category, slug: parsed.data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        });
      }
      categoryId = dbCategory.id;
    }

    const news = await prisma.news.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        excerpt: parsed.data.excerpt,
        image: parsed.data.image,
        coverImage: parsed.data.coverImage || null,
        type: parsed.data.type || 'NEWS',
        status: parsed.data.status || 'DRAFT',
        tags: parsed.data.tags,
        slug,
        authorId: user.id,
        categoryId,
        publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : undefined,
      }
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error: any) {
    console.error('News POST error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}
