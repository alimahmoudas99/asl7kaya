'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
    const [stats, setStats] = useState({
        videos: 0,
        categories: 0,
        messages: 0,
        totalViews: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const [videosRes, categoriesRes, messagesRes, viewsRes] = await Promise.all([
                supabase.from('videos').select('id', { count: 'exact' }),
                supabase.from('categories').select('id', { count: 'exact' }),
                supabase.from('contact_messages').select('id', { count: 'exact' }),
                supabase.from('videos').select('views'),
            ]);

            const totalViews = viewsRes.data?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

            setStats({
                videos: videosRes.count || 0,
                categories: categoriesRes.count || 0,
                messages: messagesRes.count || 0,
                totalViews,
            });
            setLoading(false);
        }
        fetchStats();
    }, []);

    return (
        <div>
            <div className="dashboard__page-header">
                <h1 className="dashboard__page-header-title">نظرة عامة</h1>
                <p className="dashboard__page-header-desc">مرحباً بك في لوحة تحكم أصل الحكاية</p>
            </div>

            <div className="dashboard__stats">
                <Link href="/dashboard/videos" className="dashboard__stat-card dashboard__stat-card--red">
                    <div className="dashboard__stat-icon dashboard__stat-icon--red">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    {loading ? (
                        <div className="dashboard__stat-skeleton" />
                    ) : (
                        <div className="dashboard__stat-value">{stats.videos}</div>
                    )}
                    <div className="dashboard__stat-label">قصة منشورة</div>
                </Link>

                <Link href="/dashboard/categories" className="dashboard__stat-card dashboard__stat-card--blue">
                    <div className="dashboard__stat-icon dashboard__stat-icon--blue">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    {loading ? (
                        <div className="dashboard__stat-skeleton" />
                    ) : (
                        <div className="dashboard__stat-value">{stats.categories}</div>
                    )}
                    <div className="dashboard__stat-label">تصنيف</div>
                </Link>

                <div className="dashboard__stat-card dashboard__stat-card--green">
                    <div className="dashboard__stat-icon dashboard__stat-icon--green">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    {loading ? (
                        <div className="dashboard__stat-skeleton" />
                    ) : (
                        <div className="dashboard__stat-value">{stats.messages}</div>
                    )}
                    <div className="dashboard__stat-label">رسالة جديدة</div>
                </div>

                <div className="dashboard__stat-card dashboard__stat-card--purple">
                    <div className="dashboard__stat-icon dashboard__stat-icon--purple">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    {loading ? (
                        <div className="dashboard__stat-skeleton" />
                    ) : (
                        <div className="dashboard__stat-value">{stats.totalViews}</div>
                    )}
                    <div className="dashboard__stat-label">إجمالي المشاهدات</div>
                </div>
            </div>

            <h2 className="dashboard__actions-title">إجراءات سريعة</h2>
            <div className="dashboard__actions-grid">
                <Link href="/dashboard/videos/new" className="dashboard__action-card">
                    <div className="dashboard__action-card-icon bg-red-900/20 text-red-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <div className="dashboard__action-card-title">إضافة قصة جديدة</div>
                        <div className="dashboard__action-card-desc">انشر فيديو جديد ومقال</div>
                    </div>
                </Link>
                <Link href="/" target="_blank" className="dashboard__action-card">
                    <div className="dashboard__action-card-icon bg-gray-800 text-gray-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                    <div>
                        <div className="dashboard__action-card-title">زيارة الموقع</div>
                        <div className="dashboard__action-card-desc">عرض الموقع العام</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
