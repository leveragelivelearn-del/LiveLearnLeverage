/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import dbConnect from "@/lib/db";
import Blog from '@/models/Blog';
import FeaturedBlogClient from './FeaturedBlogClient';

async function getFeaturedContent() {
  await dbConnect();

  const featuredBlogs = await Blog.find({ published: true })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select("title excerpt slug featuredImage publishedAt readTime author")
    .populate("author", "name image")
    .lean();

  return {
    blogs: JSON.parse(JSON.stringify(featuredBlogs)),
  };
}

const FeaturedBlogSection = async () => {
  const { blogs } = await getFeaturedContent();
  return (
    <FeaturedBlogClient blogs={blogs} />
  );
};

export default FeaturedBlogSection;