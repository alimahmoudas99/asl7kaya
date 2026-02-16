import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import VideoCard from '@/components/VideoCard';
import { getVideoBySlug, getRelatedVideos, incrementVideoViews } from '@/lib/queries';
import {
    generateVideoMetadata,
    generateArticleSchema,
    generateVideoObjectSchema,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateVideoFAQs,
    SITE_CONFIG,
    calculateReadingTime,
} from '@/lib/seo';

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
        return {
            title: 'فيديو غير موجود',
            robots: { index: false, follow: false },
        };
    }

    return generateVideoMetadata(video);
}

export const revalidate = 3600;

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

    // Increment views (internal tracking)
    await incrementVideoViews(video.id);

    // Get related videos
    const relatedVideos = await getRelatedVideos(video.category_id, video.id);

    const formattedDate = new Date(video.published_at).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const updatedDate = new Date(video.updated_at).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const categoryName = (video.categories as unknown as { name: string })?.name || '';
    const categorySlug = (video.categories as unknown as { slug: string })?.slug || '';

    const articleSchema = generateArticleSchema(video);
    const videoObjectSchema = generateVideoObjectSchema(video);
    const faqItems = generateVideoFAQs(video);
    const faqSchema = generateFAQSchema(faqItems);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'الرئيسية', url: SITE_CONFIG.url },
        { name: categoryName, url: `${SITE_CONFIG.url}/category/${categorySlug}` },
        { name: video.title, url: `${SITE_CONFIG.url}/videos/${video.slug}` },
    ]);

    const readingTime = calculateReadingTime(video.content);

    return (
        <div className="video-detail">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <article className="video-detail__container" itemScope itemType="https://schema.org/Article">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <ol className="breadcrumb__list" itemScope itemType="https://schema.org/BreadcrumbList">
                        <li className="breadcrumb__item" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <a itemProp="item" href="/">
                                <span itemProp="name">الرئيسية</span>
                            </a>
                            <meta itemProp="position" content="1" />
                        </li>
                        {categoryName && (
                            <li className="breadcrumb__item" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <a itemProp="item" href={`/category/${categorySlug}`}>
                                    <span itemProp="name">{categoryName}</span>
                                </a>
                                <meta itemProp="position" content="2" />
                            </li>
                        )}
                        <li className="breadcrumb__item breadcrumb__item--active" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <span itemProp="name">{video.title}</span>
                            <meta itemProp="position" content="3" />
                        </li>
                    </ol>
                </nav>

                <header className="mb-8">
                    {categoryName && (
                        <a href={`/category/${categorySlug}`} className="video-detail__category-badge">
                            {categoryName}
                        </a>
                    )}

                    <h1 className="video-detail__title" itemProp="headline">{video.title}</h1>
                    <p className="video-detail__excerpt" itemProp="description">{video.excerpt}</p>

                    <div className="video-detail__meta">
                        <div className="video-detail__meta-item">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time itemProp="datePublished" dateTime={video.published_at}>
                                {formattedDate}
                            </time>
                        </div>
                        <div className="video-detail__meta-item">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{readingTime} دقائق قراءة</span>
                        </div>
                        {video.location && (
                            <div className="video-detail__meta-item">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span itemProp="contentLocation">{video.location}</span>
                            </div>
                        )}
                    </div>
                    {video.updated_at !== video.published_at && (
                        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                            <meta itemProp="dateModified" content={video.updated_at} />
                            آخر تحديث: {updatedDate}
                        </div>
                    )}
                    <meta itemProp="author" content={SITE_CONFIG.author} />
                    <meta itemProp="inLanguage" content="ar" />
                </header>

                {/* Video Player or Redirect Thumbnail */}
                <div className="video-detail__player">
                    {video.is_external_only ? (
                        <a
                            href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="video-detail__external-preview"
                        >
                            <div
                                className="video-detail__external-thumb"
                                style={{ backgroundImage: `url(${video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`})` }}
                            />
                            <div className="video-detail__external-overlay">
                                <div className="video-detail__external-play-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span className="video-detail__external-hint">شاهد القصة كاملة على يوتيوب</span>
                            </div>
                        </a>
                    ) : (
                        <VideoPlayer
                            youtubeId={video.youtube_id}
                            title={video.title}
                            thumbnailUrl={video.thumbnail_url || undefined}
                        />
                    )}
                </div>
                <div
                    className="article-content"
                    itemProp="articleBody"
                    dangerouslySetInnerHTML={{ __html: video.content }}
                />

                <section className="faq-section" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>الأسئلة الشائعة</h2>
                    <div>
                        {faqItems.map((faq, index) => (
                            <div key={index} style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                                    {faq.question}
                                </h3>
                                <div>
                                    <p style={{ color: '#444', lineHeight: '1.6' }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
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
