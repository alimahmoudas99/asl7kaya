import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import { getLatestVideos, getAllCategories } from '@/lib/queries';

export const revalidate = 60; // ISR

export default async function Home() {
    const [videos, categories] = await Promise.all([
        getLatestVideos(),
        getAllCategories(),
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

                    <div className="home__cta-group">
                        <a href="#latest" className="home__cta-primary">
                            شاهد أحدث القصص
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

            {/* Latest Videos */}
            <section id="latest" className="home__latest">
                <div className="home__latest-header">
                    <h2 className="gradient-text">أحدث القصص</h2>
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
