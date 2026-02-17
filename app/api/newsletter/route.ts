import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'بريد إلكتروني غير صالح' }, { status: 400 });
        }

        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
        }

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email: email.toLowerCase().trim() });

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'هذا البريد مشترك بالفعل!' }, { status: 409 });
            }
            console.error('Newsletter subscribe error:', error);
            return NextResponse.json({ error: 'حدث خطأ، حاول مرة أخرى' }, { status: 500 });
        }

        return NextResponse.json({ message: 'تم الاشتراك بنجاح!' });
    } catch {
        return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
    }
}
