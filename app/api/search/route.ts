import { NextRequest, NextResponse } from 'next/server';
import { searchVideos } from '@/lib/queries';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    const results = await searchVideos(query);
    return NextResponse.json(results);
}
