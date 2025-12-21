/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import dbConnect from "@/lib/db";
import Blog from '@/models/Blog';

async function getFeaturedContent() {
  await dbConnect();

  const featuredBlogs = await Blog.find({ published: true })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select("title excerpt slug featuredImage publishedAt readTime")
    .lean();

 

  return {
    blogs: JSON.parse(JSON.stringify(featuredBlogs)),
  };
}

const FeaturedBlogSection = async() => {
    const { blogs } = await getFeaturedContent();
    return (
       <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Latest Insights</h2>
              <p className="text-muted-foreground">
                Thoughts on finance and M&A
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/blog">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <Card
                key={blog._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {blog.featuredImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{blog.readTime} min read</span>
                    <span>
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {blog.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${blog.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
};

export default FeaturedBlogSection;