import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure you have your global css imported here

// Your Custom Components
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import LenisProvider from "@/components/providers/LenisProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Initialize the font (This defines 'inter' which you were missing)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: "LiveLearnLeverage - M&A Insights & Financial Models",
    template: "%s | LiveLearnLeverage",
  },
  description:
    "Expert M&A analysis, financial models, and investment insights. Explore deal rationales, financial modeling, and strategic investment analysis.",
  keywords: [
    "M&A",
    "financial models",
    "investment banking",
    "deal analysis",
    "finance",
    "mergers",
    "acquisitions",
    "valuation",
  ],
  authors: [{ name: "John Doe" }],
  creator: "John Doe",
  publisher: "LiveLearnLeverage",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://livelearnleverage.com",
    siteName: "LiveLearnLeverage",
    title: "LiveLearnLeverage - M&A Insights & Financial Models",
    description:
      "Expert M&A analysis, financial models, and investment insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LiveLearnLeverage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LiveLearnLeverage - M&A Insights & Financial Models",
    description:
      "Expert M&A analysis, financial models, and investment insights.",
    images: ["/twitter-image.png"],
    creator: "@livelearnleverage",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://livelearnleverage.com",
  },
  category: "finance",
};

// ---------------------------------------------------------
// FIX: The 'return' must be inside this RootLayout function
// ---------------------------------------------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <LenisProvider>
              {children}
              <ScrollToTop />
            </LenisProvider>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}