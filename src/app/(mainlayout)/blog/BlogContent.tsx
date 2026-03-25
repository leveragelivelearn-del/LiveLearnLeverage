"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Pagination } from "@/components/models/Pagination";
import { useMemo, useState, useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface BlogContentProps {
    initialBlogs: any[];
    categories: string[];
    tags: string[];
    popularPosts: any[];
    archiveMonths: any[];
    initialPagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function BlogContent({
    initialBlogs,
    categories,
    tags,
    popularPosts,
    archiveMonths,
    initialPagination
}: BlogContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isInitialRenderRef = useRef(true);

    const [blogs, setBlogs] = useState(initialBlogs);
    const [pagination, setPagination] = useState(initialPagination);
    const [loading, setLoading] = useState(false);

    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");
    const searchParam = searchParams.get("search");
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");
    const pageParam = searchParams.get("page") || "1";

    // Fetch blogs whenever search params change
    useEffect(() => {
        // Skip first render because we have initialBlogs if no filters/pagination present
        if (isInitialRenderRef.current && pageParam === "1" && !categoryParam && !tagParam && !searchParam && !yearParam && !monthParam) {
            isInitialRenderRef.current = false;
            return;
        }

        // Set to false after the first check regardless
        isInitialRenderRef.current = false;

        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams(searchParams.toString());
                if (!params.has("limit")) params.append("limit", "12");

                const res = await fetch(`/api/blog?${params.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch blogs");

                const data = await res.json();
                const blogsData = data.blogs || [];
                setBlogs(blogsData);

                // Always update pagination, using safe defaults if missing
                // Warn if pagination is missing - indicates API issue
                if (!data.pagination) {
                    console.warn("API response missing pagination data, using fallback");
                }
                setPagination(data.pagination || {
                    page: 1,
                    limit: 12,
                    total: blogsData.length,
                    pages: Math.ceil(blogsData.length / 12),
                });
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [searchParams]); // Re-fetch whenever URL parameters change

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        // Scroll to top of grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            {/* Blog Posts */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {searchParam ? `Search Results for "${searchParam}"` :
                                categoryParam ? `${categoryParam} Articles` :
                                    tagParam ? `Articles tagged "${tagParam}"` :
                                        "Latest Articles"}
                        </h2>

                    </div>


                </div>

                <div className={`transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                    <BlogGrid blogs={blogs} />
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="mt-12">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
