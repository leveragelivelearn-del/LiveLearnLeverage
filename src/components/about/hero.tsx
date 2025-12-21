import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import { Download, Linkedin, Mail } from 'lucide-react';

const PortfolioHeroSection = () => {
    return (
        <section className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Profile Image */}
                    <div className="lg:col-span-1">
                      <div className="relative aspect-square rounded-full overflow-hidden">
                        <Image
                          src="/assets/gamaelle-charles.png"
                          alt="Professional headshot"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
        
                    {/* Bio */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                          Gamaelle Charles
                        </h1>
                        <p className="text-xl text-primary font-semibold mb-6">
                          Private Credit Analyst
                        </p>
                        <p className="text-lg text-muted-foreground">
                          Finance student passionate about fair and free markets, civil duty, and investment banking/private equity with hands-on internship experience in private credit analysis and equity research. Developing expertise in financial modeling (DCF, LBO, pro forma), due diligence, and transaction analysis through professional experience and coursework. 
                        <br/>
                        <br/>
                        
                        </p>
                        
                       <p className="text-lg text-muted-foreground">
                           Investment Banking | LBO Modeling | Due Diligence | Equity Research | Financial Valuation | DCF Analysis | Pro Forma Analysis | Private Credit | Excel | Financial Modeling
                        </p>
                      </div>
        
                      <div className="flex flex-wrap gap-4">
                        <Button asChild>
                          <a href="/resume.pdf" download>
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="mailto:john@livelearnleverage.com">
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Me
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
    );
};

export default PortfolioHeroSection;