import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'أصل الحكاية مع علي - قصص جرائم حقيقية',
    short_name: 'أصل الحكاية',
    description: 'منصة أصل الحكاية - أقوى القصص والجرائم الحقيقية بأسلوب تحليلي مشوّق. نستكشف أغرب القضايا من مصر والعالم العربي.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1a1a',
    orientation: 'portrait',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['news', 'entertainment', 'education'],
  };
}
