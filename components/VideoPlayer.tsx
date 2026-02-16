'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VideoPlayer({
    youtubeId,
    title,
    thumbnailUrl
}: {
    youtubeId: string;
    title: string;
    thumbnailUrl?: string;
}) {
    const [isPlaying, setIsPlaying] = useState(false);

    // Helper to extract YouTube ID
    const getYoutubeId = (idOrUrl: string) => {
        if (/^[a-zA-Z0-9_-]{11}$/.test(idOrUrl)) {
            return idOrUrl;
        }
        const match = idOrUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : idOrUrl;
    };

    const validId = getYoutubeId(youtubeId);
    const poster = thumbnailUrl || `https://img.youtube.com/vi/${validId}/maxresdefault.jpg`;
    
    // Standard YouTube embed URL with proper parameters for view tracking
    // Using origin and widget_referrer to ensure YouTube counts the view
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const embedUrl = `https://www.youtube.com/embed/${validId}?autoplay=1&rel=0&modestbranding=1&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}`;

    if (!isPlaying) {
        return (
            <div
                className="video-player"
                onClick={() => setIsPlaying(true)}
                style={{ cursor: 'pointer', position: 'relative', aspectRatio: '16/9' }}
            >
                <div className="video-player__placeholder">
                    <Image
                        src={poster}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="video-player__thumbnail"
                        style={{ objectFit: 'cover' }}
                        priority={false}
                        loading="lazy"
                    />
                    <div className="video-player__overlay" />

                    <div className="video-player__play-btn">
                        <div className="video-player__play-btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="video-player__watch-label">
                        اضغط للمشاهدة
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="video-player" style={{ position: 'relative', aspectRatio: '16/9', width: '100%' }}>
            <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px'
                }}
            />
        </div>
    );
}
