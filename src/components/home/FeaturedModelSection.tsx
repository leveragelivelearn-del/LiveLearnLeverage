/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Model from '@/models/Model';
import dbConnect from "@/lib/db";

async function getFeaturedContent() {
  await dbConnect();

  

  const featuredModels = await Model.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("title description slug industry dealSize dealType completionDate")
    .lean();

  return {
    models: JSON.parse(JSON.stringify(featuredModels)),
  };
}


const FeaturedModelSection = async() => {
    const { models } = await getFeaturedContent();
    return (
        <div>
            <section className="bg-background overflow-hidden">
                    <div className='container mx-auto px-4'>
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-3xl font-bold">Featured Deals</h2>
                          <p className="text-muted-foreground">
                            Recent M&A models and analysis
                          </p>
                        </div>
                        <Button variant="ghost" asChild>
                          <Link href="/models">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
            
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {models.map((model: any) => (
                          <Card
                            key={model._id}
                            className="overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <CardHeader>
                              <CardTitle className="line-clamp-1">{model.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                  {model.industry}
                                </span>
                                <span>•</span>
                                <span>{model.dealType}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground line-clamp-2 mb-4">
                                {model.description}
                              </p>
                              <div className="flex justify-between text-sm">
                                <span className="font-semibold">
                                  ${(model.dealSize / 1000000).toFixed(0)}M
                                </span>
                                <span>
                                  {new Date(model.completionDate).toLocaleDateString()}
                                </span>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                asChild
                              >
                                <Link href={`/models/${model.slug}`}>View Details</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </section>
        </div>
    );
};

export default FeaturedModelSection;