import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!videoUrl || !videoUrl.startsWith('http')) {
        return NextResponse.json({ error: 'يرجى إدخال رابط صحيح (يبدأ بـ http)' }, { status: 400 });
    }

    try {
        // 1. Get basic info via oEmbed (more reliable for Title and Thumbnail)
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
        const oEmbedRes = await fetch(oEmbedUrl);
        let oEmbedData: any = {};
        if (oEmbedRes.ok) {
            oEmbedData = await oEmbedRes.json();
        }

        // 2. Fetch the page for more details (description/keywords)
        const pageRes = await fetch(videoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'ar,en;q=0.9'
            }
        });
        const html = await pageRes.text();
        console.log('HTML Length:', html.length);
        console.log('HTML Start:', html.substring(0, 500));

        // Decode HTML entities helper
        const decodeHtml = (html: string) => {
            return html.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&apos;/g, "'");
        };

        const title = oEmbedData.title || (html.match(/<title>(.*?)<\/title>/)?.[1]?.replace(' - YouTube', '') || '');

        // Extract full description from ytInitialData
        let description = '';
        const jsonMatch = html.match(/ytInitialData\s*=\s*({.*?});/);
        console.log('ytInitialData found:', !!jsonMatch);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[1]);

                // Helper to search for description in various path structures
                const findDescription = (obj: any): string | null => {
                    if (!obj) return null;

                    // Path 1: structuredDescriptionContentRenderer (Newer UI)
                    const structured = obj.engagementPanels?.find((p: any) =>
                        p.engagementPanelSectionListRenderer?.targetId === 'engagement-panel-structured-description'
                    )?.engagementPanelSectionListRenderer?.content?.structuredDescriptionContentRenderer;

                    if (structured?.items) {
                        for (const item of structured.items) {
                            if (item.videoDescriptionHeaderRenderer) continue;
                            const text = item.expandableVideoDescriptionBodyRenderer?.attributedDescriptionBodyText?.content ||
                                item.videoDescriptionBodyRenderer?.attributedDescriptionBodyText?.content;
                            if (text) return text;
                        }
                    }

                    // Path 2: videoPrimaryInfoRenderer
                    const primary = obj.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer;
                    if (primary?.description?.runs) {
                        return primary.description.runs.map((r: any) => r.text).join('');
                    }

                    // Path 3: shortDescription (fallback within JSON)
                    if (obj.videoDetails?.shortDescription) {
                        return obj.videoDetails.shortDescription;
                    }

                    return null;
                };

                description = findDescription(data) || '';

            } catch (e) {
                console.error('Failed to parse ytInitialData:', e);
            }
        }

        if (!description) {
            // Last resort: meta tags (often truncated)
            const descMatch = html.match(/<meta name="description" content="(.*?)">/);
            description = descMatch ? decodeHtml(descMatch[1]) : '';
        }

        // Clean up description: handle escaped characters and newlines
        description = description
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\u0026/g, '&');

        // Extract keywords/tags from keywords meta tag or common locations
        const keywordsMatch = html.match(/<meta name="keywords" content="(.*?)">/);
        const keywords = keywordsMatch ? decodeHtml(keywordsMatch[1]).split(',').map(s => s.trim()) : [];

        // Extract YouTube ID
        const idMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const youtubeId = idMatch ? idMatch[1] : '';

        return NextResponse.json({
            title: decodeHtml(title),
            description: decodeHtml(description).trim(),
            keywords: keywords.filter(k => k.toLowerCase() !== 'youtube' && k.toLowerCase() !== 'video'),
            youtube_id: youtubeId,
            thumbnail_url: oEmbedData.thumbnail_url || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
