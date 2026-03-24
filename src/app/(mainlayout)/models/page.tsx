import { Metadata } from 'next';
import Image from 'next/image';
import ModelsContent from './ModelsContent';
import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'M&A Models & Deal Analysis | LiveLearnLeverage',
  description: 'Explore detailed M&A financial models, deal analyses, and transaction insights across various industries.',
};

async function getModelsAndIndustries(page: number = 1, limit: number = 12) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/models?page=${page}&limit=${limit}&includeMeta=true`, {
      cache: 'force-cache',
      next: { tags: ['models'] }
    });

    if (!response.ok) throw new Error('Failed to fetch model data');

    const data = await response.json();
    return {
      models: data.models || [],
      industries: data.industries || [],
      pagination: data.pagination || { page, limit, total: 0, pages: 1 },
    };
  } catch (error) {
    console.error('Error in getModelsAndIndustries:', error);
    return {
      models: [],
      industries: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  }
}

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pageStr = typeof params.page === 'string' ? params.page : '1';
  const page = Math.max(1, parseInt(pageStr) || 1);
  const limit = 12;

  const { models, industries, pagination } = await getModelsAndIndustries(page, limit);

  // Calculate stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalValue = models.reduce((sum: number, model: any) => sum + (Number(model.dealSize) || 0), 0);
  const formattedValue = Math.round(totalValue / 1000000000);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/modelbanner.png"
            alt="M&A Models Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              M&A Models & Deal Analysis
            </h1>
            <p className="text-xl text-gray-200">
              Explore detailed financial models and comprehensive analysis of M&A transactions across various industries.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Pass the server-fetched data to the client component */}
          <ModelsContent
            initialModels={models}
            industries={industries}
            initialPagination={pagination}
          />
        </div>
      </section>




    </div>
  );
}