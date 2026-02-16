import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoCard from '@/components/VideoCard';
import { getCategoryBySlug, getVideosByCategory } from '@/lib/queries';
import {
    generateCategoryMetadata,
    generateBreadcrumbSchema,
    generateCategoryIntro,
    SITE_CONFIG,
} from '@/lib/seo';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'التصنيف غير موجود',
            robots: { index: false, follow: false },
        };
    }

    const videos = await getVideosByCategory(category.id);
    return generateCategoryMetadata(category, videos.length);
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const videos = await getVideosByCategory(category.id);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'الرئيسية', url: SITE_CONFIG.url },
        { name: category.name, url: `${SITE_CONFIG.url}/category/${category.slug}` },
    ]);

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: category.name,
        description: category.description || `مجموعة قصص ${category.name}`,
        url: `${SITE_CONFIG.url}/category/${category.slug}`,
        numberOfItems: videos.length,
        inLanguage: 'ar',
    };

    const categoryIntroHtml = generateCategoryIntro(category);

    return (
        <div className="category-page" itemScope itemType="https://schema.org/CollectionPage">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />

            <div className="category-page__container">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <ol className="breadcrumb__list" itemScope itemType="https://schema.org/BreadcrumbList">
                        <li className="breadcrumb__item" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <a itemProp="item" href="/">
                                <span itemProp="name">الرئيسية</span>
                            </a>
                            <meta itemProp="position" content="1" />
                        </li>
                        <li className="breadcrumb__item breadcrumb__item--active" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <span itemProp="name">{category.name}</span>
                            <meta itemProp="position" content="2" />
                        </li>
                    </ol>
                </nav>

                <div className="category-page__header">
                    <div className="category-page__badge">
                        تصنيف
                    </div>
                    <h1 className="category-page__title" itemProp="name">{category.name}</h1>
                    {category.description && (
                        <p className="category-page__description" itemProp="description">{category.description}</p>
                    )}
                    <div className="category-page__count">
                        <meta itemProp="numberOfItems" content={videos.length.toString()} />
                        {videos.length} قصة
                    </div>
                </div>

                <div className="category-intro" style={{ marginBottom: '3rem' }} dangerouslySetInnerHTML={{ __html: categoryIntroHtml }} />

                {videos.length > 0 ? (
                    <>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>جميع القصص في {category.name}</h2>
                        <div className="category-page__grid">
                            {videos.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    </>
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
