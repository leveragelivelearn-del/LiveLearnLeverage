import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import path from 'path';

// Helper to get credentials from Env or File
const getCredentials = () => {
    // 1. Try Environment Variables (Best for Vercel/Production)
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        return {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix newline escaping issues
        };
    }

    // 2. Fallback to File (Local Development)
    try {
        const KEY_FILE_PATH = path.join(process.cwd(), 'service-account.json');
        return { keyFilename: KEY_FILE_PATH };
    } catch (e) {
        return null;
    }
};

const credentials = getCredentials();

if (!credentials) {
    console.warn('WARNING: No Google Cloud credentials found. Analytics API will fail.');
}

// Initialize Google Analytics Data Client (v1beta)
export const analyticsDataClient = new BetaAnalyticsDataClient(
    credentials && 'client_email' in credentials
        ? { credentials }
        : { keyFilename: path.join(process.cwd(), 'service-account.json') }
    // The library handles keyFilename internally better than we can mock, 
    // so if we have explicit credentials use them, else let it try to find the file or default.
);

// Initialize Google Search Console Client (v1)
export const searchConsoleClient = google.searchconsole({
    version: 'v1',
    auth: new google.auth.GoogleAuth({
        // If we have env vars, use them. Otherwise, let GoogleAuth find the file or ADC.
        ...(credentials && 'client_email' in credentials ? { credentials } : { keyFile: path.join(process.cwd(), 'service-account.json') }),
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    }),
});
