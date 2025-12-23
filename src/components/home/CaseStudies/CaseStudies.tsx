
import React from 'react';
import { CaseStudyData } from './types';

const caseStudies: CaseStudyData[] = [
  {
    id: 1,
    title: "Business Planning Case Study",
    description: "Dmply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since...",
    imageUrl: "https://picsum.photos/id/20/800/600",
    textPosition: 'bottom',
  },
  {
    id: 2,
    title: "Market Analysis 2017",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin...",
    imageUrl: "https://picsum.photos/id/7/800/600",
    textPosition: 'top',
  },
  {
    id: 3,
    title: "TAX Solution Case Study 2017",
    description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by...",
    imageUrl: "https://picsum.photos/id/24/800/600",
    textPosition: 'bottom',
  },
];

const CaseStudyCard: React.FC<{ study: CaseStudyData }> = ({ study }) => {
  const textContent = (
    <div className="py-8 px-1 md:px-0">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{study.title}</h3>
      <p className="text-gray-500 leading-relaxed text-[15px]">
        {study.description}
      </p>
    </div>
  );

  const imageContent = (
    <div className="relative overflow-hidden group">
      <img 
        src={study.imageUrl} 
        alt={study.title}
        className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {study.textPosition === 'top' ? (
        <>
          {textContent}
          {imageContent}
        </>
      ) : (
        <>
          {imageContent}
          {textContent}
        </>
      )}
    </div>
  );
};

const CaseStudies: React.FC = () => {
  return (
    <section className="container mx-auto px-4 overflow-hidden bg-background">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Case Studies
        </h2>
        <div className="w-12 h-[3px] bg-red-600 mx-auto mb-8"></div>
        <p className="max-w-3xl mx-auto text-gray-500 text-lg leading-relaxed">
          Tmply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s
          standard dummy text ever since the 1500s, when an unknown printer took.
        </p>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;
