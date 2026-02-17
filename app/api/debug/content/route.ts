import { NextRequest, NextResponse } from 'next/server';
import { getVideoBySlug } from '@/lib/queries';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const video = await getVideoBySlug(slug);

    if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({
        id: video.id,
        title: video.title,
        contentLength: video.content.length,
        contentStart: video.content.substring(0, 100),
        contentEnd: video.content.substring(video.content.length - 100),
        isContentHtml: video.content.includes('<'),
    });
}
