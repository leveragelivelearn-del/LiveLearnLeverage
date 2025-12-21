import HomeHeroSection from "@/components/home/hero";
import FeaturedModelSection from "@/components/home/FeaturedModelSection";
import FeaturedBlogSection from "@/components/home/FeaturedBlogSection";
import ValueProposition from "@/components/home/ValueProposition";
import IndustryExpertise from "@/components/home/IndustryExpertise";
import MethodologySection from "@/components/home/MethodologySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";

export default async function HomePage() {
  return (
    <>
      {/* Hero Section */}

      <HomeHeroSection />
      {/* Featured Models Section */}
      <FeaturedModelSection />

      {/* Featured Blog Posts */}

      <FeaturedBlogSection />
      <MethodologySection/>
      <ValueProposition/>
      <IndustryExpertise/>
      <TestimonialsSection/>
      <FAQSection/>
      {/* CTA Section */}
    </>
  );
}
