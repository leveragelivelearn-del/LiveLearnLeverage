"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";


export function BlogSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [term, setTerm] = useState(initialSearch);

    // Debounce logic inside useEffect to avoid missing hook dependency
    useEffect(() => {
        const timer = setTimeout(() => {
            if (term !== initialSearch) {
                const params = new URLSearchParams(searchParams.toString());
                if (term) {
                    params.set("search", term);
                } else {
                    params.delete("search");
                }
                router.push(`/blog?${params.toString()}`, { scroll: false });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [term, router, searchParams, initialSearch]);

    return (
        <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
                type="search"
                placeholder="Search articles..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/95 text-gray-900 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-xl"
            />
        </div>
    );
}
