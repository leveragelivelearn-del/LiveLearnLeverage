import React from 'react';
import dbConnect from "@/lib/db";
import Blog from '@/models/Blog';
import "@/models/User";
import FeaturedBlogClient from './FeaturedBlogClient';

async function getFeaturedContent() {
  await dbConnect();

  const featuredBlogs = await Blog.find({
    $or: [
      { published: true },
      { status: { $regex: /^published$/i } },
      { status: 'active' }
    ]
  }).sort({ publishedAt: -1, createdAt: -1 })
    .limit(4)
    .select("_id title excerpt slug featuredImage publishedAt readTime author category tags views")
    .populate("author", "name image")
    .lean();

  return {
    blogs: featuredBlogs ? JSON.parse(JSON.stringify(featuredBlogs)) : [],
  };
}

const FeaturedBlogSection = async () => {
  const { blogs } = await getFeaturedContent();

  return (
    <FeaturedBlogClient blogs={blogs || []} />
  );
};

export default FeaturedBlogSection;