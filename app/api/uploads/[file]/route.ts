import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const allowedExtensions: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  pdf: 'application/pdf', mp4: 'video/mp4', webm: 'video/webm',
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const matched = /^([a-f0-9]{16})\.(jpg|jpeg|png|gif|webp|pdf|mp4|webm)$/i.exec(file);
  if (!matched) return NextResponse.json({ error: 'File not found' }, { status: 404 });

  const extension = matched[2].toLowerCase();
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', file);
    const fileContents = await readFile(filePath);
    return new NextResponse(fileContents, {
      headers: {
        'Content-Type': allowedExtensions[extension],
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
