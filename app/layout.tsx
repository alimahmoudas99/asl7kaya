import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import '@/styles/main.scss';
import Script from 'next/script';
import { SITE_CONFIG, generateOrganizationSchema } from '@/lib/seo';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'أصل الحكاية مع علي | قصص جرائم حقيقية',
    template: '%s | أصل الحكاية مع علي',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'جرائم حقيقية',
    'قصص جرائم',
    'أصل الحكاية',
    'علي محمود',
    'true crime عربي',
    'قضايا جنائية',
    'اختفاء غامض',
    'تحقيقات جنائية',
    'جرائم قتل',
    'احتيال ونصب',
    'قصص مصرية',
    'جرائم مصر',
    'تفاصيل جريمة',
    'القصة الكاملة',
    'حقيقة مقتل',
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'أصل الحكاية مع علي | قصص جرائم حقيقية',
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'أصل الحكاية - قصص جرائم حقيقية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@asl7kaya',
    creator: '@asl7kaya',
    title: 'أصل الحكاية مع علي | قصص جرائم حقيقية',
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google009dd4f53017b14f',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  category: 'news',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content={SITE_CONFIG.themeColor} />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R28H1V6N4B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R28H1V6N4B', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
