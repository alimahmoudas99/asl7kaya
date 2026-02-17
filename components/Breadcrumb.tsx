import { generateBreadcrumbSchema, SITE_CONFIG } from '@/lib/seo';

export interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const allItems: BreadcrumbItem[] = [
        { name: 'الرئيسية', href: '/' },
        ...items,
    ];

    const schemaItems = allItems.map((item, index) => ({
        name: item.name,
        url: index === 0 ? SITE_CONFIG.url : `${SITE_CONFIG.url}${item.href}`,
    }));

    const breadcrumbSchema = generateBreadcrumbSchema(schemaItems);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav className="breadcrumb" aria-label="Breadcrumb">
                <ol className="breadcrumb__list" itemScope itemType="https://schema.org/BreadcrumbList">
                    {allItems.map((item, index) => {
                        const isLast = index === allItems.length - 1;
                        return (
                            <li
                                key={index}
                                className={`breadcrumb__item${isLast ? ' breadcrumb__item--active' : ''}`}
                                itemProp="itemListElement"
                                itemScope
                                itemType="https://schema.org/ListItem"
                            >
                                {isLast ? (
                                    <span itemProp="name">{item.name}</span>
                                ) : (
                                    <a itemProp="item" href={item.href}>
                                        <span itemProp="name">{item.name}</span>
                                    </a>
                                )}
                                <meta itemProp="position" content={String(index + 1)} />
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
