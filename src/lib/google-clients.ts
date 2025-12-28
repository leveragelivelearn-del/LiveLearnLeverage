import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import path from 'path';

const KEY_FILE_PATH = path.join(process.cwd(), 'service-account.json');

// Initialize Google Analytics Data Client (v1beta)
export const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: KEY_FILE_PATH,
});

// Initialize Google Search Console Client (v1)
export const searchConsoleClient = google.searchconsole({
    version: 'v1',
    auth: new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    }),
});
