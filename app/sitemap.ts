import { MetadataRoute } from 'next';
import { getAllVideos, getAllCategories } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const [videos, categories] = await Promise.all([
        getAllVideos(),
        getAllCategories(),
    ]);

    const videoUrls = videos.map((video) => ({
        url: `${siteUrl}/videos/${video.slug}`,
        lastModified: new Date(video.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const categoryUrls = categories.map((cat) => ({
        url: `${siteUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...videoUrls,
        ...categoryUrls,
    ];
}
