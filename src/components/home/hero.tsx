import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, TrendingUp } from 'lucide-react';

const HomeHeroSection = () => {
    return (
          <section className="relative overflow-hidden py-20 md:py-32">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                          Live. Learn.{' '}
                          <span className="text-primary">Leverage.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                          M&A insights, financial models, and strategic deal analysis from 
                          a seasoned investment professional.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" asChild>
                          <Link href="/models">
                            View Portfolio
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                          <Link href="/blog">
                            Read Insights
                            <BookOpen className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
                      <div className="relative bg-card rounded-2xl p-8 shadow-xl">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-primary/10 rounded-xl p-6">
                            <TrendingUp className="h-8 w-8 text-primary mb-4" />
                            <h3 className="font-semibold">Deal Analysis</h3>
                            <p className="text-sm text-muted-foreground">Expert M&A insights</p>
                          </div>
                          <div className="bg-purple-500/10 rounded-xl p-6">
                            <BarChart3 className="h-8 w-8 text-purple-500 mb-4" />
                            <h3 className="font-semibold">Financial Models</h3>
                            <p className="text-sm text-muted-foreground">Complex models simplified</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
    );
};

export default HomeHeroSection;