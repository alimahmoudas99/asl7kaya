import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path } = body;

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        revalidatePath(path);
        return NextResponse.json({ revalidated: true, path });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to revalidate: ' + error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        revalidatePath(path);
        return NextResponse.json({ revalidated: true, path });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to revalidate: ' + error.message }, { status: 500 });
    }
}
