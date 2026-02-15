'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Video } from '@/lib/types';

export default function VideoCard({ video }: { video: Video }) {
    const [isHovered, setIsHovered] = useState(false);

    const thumbnailUrl = video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;
    const categoryName = (video.categories as unknown as { name: string })?.name || 'قصة';

    const formattedDate = new Date(video.published_at).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Link
            href={`/videos/${video.slug}`}
            className="video-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <article className="video-card__article">
                {/* Thumbnail Layer */}
                <div className="video-card__thumbnail">
                    <div
                        className="video-card__thumbnail-img"
                        style={{ backgroundImage: `url(${thumbnailUrl})` }}
                    />
                    <div className="video-card__thumbnail-overlay" />

                    {/* Play Button Overlay */}
                    <div className="video-card__play">
                        <div className="video-card__play-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="video-card__category">
                        {categoryName}
                    </div>
                </div>

                {/* Content */}
                <div className="video-card__content">
                    <h3 className="video-card__title">
                        {video.title}
                    </h3>
                    <p className="video-card__excerpt">
                        {video.excerpt}
                    </p>

                    <div className="video-card__meta">
                        <div className="video-card__meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formattedDate}</span>
                        </div>

                        <div className="video-card__meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>مشاهدة القصة</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
