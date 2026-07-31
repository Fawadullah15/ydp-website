import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/custom-auth';
import { put } from '@vercel/blob';

const allowedRoles = ['SUPER_ADMIN', 'FOUNDER', 'PRESIDENT', 'ADMIN'];

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isVideo = file.type === 'video/mp4' || file.type === 'video/webm';
    const maxBytes = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: `File size exceeds ${isVideo ? '50MB' : '10MB'} limit` }, { status: 400 });
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Use Vercel Blob for storage
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
