/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamicParams = true;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ModelAdminActions } from "@/components/models/ModelAdminActions";
import { PdfViewer } from "@/components/models/PdfViewer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCarousel } from "@/components/models/ImageCarousel";
import { formatDate, formatCurrency, getBaseUrl } from "@/lib/utils";
import { generateHtml } from "@/lib/server-html";
import {
  Download,
  Eye,
  Calendar,
  DollarSign,
  ArrowLeft,
  Share2,
  FileSpreadsheet,
  ExternalLink,
} from "lucide-react";

// FIXED: Interface matches the new folder name [slug]
interface ModelDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getModelData = async (slug: string) => {
  try {
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/models/${slug}`;

    console.log(`[ModelPage] Requesting: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      cache: 'force-cache',
      next: {
        tags: ['models', `model-${slug}`]
      }
    });

    console.log(`[ModelPage] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ModelPage] Failed. Status: ${response.status} ${response.statusText}. Body: ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`[ModelPage] Success. Model found: ${!!data.model}`);
    return data;
  } catch (error) {
    console.error("[ModelPage] Network/Fetch Error:", error);
    return null;
  }
};

export async function generateMetadata(
  props: ModelDetailPageProps
): Promise<Metadata> {
  const params = await props.params;
  const data = await getModelData(params.slug);
  const model = data?.model;

  if (!model) {
    return {
      title: "Model Not Found",
    };
  }

  return {
    title: `${model.title} | M&A Analysis`,
    description: model.description,
    openGraph: {
      title: model.title,
      description: model.description,
      type: "article",
      publishedTime: model.completionDate
        ? new Date(model.completionDate).toISOString()
        : undefined,
    },
  };
}

export default async function ModelDetailPage(props: ModelDetailPageProps) {
  const params = await props.params;
  const data = await getModelData(params.slug);

  if (!data || !data.model) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  const model = data.model;
  const relatedModels = data.relatedModels || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: model.title,
    description: model.description,
    industry: model.industry,
    currency: model.currency,
    amount: model.dealSize,
    datePublished: model.completionDate,
    provider: {
      "@type": "Person",
      name: "John Doe",
      jobTitle: "M&A Professional",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link
              href="/models"
              className="hover:text-primary transition-colors"
            >
              Models
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{model.title}</span>
          </div>
        </div>

        {/* Hero Banner Section - Reduced padding on mobile */}
        <section className="relative min-h-[40vh] md:min-h-[60vh] flex items-center overflow-hidden py-8 md:py-16">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/modelbanner.png"
              alt="Model Banner"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-white">
            <ModelAdminActions modelSlug={model.slug} modelId={model._id} isAdmin={isAdmin} />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-2 pl-0 hover:pl-2 transition-all text-white hover:text-white/80 hover:bg-white/10"
            >
              <Link href="/models">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Models
              </Link>
            </Button>

            <div className="max-w-4xl mx-auto text-center space-y-4">
              {/* Featured Badge Only - Removed Industry and Deal Type */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {model.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Title - Reduced size on mobile */}
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {model.title}
              </h1>

              {/* Meta Grid */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-200 py-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">
                    {formatCurrency(model.dealSize, model.currency)}
                  </span>
                </div>

                <div className="w-px h-8 bg-white/20 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(model.completionDate)}</span>
                </div>

                <div className="w-px h-8 bg-white/20 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{model.views + 1} views</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Deal Slides */}
                {model.slides && model.slides.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Deal Presentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ImageCarousel images={model.slides} />
                    </CardContent>
                  </Card>
                )}

                {/* PDF Presentation */}
                {model.pdfFileUrl && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className="text-xl sm:text-2xl">PDF Presentation</CardTitle>
                      <Button variant="outline" size="icon" asChild className="h-8 w-8">
                        <a href={model.pdfFileUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <PdfViewer url={model.pdfFileUrl} />
                    </CardContent>
                  </Card>
                )}

                {/* Tabs for Rationale, Metrics, and Description */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-4 pt-4">
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: generateHtml(model.description) }}
                    />
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {model.keyMetrics &&
                        Object.entries(model.keyMetrics).map(([key, value]) => (
                          <div key={key} className="p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-lg font-semibold">
                              {value as string}
                            </p>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                {/* Download Section */}
                {(model.excelFileUrl || model.pdfFileUrl) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Download Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {model.excelFileUrl && (
                        <div>
                          <Button className="w-full" asChild>
                            <a href={model.excelFileUrl} download>
                              <Download className="mr-2 h-4 w-4" />
                              Download Excel Model
                            </a>
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Includes full financial model with assumptions, projections, and sensitivity analysis.
                          </p>
                        </div>
                      )}

                      {model.pdfFileUrl && (
                        <div className={model.excelFileUrl ? "pt-2 border-t" : ""}>
                          <Button className="w-full" variant={model.excelFileUrl ? "outline" : "default"} asChild>
                            <a href={model.pdfFileUrl} download>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF Presentation
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Deal Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Deal Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Industry
                        </span>
                        <span className="font-medium">{model.industry}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Deal Type
                        </span>
                        <span className="font-medium">{model.dealType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Transaction Value
                        </span>
                        <span className="font-medium">
                          {formatCurrency(model.dealSize, model.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Completion Date
                        </span>
                        <span className="font-medium">
                          {formatDate(model.completionDate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                {model.tags && model.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {model.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Removed Related Deals */}

      </div>
    </>
  );
}

// Generate static paths for ISR
export async function generateStaticParams() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/models?limit=1000`, {
      cache: 'force-cache'
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.models?.map((model: any) => ({
      slug: model.slug,
    })) || [];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
