import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/lib/types';

interface RelatedSidebarProps {
    videos: Video[];
}

export default function RelatedSidebar({ videos }: RelatedSidebarProps) {
    if (videos.length === 0) return null;

    const getYoutubeId = (idOrUrl: string) => {
        if (!idOrUrl) return '';
        if (/^[a-zA-Z0-9_-]{11}$/.test(idOrUrl)) return idOrUrl;
        const match = idOrUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : idOrUrl;
    };

    return (
        <aside className="related-sidebar">
            <h3 className="related-sidebar__title">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                قصص مشابهة
            </h3>
            <div className="related-sidebar__list">
                {videos.map((video) => {
                    const youtubeId = getYoutubeId(video.youtube_id);
                    const thumb = (video.thumbnail_url && video.thumbnail_url.trim() !== '')
                        ? video.thumbnail_url
                        : `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
                    const categoryName = (video.categories as unknown as { name: string })?.name || '';

                    return (
                        <Link key={video.id} href={`/videos/${video.slug}`} className="related-sidebar__card">
                            <div className="related-sidebar__card-thumb">
                                <Image
                                    src={thumb}
                                    alt={video.title}
                                    fill
                                    sizes="120px"
                                    style={{ objectFit: 'cover' }}
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgZmlsbD0iIzExMTgyNyIvPjwvc3ZnPg=="
                                />
                            </div>
                            <div className="related-sidebar__card-info">
                                <h4 className="related-sidebar__card-title">{video.title}</h4>
                                {categoryName && (
                                    <span className="related-sidebar__card-category">{categoryName}</span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
