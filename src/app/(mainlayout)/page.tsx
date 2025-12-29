import HomeHeroSection from "@/components/home/hero/hero";
import FeaturedModelSection from "@/components/home/FeaturedModelSection";
import FeaturedBlogSection from "@/components/home/FeaturedBlogSection";
import IndustryExpertise from "@/components/home/IndustryExpertise";
import WhoWeAare from "@/components/home/whoweare";
import OurServices from "@/components/home/OurServices/OurServices";
import InvestOurCompany from "@/components/home/InvestOurCompany/InvestOurCompany";
import CaseStudies from "@/components/home/CaseStudies/CaseStudies";

export default async function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}

      <HomeHeroSection />
      {/* Featured Models Section */}
      <FeaturedModelSection />

      {/* Featured Blog Posts */}

      <FeaturedBlogSection />
      <WhoWeAare />
      <OurServices />
      <CaseStudies />
      <InvestOurCompany />
      <IndustryExpertise />
      {/* <TestimonialsSection/> */}
      {/* CTA Section */}
    </div>
  );
}
