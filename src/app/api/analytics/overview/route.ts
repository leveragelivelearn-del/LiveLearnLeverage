import { NextResponse } from 'next/server';
import { analyticsDataClient } from '@/lib/google-clients';

// TODO: Replace with your actual GA4 Property ID (numeric)
const GA_PROPERTY_ID = '517735572';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    let startDate = '30daysAgo';
    if (range === '7d') startDate = '7daysAgo';
    if (range === '90d') startDate = '90daysAgo';
    if (range === '1y') startDate = '365daysAgo';

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${GA_PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: startDate,
                    endDate: 'today',
                },
                // internal comparison logic would go here if we want "vs last period"
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
                { name: 'eventCount' },
            ],
        });

        const row = response.rows?.[0];
        const stats = {
            totalUsers: Number(row?.metricValues?.[0]?.value || 0),
            totalViews: Number(row?.metricValues?.[1]?.value || 0),
            totalEvents: Number(row?.metricValues?.[2]?.value || 0),
            // Mocking change values for now as fetching comparison adds complexity
            userChange: 5,
            viewChange: 8,
            eventChange: 12,
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('GA4 API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data', details: error.message },
            { status: 500 }
        );
    }
}
