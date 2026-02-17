import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabaseClient';

export async function GET() {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const { data, error } = await supabase
        .from('videos')
        .select('slug');

    if (error || !data || data.length === 0) {
        return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const randomSlug = data[randomIndex].slug;

    return NextResponse.json({ slug: randomSlug });
}
