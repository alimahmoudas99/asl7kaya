'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/lib/types';

export default function VideoCard({ video }: { video: Video }) {
    const [isHovered, setIsHovered] = useState(false);

    const getYoutubeId = (idOrUrl: string) => {
        if (!idOrUrl) return '';
        if (/^[a-zA-Z0-9_-]{11}$/.test(idOrUrl)) {
            return idOrUrl;
        }
        const match = idOrUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : idOrUrl;
    };

    const validYoutubeId = getYoutubeId(video.youtube_id);
    const thumbnailUrl = (video.thumbnail_url && video.thumbnail_url.trim() !== '')
        ? video.thumbnail_url
        : `https://img.youtube.com/vi/${validYoutubeId}/maxresdefault.jpg`;
    const categoryName = (video.categories as unknown as { name: string })?.name || 'قصة';

    const formattedDate = new Date(video.published_at).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const youtubeUrl = `https://www.youtube.com/watch?v=${validYoutubeId}`;

    return (
        <Link
            href={`/videos/${video.slug}`}
            className={`video-card ${video.is_external_only ? 'video-card--external' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <article className="video-card__article" itemScope itemType="https://schema.org/CreativeWork">
                <meta itemProp="image" content={thumbnailUrl} />
                <link itemProp="url" href={`/videos/${video.slug}`} />
                {/* Thumbnail Layer */}
                <div className="video-card__thumbnail" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <Image
                        src={thumbnailUrl}
                        alt={video.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="video-card__thumbnail-img"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
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

                    {video.is_external_only && (
                        <div className="video-card__external-badge">
                            يوتيوب
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="video-card__content">
                    <h3 className="video-card__title" itemProp="name">
                        {video.title}
                    </h3>
                    <p className="video-card__excerpt" itemProp="description">
                        {video.excerpt}
                    </p>

                    <div className="video-card__meta">
                        <div className="video-card__meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formattedDate}</span>
                        </div>

                        {video.is_external_only ? (
                            <div className="video-card__meta-item text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span>مشاهدة على يوتيوب</span>
                            </div>
                        ) : (
                            <div className="video-card__meta-item">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>مشاهدة القصة</span>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
