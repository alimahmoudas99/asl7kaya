import type { Video, Category } from './types';

export const SITE_CONFIG = {
  name: 'أصل الحكاية مع علي',
  shortName: 'أصل الحكاية',
  description: 'منصة أصل الحكاية - أقوى القصص والجرائم الحقيقية بأسلوب تحليلي مشوّق. نستكشف أغرب القضايا من مصر والعالم العربي.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aslel7kaya.netlify.app',
  author: 'علي محمود',
  locale: 'ar_EG',
  language: 'ar',
  themeColor: '#1a1a1a',
};

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

export function generateVideoMetadata(video: Video) {
  const canonical = generateCanonicalUrl(`/videos/${video.slug}`);
  const categoryName = (video.categories as unknown as { name: string })?.name || '';

  const title = `${video.title} | ${SITE_CONFIG.shortName}`;
  const description = video.excerpt || `تفاصيل القصة الكاملة: ${video.title}. اكتشف حقيقة ما حدث في هذه القضية الغامضة.`;

  const keywords = [
    video.title,
    `تفاصيل ${video.title}`,
    `القصة الكاملة ${video.title}`,
    categoryName,
    'جرائم حقيقية',
    'قصص جرائم',
    'أصل الحكاية',
    'قضايا جنائية',
    ...(video.people_involved || []),
    ...(video.location ? [video.location] : []),
  ];

  return {
    title,
    description,
    keywords: keywords.filter(Boolean).join(', '),
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'article' as const,
      publishedTime: video.published_at,
      modifiedTime: video.updated_at,
      authors: [SITE_CONFIG.author],
      images: video.thumbnail_url
        ? [
            {
              url: video.thumbnail_url,
              width: 1280,
              height: 720,
              alt: video.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      creator: '@asl7kaya',
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

export function generateCategoryMetadata(category: Category, videoCount: number) {
  const canonical = generateCanonicalUrl(`/category/${category.slug}`);

  const title = `${category.name} | قصص جرائم حقيقية | ${SITE_CONFIG.shortName}`;
  const description =
    category.description ||
    `اكتشف ${videoCount} قصة من فئة ${category.name}. تفاصيل حصرية وتحليل عميق لأغرب القضايا والجرائم الحقيقية في ${category.name}.`;

  const keywords = [
    category.name,
    `قصص ${category.name}`,
    `جرائم ${category.name}`,
    `تفاصيل ${category.name}`,
    'جرائم حقيقية',
    'قصص جرائم',
    'أصل الحكاية',
  ];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      'https://www.youtube.com/@asl7kaya',
      'https://www.facebook.com/asl7kaya',
      'https://twitter.com/asl7kaya',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@asl7kaya.com',
      availableLanguage: ['Arabic'],
    },
  };
}

export function generateArticleSchema(video: Video) {
  const categoryName = (video.categories as unknown as { name: string })?.name || '';
  const categorySlug = (video.categories as unknown as { slug: string })?.slug || '';
  const imageUrl = video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: video.title,
    description: video.excerpt,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1280,
      height: 720,
    },
    datePublished: video.published_at,
    dateModified: video.updated_at,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': generateCanonicalUrl(`/videos/${video.slug}`),
    },
    articleSection: categoryName,
    keywords: [
      video.title,
      categoryName,
      'جرائم حقيقية',
      'قصص جرائم',
      ...(video.people_involved || []),
    ].join(', '),
    inLanguage: 'ar',
    ...(video.location && { contentLocation: video.location }),
  };
}

export function generateVideoObjectSchema(video: Video) {
  const thumbnailUrl = video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.excerpt,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: video.published_at,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtube_id}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtube_id}`,
    duration: 'PT15M',
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
        width: 600,
        height: 60,
      },
    },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: video.views || 0,
    },
    inLanguage: 'ar',
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateVideoFAQs(video: Video): { question: string; answer: string }[] {
  const categoryName = (video.categories as unknown as { name: string })?.name || 'الجرائم';
  const title = video.title;

  return [
    {
      question: `ما هي تفاصيل ${title}؟`,
      answer: video.excerpt || `${title} هي واحدة من أشهر القضايا في ${categoryName}. نستعرض في هذه القصة كافة التفاصيل والملابسات التي أحاطت بالقضية.`,
    },
    {
      question: `متى وقعت ${title}؟`,
      answer: `وقعت هذه القضية في ${new Date(video.published_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}${video.location ? ` في ${video.location}` : ''}.`,
    },
    {
      question: `من هم الأشخاص المتورطون في ${title}؟`,
      answer:
        video.people_involved && video.people_involved.length > 0
          ? `الأشخاص الرئيسيون في هذه القضية هم: ${video.people_involved.join('، ')}.`
          : 'يتم استعراض جميع الأطراف المتورطة في القضية بالتفصيل في الفيديو.',
    },
    {
      question: `أين يمكنني مشاهدة القصة الكاملة لـ ${title}؟`,
      answer: `يمكنك مشاهدة القصة الكاملة والتفاصيل الحصرية على قناة أصل الحكاية على يوتيوب، أو من خلال هذه الصفحة مباشرة.`,
    },
    {
      question: `ما هي حقيقة ${title}؟`,
      answer: `نستعرض في هذا الفيديو الحقائق الكاملة والتحليل الشامل لـ ${title}، مع توضيح جميع الجوانب الغامضة في القضية.`,
    },
  ];
}

export function generateCategoryIntro(category: Category): string {
  const intros: Record<string, string> = {
    'جرائم-قتل': `
      <div class="category-intro">
        <h2>قصص جرائم القتل الحقيقية</h2>
        <p>تعد جرائم القتل من أكثر القضايا الجنائية إثارة وغموضاً في تاريخ الجريمة. في هذا القسم، نستعرض أشهر قضايا القتل التي هزت الرأي العام في مصر والعالم العربي.</p>
        
        <h3>لماذا نهتم بقصص جرائم القتل؟</h3>
        <p>دراسة جرائم القتل ليست مجرد فضول، بل هي محاولة لفهم الطبيعة البشرية في أحلك لحظاتها. كل قضية قتل تحمل في طياتها دروساً عن المجتمع، والعدالة، والنفس البشرية.</p>
        
        <h3>ما الذي ستجده في هذا القسم؟</h3>
        <ul>
          <li><strong>تحليل شامل:</strong> نقدم تحليلاً عميقاً لكل قضية، من الدوافع إلى التحقيقات</li>
          <li><strong>تفاصيل حصرية:</strong> معلومات دقيقة عن ملابسات الجريمة والتحقيقات</li>
          <li><strong>السياق الاجتماعي:</strong> فهم الظروف التي أدت إلى وقوع الجريمة</li>
          <li><strong>العدالة:</strong> متابعة مسار القضية في المحاكم والأحكام النهائية</li>
        </ul>
        
        <p>استكشف معنا أغرب وأشهر قضايا القتل، وتعرف على القصص الكاملة وراء العناوين الصحفية.</p>
      </div>
    `,
    'اختفاء': `
      <div class="category-intro">
        <h2>قصص الاختفاء الغامضة</h2>
        <p>حالات الاختفاء الغامض من أكثر القضايا إثارة للحيرة والتساؤلات. في هذا القسم، نتتبع قصص الأشخاص الذين اختفوا في ظروف غامضة، ونحاول الوصول إلى الحقيقة.</p>
        
        <h3>أنواع حالات الاختفاء</h3>
        <p>تتنوع حالات الاختفاء بين الاختفاء الطوعي، والاختطاف، والحوادث المأساوية. كل حالة لها ظروفها الخاصة وتحدياتها في التحقيق.</p>
        
        <h3>محتوى القسم</h3>
        <ul>
          <li><strong>آخر الأدلة:</strong> تتبع آخر مكان شوهد فيه المفقود</li>
          <li><strong>التحقيقات:</strong> جهود الشرطة والعائلات في البحث</li>
          <li><strong>النظريات:</strong> تحليل مختلف الاحتمالات والسيناريوهات</li>
          <li><strong>التطورات:</strong> آخر المستجدات في القضايا المفتوحة</li>
        </ul>
        
        <p>انضم إلينا في رحلة البحث عن الحقيقة وراء أغرب حالات الاختفاء في العالم العربي.</p>
      </div>
    `,
    'احتيال': `
      <div class="category-intro">
        <h2>قصص الاحتيال والنصب الكبرى</h2>
        <p>عالم الاحتيال مليء بالقصص المذهلة التي تجمع بين الذكاء الإجرامي والجشع. نستعرض هنا أكبر قضايا الاحتيال والنصب التي هزت الاقتصاد والمجتمع.</p>
        
        <h3>أنماط الاحتيال الشائعة</h3>
        <p>من الاحتيال المالي إلى النصب العقاري، ومن الشركات الوهمية إلى المخططات الهرمية، نكشف أساليب المحتالين وكيف يستغلون ضحاياهم.</p>
        
        <h3>ما ستتعلمه</h3>
        <ul>
          <li><strong>أساليب المحتالين:</strong> كيف يخطط وينفذ المحتالون عملياتهم</li>
          <li><strong>علامات التحذير:</strong> كيف تحمي نفسك من الوقوع ضحية</li>
          <li><strong>القصص الواقعية:</strong> حالات حقيقية من مصر والعالم العربي</li>
          <li><strong>العدالة:</strong> كيف تم كشف الاحتيال ومعاقبة المجرمين</li>
        </ul>
        
        <p>تعلم من تجارب الآخرين واحمِ نفسك من خلال فهم عقلية المحتال وأساليبه.</p>
      </div>
    `,
  };

  return (
    intros[category.slug] ||
    `
    <div class="category-intro">
      <h2>${category.name}</h2>
      <p>${category.description || `استكشف مجموعة متنوعة من القصص والقضايا في فئة ${category.name}. نقدم لك تحليلاً شاملاً وتفاصيل حصرية لأغرب وأشهر القضايا.`}</p>
      
      <h3>ما يميز قصصنا</h3>
      <ul>
        <li><strong>بحث معمق:</strong> نجمع المعلومات من مصادر موثوقة متعددة</li>
        <li><strong>تحليل احترافي:</strong> نقدم وجهات نظر متوازنة ومدروسة</li>
        <li><strong>محتوى حصري:</strong> تفاصيل لا تجدها في مكان آخر</li>
        <li><strong>أسلوب مشوق:</strong> نروي القصص بطريقة تجذب الانتباه وتحترم الضحايا</li>
      </ul>
      
      <p>تابع معنا أحدث القصص والتحليلات في ${category.name}.</p>
    </div>
  `
  );
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function extractKeywords(text: string, limit = 10): string[] {
  const arabicStopWords = [
    'في',
    'من',
    'إلى',
    'على',
    'عن',
    'مع',
    'هذا',
    'هذه',
    'ذلك',
    'التي',
    'الذي',
    'التي',
    'كان',
    'كانت',
    'يكون',
    'أن',
    'إن',
    'لم',
    'لن',
    'قد',
    'ما',
    'لا',
    'نعم',
  ];

  const words = text
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !arabicStopWords.includes(word));

  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map((entry) => entry[0]);
}

export function generateRelatedKeywords(mainKeyword: string): string[] {
  const patterns = [
    `تفاصيل ${mainKeyword}`,
    `القصة الكاملة ${mainKeyword}`,
    `ماذا حدث في ${mainKeyword}`,
    `حقيقة ${mainKeyword}`,
    `ملابسات ${mainKeyword}`,
    `تحليل ${mainKeyword}`,
    `معلومات عن ${mainKeyword}`,
  ];

  return patterns;
}
