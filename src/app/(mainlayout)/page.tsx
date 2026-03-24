import HomeHeroSection from "@/components/home/hero/hero";
import FeaturedModelSection from "@/components/home/FeaturedModelSection";
import FeaturedBlogSection from "@/components/home/FeaturedBlogSection";
import WhoWeAre from "@/components/home/whoweare";

export default async function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <HomeHeroSection />

      {/* Featured Models Section */}
      <FeaturedModelSection />

      {/* Featured Blog Posts */}
      <FeaturedBlogSection />

      {/* <WhoWeAre /> */}
    </div>
  );
}
