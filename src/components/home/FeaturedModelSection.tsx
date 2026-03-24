
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import FeaturedModelClient from './FeaturedModelClient';

import { getBaseUrl } from '@/lib/utils';

async function getFeaturedModels() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/models?limit=4&featured=true`, {
      cache: 'force-cache',
      next: { tags: ['models'] }
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Error fetching featured models:", error);
    return [];
  }
}

const FeaturedModelSection = async () => {
  const models = await getFeaturedModels();
  return (
    <div>
      <FeaturedModelClient models={models} />
    </div>
  );
};

export default FeaturedModelSection;