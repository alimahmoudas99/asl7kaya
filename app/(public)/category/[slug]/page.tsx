import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoCard from '@/components/VideoCard';
import { getCategoryBySlug, getVideosByCategory } from '@/lib/queries';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return { title: 'التصنيف غير موجود' };
    }

    return {
        title: `${category.name} | أصل الحكاية`,
        description: category.description || `قصص وتفاصيل عن ${category.name}`,
    };
}

export const revalidate = 60; // ISR validation

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const videos = await getVideosByCategory(category.id);

    return (
        <div className="category-page">
            <div className="category-page__container">
                {/* Header */}
                <div className="category-page__header">
                    <div className="category-page__badge">
                        تصنيف
                    </div>
                    <h1 className="category-page__title">{category.name}</h1>
                    {category.description && (
                        <p className="category-page__description">{category.description}</p>
                    )}
                    <div className="category-page__count">
                        {videos.length} قصة
                    </div>
                </div>

                {/* Videos Grid */}
                {videos.length > 0 ? (
                    <div className="category-page__grid">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="category-page__empty">
                        <div className="category-page__empty-icon">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="category-page__empty-text">لا توجد قصص في هذا التصنيف حالياً</p>
                    </div>
                )}
            </div>
        </div>
    );
}
