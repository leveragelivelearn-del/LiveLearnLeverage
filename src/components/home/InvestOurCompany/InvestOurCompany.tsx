
import React from 'react';
import { Target, BarChart3, Globe2 } from 'lucide-react';

/**
 * FeatureItem component to render each pillar of the investment section.
 */
interface FeatureItemProps {
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ imageSrc, imageAlt, icon, title, description }) => {
  return (
    <div className="flex flex-col gap-6 group">
      {/* Feature Image */}
      <div className="overflow-hidden bg-gray-100 aspect-[4/3] w-full rounded-lg">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="flex items-start gap-4 px-2">
        {/* Icon Container */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full border border-blue-100 text-[#001d4a] bg-blue-50/50">
          {icon}
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-extrabold tracking-wider text-[#001d4a] uppercase leading-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const InvestOurCompany: React.FC = () => {
  const features = [
    {
      title: "Business Planning, Strategy & Execution",
      description: "Develop robust roadmaps and operational frameworks that drive consistent growth and market leadership through precision execution.",
      icon: <Target className="w-6 h-6" />,
      imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      imageAlt: "Business professionals collaborating"
    },
    {
      title: "Financial Projections and Analysis",
      description: "Leverage data-driven insights and rigorous financial modeling to secure your investment future and maximize long-term ROI.",
      icon: <BarChart3 className="w-6 h-6" />,
      imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      imageAlt: "Woman reviewing financial documents"
    },
    {
      title: "International Business Opportunities",
      description: "Expand your portfolio across borders with our network of global partners and localized expertise in emerging high-growth markets.",
      icon: <Globe2 className="w-6 h-6" />,
      imageSrc: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
      imageAlt: "Professional on video call"
    }
  ];

  return (
    <section className="bg-background overflow-hidden">
      <div className="container px-4  mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 tracking-tight leading-tight">
            Invest In Our Company And Have Healthy <br className="hidden md:block" /> Profits For Long Term
          </h2>
          <div className="w-12 h-[3px] bg-primary mx-auto mb-8"></div>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Partner with a growth-oriented organization dedicated to sustainable value creation. Our strategic approach ensures reliable returns while fostering innovation in global markets.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestOurCompany;
