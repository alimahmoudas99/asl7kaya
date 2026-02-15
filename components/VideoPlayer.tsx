'use client';

import { useState } from 'react';

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
        // If it's already a short ID (11 characters, alphanumeric + - _)
        if (/^[a-zA-Z0-9_-]{11}$/.test(idOrUrl)) {
            return idOrUrl;
        }

        // Try to extract from URL
        const match = idOrUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : idOrUrl;
    };

    const validId = getYoutubeId(youtubeId);

    // Update poster to use validId if no custom thumbnail
    const poster = thumbnailUrl || `https://img.youtube.com/vi/${validId}/maxresdefault.jpg`;

    if (!isPlaying) {
        return (
            <div
                className="video-player"
                onClick={() => setIsPlaying(true)}
            >
                <div className="video-player__placeholder">
                    <div
                        className="video-player__thumbnail"
                        style={{ backgroundImage: `url(${poster})` }}
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

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <div className="video-player">
            <iframe
                className="video-player__iframe"
                src={`https://www.youtube.com/embed/${validId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin=${origin}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>

    );
}
