import { NextResponse } from 'next/server';
import { analyticsDataClient, searchConsoleClient } from '@/lib/google-clients';

const GA_PROPERTY_ID = '517735572';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    let startDate = '30daysAgo';
    if (range === '7d') startDate = '7daysAgo';
    if (range === '90d') startDate = '90daysAgo';
    if (range === '1y') startDate = '365daysAgo';

    try {
        // 1. Fetch Top Pages from GA4
        const [pagesResponse] = await analyticsDataClient.runReport({
            property: `properties/${GA_PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
            metrics: [{ name: 'screenPageViews' }],
            limit: 10,
        });

        const topPages = pagesResponse.rows?.map((row) => ({
            page: row.dimensionValues?.[1]?.value || row.dimensionValues?.[0]?.value || 'Unknown',
            path: row.dimensionValues?.[0]?.value || '/',
            views: Number(row.metricValues?.[0]?.value || 0),
            change: 0, // difficult to calc change efficiently in one call
        })) || [];

        // 2. Fetch Search Console Data (Clicks/Impressions)
        // Needs site URL. Usually stored in environment or hardcoded if single site.
        // Assuming 'sc-domain:livelearnleverage.org' or 'https://www.livelearnleverage.org/'
        const siteUrl = 'https://www.livelearnleverage.org/';

        // Calculate start date string for GSC (YYYY-MM-DD)
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - (range === '7d' ? 7 : range === '90d' ? 90 : 30));
        const gscStartDate = dateObj.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];

        let searchQueries: any[] = [];

        try {
            const gscResponse = await searchConsoleClient.searchanalytics.query({
                siteUrl: siteUrl,
                requestBody: {
                    startDate: gscStartDate,
                    endDate: today,
                    dimensions: ['query'],
                    rowLimit: 5,
                },
            });

            searchQueries = gscResponse.data.rows?.map(row => ({
                query: row.keys?.[0],
                clicks: row.clicks,
                impressions: row.impressions,
                position: row.position,
            })) || [];

        } catch (gscError) {
            console.error('GSC Error (might be permissions or wrong site URL):', gscError);
            // Don't fail the whole request if GSC fails
        }

        return NextResponse.json({ topPages, searchQueries });
    } catch (error: any) {
        console.error('Analytics Content API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch content data', details: error.message },
            { status: 500 }
        );
    }
}
