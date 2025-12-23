
import React from 'react';
import { ServiceItem } from './types';

interface ServiceCardProps {
  service: ServiceItem;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="flex flex-col items-center text-center group transition-all duration-300 transform hover:-translate-y-2">
      <div className="mb-6 flex items-center justify-center h-24 w-24">
        {service.icon}
      </div>
      <h3 className="text-foreground text-xl font-bold mb-4 tracking-tight">
        {service.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
        {service.description}
      </p>
    </div>
  );
};

export default ServiceCard;
