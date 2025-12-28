"use client";

import { useSearchParams } from "next/navigation";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { useMemo } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface BlogContentProps {
    initialBlogs: any[];
    categories: string[];
    tags: string[];
    popularPosts: any[];
    archiveMonths: any[];
}

export default function BlogContent({
    initialBlogs,
    categories,
    tags,
    popularPosts,
    archiveMonths,
}: BlogContentProps) {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");
    const searchParam = searchParams.get("search");
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    // Filtering Logic
    const filteredBlogs = useMemo(() => {
        let result = [...initialBlogs];

        if (categoryParam) {
            result = result.filter((blog) => blog.category === categoryParam);
        }

        if (tagParam) {
            result = result.filter((blog) => blog.tags?.includes(tagParam));
        }

        if (searchParam) {
            const lowerSearch = searchParam.toLowerCase();
            result = result.filter(
                (blog) =>
                    blog.title?.toLowerCase().includes(lowerSearch) ||
                    blog.excerpt?.toLowerCase().includes(lowerSearch)
            );
        }

        if (yearParam && monthParam) {
            result = result.filter((blog) => {
                const date = new Date(blog.publishedAt);
                return date.getFullYear() === parseInt(yearParam) && (date.getMonth() + 1) === parseInt(monthParam);
            });
        }


        return result;
    }, [initialBlogs, categoryParam, tagParam, searchParam, yearParam, monthParam]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Blog Posts */}
            <div className="lg:w-2/3">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {searchParam ? `Search Results for "${searchParam}"` :
                                    categoryParam ? `${categoryParam} Articles` :
                                        tagParam ? `Articles tagged "${tagParam}"` :
                                            "Latest Articles"}
                            </h2>

                        </div>


                    </div>

                    <BlogGrid blogs={filteredBlogs} />
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
                <BlogSidebar
                    categories={categories}
                    tags={tags}
                    popularPosts={popularPosts}
                    archiveMonths={archiveMonths}
                />
            </div>
        </div>
    );
}
