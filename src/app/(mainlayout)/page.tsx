import HomeHeroSection from "@/components/home/hero/hero";
import FeaturedModelSection from "@/components/home/FeaturedModelSection";
import FeaturedBlogSection from "@/components/home/FeaturedBlogSection";

import WhoWeAare from "@/components/home/whoweare";


export default async function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-24 mb-16 lg:mb-16">
      {/* Hero Section */}

      <HomeHeroSection />
      {/* Featured Models Section */}
      <FeaturedModelSection />

      {/* Featured Blog Posts */}

      <FeaturedBlogSection />
      <WhoWeAare />
      {/* <OurServices /> */}
      {/* <CaseStudies /> */}
      {/* <InvestOurCompany /> */}
      {/* <IndustryExpertise /> */}
      {/* <TestimonialsSection/> */}
      {/* CTA Section */}
    </div>
  );
}
