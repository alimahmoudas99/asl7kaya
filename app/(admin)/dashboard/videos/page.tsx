'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import type { Video } from '@/lib/types';

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
    }, []);

    async function fetchVideos() {
        const { data } = await supabase
            .from('videos')
            .select('*, categories(*)')
            .order('published_at', { ascending: false });

        if (data) setVideos(data);
        setLoading(false);
    }

    async function deleteVideo(id: string) {
        if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;

        await supabase.from('videos').delete().eq('id', id);
        fetchVideos();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="dashboard__page-header-title">إدارة القصص</h1>
                <Link href="/dashboard/videos/new" className="dashboard__btn-add">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    قصة جديدة
                </Link>
            </div>

            <div className="dashboard__table-wrap">
                <table className="dashboard__table">
                    <thead>
                        <tr>
                            <th>الصورة</th>
                            <th>العنوان</th>
                            <th>التصنيف</th>
                            <th>تاريخ النشر</th>
                            <th>المشاهدات</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={5}>
                                        <div className="dashboard__skeleton w-full h-12" />
                                    </td>
                                </tr>
                            ))
                        ) : videos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    لا توجد قصص مضافة حتى الآن
                                </td>
                            </tr>
                        ) : (
                            videos.map((video) => (
                                <tr key={video.id}>
                                    <td>
                                        <div
                                            className="dashboard__table-thumb"
                                            style={{ backgroundImage: `url(${video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/default.jpg`})` }}
                                        />
                                    </td>
                                    <td>
                                        <div className="dashboard__table-title">{video.title}</div>
                                        <div className="dashboard__table-slug">/{video.slug}</div>
                                    </td>
                                    <td>
                                        <span className="text-sm text-gray-400">
                                            {(video.categories as unknown as { name: string })?.name}
                                        </span>
                                    </td>
                                    <td className="text-sm text-gray-400">
                                        {new Date(video.published_at).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="text-sm font-semibold text-primary-400">
                                        {video.views || 0}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/videos/${video.id}/edit`} className="dashboard__btn-edit">
                                                تعديل
                                            </Link>
                                            <button
                                                onClick={() => deleteVideo(video.id)}
                                                className="dashboard__btn-delete"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
