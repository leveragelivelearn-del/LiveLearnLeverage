import React from 'react';
import FeaturedBlogClient from './FeaturedBlogClient';

import { getBaseUrl } from '@/lib/utils';

async function getFeaturedBlogs() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/blog?limit=4`, {
      cache: 'force-cache',
      next: { tags: ['blogs'] }
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.blogs || [];
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return [];
  }
}

const FeaturedBlogSection = async () => {
  const blogs = await getFeaturedBlogs();

  return (
    <FeaturedBlogClient blogs={blogs} />
  );
};

export default FeaturedBlogSection;