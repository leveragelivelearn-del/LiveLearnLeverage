import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Mail, Linkedin, Briefcase, GraduationCap, Award } from 'lucide-react'
import PortfolioHeroSection from '@/components/about/hero'

export default function AboutPage() {
  const skills = [
    'Financial Modeling',
    'Mergers & Acquisitions',
    'Due Diligence',
    'Valuation Analysis',
    'Deal Structuring',
    'Investment Banking',
    'Corporate Finance',
    'Strategic Planning',
  ]

  const experience = [
    {
      role: 'VP of M&A',
      company: 'Global Investment Bank',
      period: '2020 - Present',
      description: 'Led cross-border M&A transactions totaling over $5B in enterprise value.',
    },
    {
      role: 'Associate Director',
      company: 'Private Equity Firm',
      period: '2017 - 2020',
      description: 'Managed portfolio company acquisitions and growth strategies.',
    },
    {
      role: 'Investment Banking Analyst',
      company: 'Boutique Advisory',
      period: '2014 - 2017',
      description: 'Executed sell-side and buy-side M&A transactions across multiple sectors.',
    },
  ]

  const education = [
    {
      degree: 'MBA in Finance',
      institution: 'Wharton School',
      year: '2014',
    },
    {
      degree: 'BSc in Economics',
      institution: 'University of Chicago',
      year: '2010',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PortfolioHeroSection/>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="expertise" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            {/* Expertise Tab */}
            <TabsContent value="expertise" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <Card key={skill} className="text-center">
                    <CardContent className="pt-6">
                      <Award className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <p className="font-medium">{skill}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">Chartered Financial Analyst (CFA)</p>
                    <p className="text-sm text-muted-foreground">CFA Institute, 2016</p>
                    
                    <p className="font-medium mt-4">Financial Modeling & Valuation Analyst (FMVA)</p>
                    <p className="text-sm text-muted-foreground">CFI, 2018</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Deal Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-bold text-primary">$15B+</p>
                        <p className="text-sm text-muted-foreground">Total Transaction Value</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-primary">40+</p>
                        <p className="text-sm text-muted-foreground">M&A Transactions</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-primary">8</p>
                        <p className="text-sm text-muted-foreground">Industry Sectors</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{exp.role}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Briefcase className="h-4 w-4" />
                            {exp.company}
                          </CardDescription>
                        </div>
                        <span className="text-sm text-muted-foreground">{exp.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{edu.degree}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <GraduationCap className="h-4 w-4" />
                            {edu.institution}
                          </CardDescription>
                        </div>
                        <span className="text-sm text-muted-foreground">{edu.year}</span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Get In Touch</h2>
            <p className="text-muted-foreground">
              Interested in collaboration, consulting, or just want to discuss M&A? 
              Feel free to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="mailto:john@livelearnleverage.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" />
                  Connect on LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}