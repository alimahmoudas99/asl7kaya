import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import '@/styles/main.scss';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'أصل الحكاية | قصص جرائم حقيقية',
    template: '%s | أصل الحكاية',
  },
  description:
    'منصة أصل الحكاية - أقوى القصص والجرائم الحقيقية بأسلوب تحليلي مشوّق. نستكشف أغرب القضايا من مصر والعالم العربي.',
  keywords: [
    'جرائم حقيقية',
    'قصص جرائم',
    'أصل الحكاية',
    'true crime',
    'قضايا جنائية',
    'اختفاء غامض',
    'تحقيقات',
  ],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'أصل الحكاية',
    title: 'أصل الحكاية | قصص جرائم حقيقية',
    description:
      'منصة أصل الحكاية - أقوى القصص والجرائم الحقيقية بأسلوب تحليلي مشوّق.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أصل الحكاية | قصص جرائم حقيقية',
    description:
      'منصة أصل الحكاية - أقوى القصص والجرائم الحقيقية بأسلوب تحليلي مشوّق.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'google009dd4f53017b14f',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
