"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo"; // Adjusted import based on your structure
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
      
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 opacity-20 blur-[100px]"></div>
      </div>

      <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Brand Logo */}
        <div className="scale-110 mb-4">
          <Logo />
        </div>

        {/* 404 Visual */}
        <div className="relative">
          <h1 className="text-9xl font-black text-gray-200 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border shadow-sm">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-primary" />
                Page Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Oops! It looks like you&apos;re lost.
          </h2>
          <p className="text-muted-foreground">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="absolute bottom-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} LiveLearnLeverage. All rights reserved.
      </div>
    </main>
  );
};

export default NotFoundPage;