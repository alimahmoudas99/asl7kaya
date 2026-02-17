import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import Newsletter from '@/components/Newsletter';
import { getAllVideos, getAllCategories, getBestVideos, getTrendingVideos } from '@/lib/queries';

export const revalidate = 60; // ISR

export default async function Home() {
    const [videos, categories, bestVideos, trendingVideos] = await Promise.all([
        getAllVideos(),
        getAllCategories(),
        getBestVideos(6),
        getTrendingVideos(6),
    ]);

    return (
        <div className="home" itemScope itemType="https://schema.org/WebSite">
            {/* Hero Section */}
            <section className="home__hero">
                <div className="home__hero-bg" />
                <div className="home__hero-orbs">
                    <div className="home__hero-orb home__hero-orb--1" />
                    <div className="home__hero-orb home__hero-orb--2" />
                </div>
                <div className="home__hero-radial" />

                <div className="home__hero-content animate-fade-in-up">
                    <div className="home__badge">
                        <span className="home__badge-dot" />
                        <span>قصص حقيقية لن تصدقها</span>
                    </div>

                    <h1 className="home__heading">
                        <span className="gradient-text" itemProp="name">أصل الحكاية</span>
                    </h1>

                    <p className="home__subheading" itemProp="description">
                        نستكشف أغرب القضايا وأكثرها إثارة. جرائم حقيقية، اختفاءات غامضة، وقصص لم تُرِو من قبل.
                    </p>

                    <div className="home__social-links">
                        <a href="https://www.youtube.com/@AliMahmoud-99" target="_blank" rel="noopener noreferrer" className="home__social-link home__social-link--youtube" aria-label="YouTube">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                        </a>
                        <a href="https://www.tiktok.com/@asl7kaya" target="_blank" rel="noopener noreferrer" className="home__social-link home__social-link--tiktok" aria-label="TikTok">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.9-.23-2.74.12-.69.31-1.27.87-1.62 1.54-.53.86-.54 1.9-.11 2.79.38.74.99 1.3 1.76 1.54.43.14.88.18 1.33.15.75-.04 1.49-.35 2-.85.73-.67 1.11-1.72 1.11-2.73 0-4.06.02-8.12-.02-12.18z" /></svg>
                        </a>
                        <a href="https://www.facebook.com/asl7kaya" target="_blank" rel="noopener noreferrer" className="home__social-link home__social-link--facebook" aria-label="Facebook">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </a>
                        <a href="https://www.instagram.com/asl7kaya/" target="_blank" rel="noopener noreferrer" className="home__social-link home__social-link--instagram" aria-label="Instagram">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" /></svg>
                        </a>

                    </div>

                    <div className="home__cta-group">
                        <a href="#all-stories" className="home__cta-primary">
                            شاهد جميع القصص
                        </a>
                        <Link href="/about" className="home__cta-secondary">
                            من نحن
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="home__stats">
                        <div>
                            <div className="home__stat-value">+100K</div>
                            <div className="home__stat-label">مشاهدة</div>
                        </div>
                        <div>
                            <div className="home__stat-value">{categories.length}</div>
                            <div className="home__stat-label">تصنيف</div>
                        </div>
                        <div>
                            <div className="home__stat-value">+{videos.length}</div>
                            <div className="home__stat-label">قصة</div>
                        </div>
                    </div>
                </div>

                <div className="home__scroll">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Categories */}
            <section className="home__categories">
                <div className="home__categories-grid">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/category/${cat.slug}`} className="home__category-pill">
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending Section */}
            {trendingVideos.length > 0 && (
                <section className="home__trending">
                    <div className="home__trending-header">
                        <div className="home__trending-header-content">
                            <div className="home__trending-badge">
                                <span className="home__trending-badge-fire">🔥</span>
                                تريند دلوقتي
                            </div>
                            <h2 className="home__trending-title gradient-text">الأكثر مشاهدة</h2>
                            <p className="home__trending-desc">القصص اللي الناس مش قادرة تبطل تتفرج عليها</p>
                        </div>
                    </div>

                    <div className="home__videos-grid">
                        {trendingVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </section>
            )}

            {/* Best Videos Section */}
            {bestVideos.length > 0 && (
                <section className="home__best">
                    <div className="home__best-header">
                        <div className="home__best-header-content">
                            <div className="home__best-badge">الأكثر شهرة</div>
                            <h2 className="home__best-title gradient-text">الأفضل مشاهدة</h2>
                            <p className="home__best-desc">قصص غامضة ومثيرة استحوذت على اهتمام الجميع</p>
                        </div>
                        <Link href="/videos/best" className="home__best-view-all">
                            مشاهدة الكل
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="home__videos-grid">
                        {bestVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </section>
            )}

            {/* Latest Videos */}
            <section id="all-stories" className="home__latest">
                <div className="home__latest-header">
                    <h2 className="gradient-text">جميع القصص</h2>
                    <div className="home__latest-divider" />
                </div>

                {videos.length > 0 ? (
                    <div className="home__videos-grid">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="home__empty">
                        <div className="home__empty-icon">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="home__empty-title">لا توجد قصص حالياً</h3>
                        <p className="home__empty-desc">تابعنا قريباً لمشاهدة أحدث القصص</p>
                    </div>
                )}
            </section>

            {/* Newsletter */}
            <Newsletter />

            {/* YouTube CTA */}
            <section className="home__yt-cta">
                <div className="home__yt-cta-box">
                    <div className="home__yt-cta-radial" />
                    <div className="home__yt-cta-content">
                        <h2 className="home__yt-cta-title">انضم إلى مجتمعنا</h2>
                        <p className="home__yt-cta-desc">
                            تابعنا على يوتيوب واشترك في القناة ليصلك كل جديد من قصص الجرائم والغموض
                        </p>
                        <a
                            href="https://youtube.com/@AliMahmoud-99?sub_confirmation=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home__yt-cta-btn"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            تابعنا على يوتيوب
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
