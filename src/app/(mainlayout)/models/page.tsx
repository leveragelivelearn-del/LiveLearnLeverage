import { Metadata } from 'next';
import Image from 'next/image';
import ModelsContent from './ModelsContent';
import dbConnect from '@/lib/db';
import Model from '@/models/Model';

// --- ISR CONFIGURATION ---
// Revalidate this page every 5 minutes (300 seconds)
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'M&A Models & Deal Analysis | LiveLearnLeverage',
  description: 'Explore detailed M&A financial models, deal analyses, and transaction insights across various industries.',
};

// DIRECT DATABASE FETCH (Prevents "Fetch Loop" Deadlock)
async function getModelsAndIndustries(page: number = 1, limit: number = 12) {
  await dbConnect();

  const skip = (page - 1) * limit;

  // 1. Fetch Models (Directly from DB, no API call)
  const models = await Model.find({})
    .sort({ completionDate: -1 })
    .skip(skip)
    .limit(limit)
    .select('title slug description dealSize currency industry dealType completionDate views featured slides keyMetrics')
    .lean();

  // 2. Fetch total count for pagination
  const total = await Model.countDocuments({});

  // 3. Fetch Industries
  const industries = await Model.distinct('industry');

  // 4. Serialize data (Crucial: Convert ObjectIds and Dates to strings)
  return {
    models: JSON.parse(JSON.stringify(models)),
    industries: JSON.parse(JSON.stringify(industries)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
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

      {/* Stats Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {models.length}
              </div>
              <div className="text-sm text-muted-foreground">Deals Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {industries.length}
              </div>
              <div className="text-sm text-muted-foreground">Industries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                ${formattedValue}B+
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                2014-{new Date().getFullYear()}
              </div>
              <div className="text-sm text-muted-foreground">Years of Coverage</div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}