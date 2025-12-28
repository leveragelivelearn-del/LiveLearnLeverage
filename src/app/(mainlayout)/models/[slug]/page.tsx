export const revalidate = 3600;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCarousel } from "@/components/models/ImageCarousel";
import { ModelCard } from "@/components/models/ModelCard";
import dbConnect from "@/lib/db";
import Model from "@/models/Model";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Download,
  Eye,
  Calendar,
  DollarSign,
  ArrowLeft,
  Share2,
  FileSpreadsheet,
} from "lucide-react";
import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";

// FIXED: Interface matches the new folder name [slug]
interface ModelDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: ModelDetailPageProps
): Promise<Metadata> {
  const params = await props.params;
  await dbConnect();

  // Use regex to make the slug lookup Case-Insensitive to prevent 404s on "Voluptatem-Veniam"
  const model = await Model.findOne({
    slug: { $regex: new RegExp(`^${params.slug}$`, "i") },
  }).lean();

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

async function getModelAndRelated(slug: string) {
  await dbConnect();

  // FIXED: Add Case-Insensitive Regex lookup
  // This ensures /models/Voluptatem finds /models/voluptatem
  const model = await Model.findOne({
    slug: { $regex: new RegExp(`^${slug}$`, "i") },
  }).lean();

  if (!model) {
    return null;
  }

  // Increment view count
  await Model.updateOne({ _id: model._id }, { $inc: { views: 1 } });

  // Get related models (same industry or similar deal size)
  const relatedModels = await Model.find({
    _id: { $ne: model._id },
    $or: [{ industry: model.industry }, { dealType: model.dealType }],
  })
    .sort({ completionDate: -1 })
    .limit(3)
    .select(
      "title slug description dealSize currency industry dealType completionDate views featured slides"
    )
    .lean();

  return {
    model: JSON.parse(JSON.stringify(model)),
    relatedModels: JSON.parse(JSON.stringify(relatedModels)),
  };
}

export default async function ModelDetailPage(props: ModelDetailPageProps) {
  const params = await props.params;
  const data = await getModelAndRelated(params.slug);

  if (!data) {
    notFound();
  }

  const { model, relatedModels } = data;

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

        {/* Hero Banner Section */}
        <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center overflow-hidden py-16">
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

            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {model.industry}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20 border-0"
                >
                  {model.dealType}
                </Badge>
                {model.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
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

                {/* Tabs for Rationale, Metrics, and Description */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="rationale">Deal Rationale</TabsTrigger>
                    <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-4 pt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{model.description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="rationale" className="space-y-4 pt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert" />
                    <ReadOnlyEditor content={model.rationale} />
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
              <div className="space-y-6">
                {/* Download Section */}
                {model.excelFileUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Download Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full" asChild>
                        <a href={model.excelFileUrl} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download Excel Model
                        </a>
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Includes full financial model with assumptions,
                        projections, and sensitivity analysis.
                      </p>
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

        {/* Related Deals */}
        {relatedModels.length > 0 && (
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Related Deals</h2>
                  <p className="text-muted-foreground">
                    Explore similar M&A transactions in the same industry
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedModels.map((relatedModel: any) => (
                    <ModelCard key={relatedModel._id} model={relatedModel} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">
                Need Help With Your Next Deal?
              </h2>
              <p className="text-muted-foreground">
                Leverage expert M&A analysis and financial modeling for your
                transaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="mailto:contact@livelearnleverage.com">
                    Request Consultation
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/models">Browse All Models</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Generate static paths for ISR
export async function generateStaticParams() {
  await dbConnect();
  const models = await Model.find({}).select("slug").lean();

  return models.map((model) => ({
    slug: model.slug, // FIXED: Return slug instead of id
  }));
}
