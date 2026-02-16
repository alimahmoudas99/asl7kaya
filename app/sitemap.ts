import { MetadataRoute } from 'next';
import { getAllVideos, getAllCategories } from '@/lib/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aslel7kaya.netlify.app';

    const [videos, categories] = await Promise.all([
        getAllVideos(),
        getAllCategories(),
    ]);

    const videoUrls = videos.map((video) => ({
        url: `${siteUrl}/videos/${video.slug}`,
        lastModified: new Date(video.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const categoryUrls = categories.map((cat) => ({
        url: `${siteUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.4,
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.4,
        },
        ...categoryUrls,
        ...videoUrls,
    ];
}
