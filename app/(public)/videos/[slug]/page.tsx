import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import VideoCard from '@/components/VideoCard';
import { getVideoBySlug, getRelatedVideos } from '@/lib/queries';

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    let slug = resolvedParams.slug;

    try {
        slug = decodeURIComponent(slug);
    } catch (e) { }

    const video = await getVideoBySlug(slug);

    if (!video) {
        return { title: 'فيديو غير موجود' };
    }

    return {
        title: video.title,
        description: video.excerpt,
        openGraph: {
            title: video.title,
            description: video.excerpt,
            type: 'article',
            images: video.thumbnail_url ? [video.thumbnail_url] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: video.title,
            description: video.excerpt,
            images: video.thumbnail_url ? [video.thumbnail_url] : [],
        },
    };
}

export const revalidate = 60; // ISR validation

export default async function VideoPage({ params }: Props) {
    const resolvedParams = await params;
    let slug = resolvedParams.slug;

    // Ensure slug is decoded (handles Arabic characters from URL)
    try {
        slug = decodeURIComponent(slug);
    } catch (e) {
        console.warn('Failed to decode slug:', slug);
    }

    const video = await getVideoBySlug(slug);

    if (!video) {
        notFound();
    }

    // Get related videos
    const relatedVideos = await getRelatedVideos(video.category_id, video.id);

    const formattedDate = new Date(video.published_at).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: video.title,
        description: video.excerpt,
        image: video.thumbnail_url,
        datePublished: video.published_at,
        author: {
            '@type': 'Organization',
            name: 'أصل الحكاية',
        },
    };

    return (
        <div className="video-detail">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="video-detail__container" itemScope itemType="https://schema.org/Article">
                {/* Header */}
                <header className="mb-8">
                    {(video.categories as unknown as { name: string })?.name && (
                        <span className="video-detail__category-badge">
                            {(video.categories as unknown as { name: string }).name}
                        </span>
                    )}

                    <h1 className="video-detail__title" itemProp="headline">{video.title}</h1>
                    <p className="video-detail__excerpt">{video.excerpt}</p>

                    <div className="video-detail__meta">
                        <div className="video-detail__meta-item">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time itemProp="datePublished" dateTime={video.published_at}>
                                {formattedDate}
                            </time>
                        </div>
                        {video.location && (
                            <div className="video-detail__meta-item">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{video.location}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Video Player */}
                <div className="video-detail__player">
                    <VideoPlayer
                        youtubeId={video.youtube_id}
                        title={video.title}
                        thumbnailUrl={video.thumbnail_url || undefined}
                    />
                </div>

                {/* People Involved (Tags) */}
                {video.people_involved && video.people_involved.length > 0 && (
                    <div className="video-detail__people">
                        <h3 className="video-detail__people-title">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            شخصيات القصة:
                        </h3>
                        <div className="video-detail__people-list">
                            {video.people_involved.map((person, index) => (
                                <span key={index} className="video-detail__people-tag">
                                    {person}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <div
                    className="article-content"
                    itemProp="articleBody"
                    dangerouslySetInnerHTML={{ __html: video.content }}
                />

                {/* Related Videos */}
                {relatedVideos.length > 0 && (
                    <>
                        <div className="video-detail__divider" />
                        <div className="video-detail__related">
                            <h2 className="video-detail__related-title">قصص ذات صلة</h2>
                            <div className="video-detail__related-grid">
                                {relatedVideos.map((related) => (
                                    <VideoCard key={related.id} video={related} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </article>
        </div>
    );
}
