
import React from 'react';
import { ServiceItem } from './types';
import { 
  FinancialIcon, 
  SoftwareIcon, 
  BusinessIcon, 
  QualityIcon, 
  TravelIcon, 
  HealthcareIcon 
} from './Icons';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'financial',
    title: 'Financial Planning',
    description: 'Strategic wealth management and personalized financial roadmaps designed to secure your long-term prosperity and growth.',
    icon: <FinancialIcon />
  },
  {
    id: 'software',
    title: 'Software And Research',
    description: 'Cutting-edge software development integrated with deep technical research to solve complex industrial challenges.',
    icon: <SoftwareIcon />
  },
  {
    id: 'business',
    title: 'Business Services',
    description: 'Comprehensive operational support and strategic consulting to streamline your business processes and maximize efficiency.',
    icon: <BusinessIcon />
  },
  {
    id: 'quality',
    title: 'Quality Resourcing',
    description: 'Connecting world-class talent with leading organizations through rigorous vetting and precision-matched staffing solutions.',
    icon: <QualityIcon />
  },
  {
    id: 'travel',
    title: 'Travel And Aviation',
    description: 'Modern logistics and premium travel management services ensuring seamless transitions across global destinations.',
    icon: <TravelIcon />
  },
  {
    id: 'healthcare',
    title: 'Healthcare Services',
    description: 'Innovative healthcare solutions focusing on patient-centric technology and modernized administrative frameworks.',
    icon: <HealthcareIcon />
  }
];
