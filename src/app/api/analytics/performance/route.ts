import { NextResponse } from 'next/server';
import { analyticsDataClient } from '@/lib/google-clients';

const GA_PROPERTY_ID = '517735572';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    let startDate = '30daysAgo';
    if (range === '7d') startDate = '7daysAgo';
    if (range === '90d') startDate = '90daysAgo';
    if (range === '1y') startDate = '365daysAgo';

    try {
        // 1. Fetch Daily Views (Line Chart)
        const [viewsResponse] = await analyticsDataClient.runReport({
            property: `properties/${GA_PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
        });

        const pageViewsData = viewsResponse.rows?.map((row) => {
            // Format date YYYYMMDD to generic localized string if needed, 
            // but simplistic approach:
            const d = row.dimensionValues?.[0]?.value || '';
            // GA4 returns YYYYMMDD. Convert to readable format (e.g., Jan 1)
            const formattedDate = d.length === 8
                ? `${d.substring(4, 6)}/${d.substring(6, 8)}`
                : d;

            return {
                date: formattedDate,
                views: Number(row.metricValues?.[0]?.value || 0),
            };
        }) || [];

        // 2. Fetch Traffic Sources (Pie Chart)
        const [trafficResponse] = await analyticsDataClient.runReport({
            property: `properties/${GA_PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'sessions' }],
        });

        // Color palette for the pie chart
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384', '#36A2EB'];

        const trafficSources = trafficResponse.rows?.map((row, index) => ({
            name: row.dimensionValues?.[0]?.value || 'Unknown',
            value: Number(row.metricValues?.[0]?.value || 0),
            color: COLORS[index % COLORS.length],
        })) || [];

        return NextResponse.json({ pageViewsData, trafficSources });
    } catch (error: any) {
        console.error('GA4 Performance API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch performance data', details: error.message },
            { status: 500 }
        );
    }
}
