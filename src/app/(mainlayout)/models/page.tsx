/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { ModelGrid } from '@/components/models/ModelGrid'
import { FilterBar } from '@/components/models/FilterBar'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'

export const metadata: Metadata = {
  title: 'M&A Models & Deal Analysis | LiveLearnLeverage',
  description: 'Explore detailed M&A financial models, deal analyses, and transaction insights across various industries.',
}

async function getModelsAndFilters() {
  await dbConnect()
  
  // Get all models for initial display
  const models = await Model.find({})
    .sort({ completionDate: -1 })
    .select('title slug description dealSize currency industry dealType completionDate views featured')
    .lean()
  
  // Get unique industries for filter dropdown
  const industries = await Model.distinct('industry')
  
  return {
    models: JSON.parse(JSON.stringify(models)),
    industries: JSON.parse(JSON.stringify(industries)),
  }
}

export default async function ModelsPage() {
  const { models, industries } = await getModelsAndFilters()

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
              Each model includes deal rationale, key metrics, and downloadable resources.
            </p>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{models.length}</span> deals analyzed
                <span className="mx-2">•</span>
                <span className="font-semibold">${models.reduce((sum: number, model: any) => sum + model.dealSize, 0) / 1000000000}B+</span> total transaction value
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {/* Filter Bar */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
              <FilterBar 
                onFilterChange={() => {}} // This will be handled client-side
                industries={industries}
              />
            </div>

            {/* Models Grid */}
            <ModelGrid initialModels={models} />
          </div>
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
              <div className="text-sm text-muted-foreground">
                Deals Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {industries.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Industries Covered
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                ${Math.round(models.reduce((sum: number, model: any) => sum + model.dealSize, 0) / 1000000000)}B+
              </div>
              <div className="text-sm text-muted-foreground">
                Total Transaction Value
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                2014-{new Date().getFullYear()}
              </div>
              <div className="text-sm text-muted-foreground">
                Years of Coverage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              Looking for Custom M&A Analysis?
            </h2>
            <p className="text-muted-foreground">
              Need help with financial modeling, due diligence, or deal structuring for your specific transaction?
            </p>
            <div className="pt-4">
              <a
                href="mailto:contact@livelearnleverage.com"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Contact for Custom Analysis
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}