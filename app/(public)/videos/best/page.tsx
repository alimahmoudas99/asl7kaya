import VideoCard from '@/components/VideoCard';
import Breadcrumb from '@/components/Breadcrumb';
import { getBestVideos } from '@/lib/queries';

export const revalidate = 60;

export default async function BestVideosPage() {
    const videos = await getBestVideos(50); // Fetch a larger limit for the dedicated page

    return (
        <div className="category-page">
            <div className="category-page__container">
                <Breadcrumb items={[{ name: 'الأفضل مشاهدة', href: '/videos/best' }]} />

                <div className="category-page__header">
                    <h1 className="category-page__title gradient-text">الأفضل مشاهدة</h1>
                    <p className="category-page__description">
                        مجموعة مختارة من أكثر القصص إثارة ومشاهدة على منصتنا
                    </p>
                </div>
            </div>

            <section className="category-page__videos container">
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
                    </div>
                )}
            </section>
        </div>
    );
}
