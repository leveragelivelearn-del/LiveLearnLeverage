import { Metadata } from 'next';
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
async function getModelsAndIndustries() {
  await dbConnect();

  // 1. Fetch Models (Directly from DB, no API call)
  const models = await Model.find({})
    .sort({ completionDate: -1 })
    .limit(12) // Initial limit
    .select('title slug description dealSize currency industry dealType completionDate views featured slides keyMetrics')
    .lean();

  // 2. Fetch Industries
  const industries = await Model.distinct('industry');

  // 3. Serialize data (Crucial: Convert ObjectIds and Dates to strings)
  return {
    models: JSON.parse(JSON.stringify(models)),
    industries: JSON.parse(JSON.stringify(industries)),
  };
}

export default async function ModelsPage() {
  const { models, industries } = await getModelsAndIndustries();

  // Calculate stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalValue = models.reduce((sum: number, model: any) => sum + (Number(model.dealSize) || 0), 0);
  const formattedValue = Math.round(totalValue / 1000000000);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              M&A Models & Deal Analysis
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore detailed financial models and comprehensive analysis of M&A transactions across various industries.
            </p>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{models.length}</span> deals analyzed
                <span className="mx-2">•</span>
                <span className="font-semibold">${formattedValue}B+</span> total transaction value
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Pass the server-fetched data to the client component */}
          <ModelsContent initialModels={models} industries={industries} />
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

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Looking for Custom M&A Analysis?</h2>
            <p className="text-muted-foreground">
              Need help with financial modeling, due diligence, or deal structuring for your specific transaction?
            </p>
            <div className="pt-4">
              <a
                href="mailto:contact@livelearnleverage.com"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Contact for Custom Analysis
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}