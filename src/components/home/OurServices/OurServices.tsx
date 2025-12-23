
import React from 'react';
import { SERVICES_DATA } from './constants';
import ServiceCard from './ServiceCard';

const OurServices: React.FC = () => {
  return (
    <section className="bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-foreground text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-4">
            Our <span className='text-primary'>Services</span>
          </h2>
          <div className="w-12 h-[3px] bg-blue-300 mx-auto mb-8"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            We provide comprehensive solutions across multiple sectors, combining industry expertise with innovative approaches to help our clients achieve sustainable success in an ever-evolving global market.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
