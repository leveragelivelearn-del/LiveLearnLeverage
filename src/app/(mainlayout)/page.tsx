import HomeHeroSection from "@/components/home/hero/hero";
import FeaturedModelSection from "@/components/home/FeaturedModelSection";
import FeaturedBlogSection from "@/components/home/FeaturedBlogSection";
import { getBaseUrl } from "@/lib/utils";

async function getHeroData() {
  const baseUrl = getBaseUrl();
  const [aboutRes, settingsRes] = await Promise.all([
    fetch(`${baseUrl}/api/about`, { cache: 'force-cache', next: { tags: ['about'] } }),
    fetch(`${baseUrl}/api/settings`, { cache: 'force-cache', next: { tags: ['settings'] } })
  ]);

  const [aboutData, settingsData] = await Promise.all([
    aboutRes.json(),
    settingsRes.json()
  ]);

  return { aboutData, settingsData };
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const { aboutData, settingsData } = await getHeroData();

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <HomeHeroSection initialAboutData={aboutData} initialSettingsData={settingsData} />

      {/* Featured Models Section */}
      <FeaturedModelSection />

      {/* Featured Blog Posts */}
      <FeaturedBlogSection />

      {/* <WhoWeAre /> */}
    </div>
  );
}
