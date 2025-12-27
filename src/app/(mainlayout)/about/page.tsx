'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Download,
  Mail,
  Linkedin,
  LineChart,
  Briefcase,
  PieChart,
  Target,
  Facebook,
  Twitter,
  Instagram,
  Home,
  FileText,
  User,
  Send,
  GraduationCap
} from 'lucide-react';
import { ModelCard } from '@/components/models/ModelCard';
import { BlogCard } from '@/components/blog/BlogCard';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('about');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [models, setModels] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'portfolio' && models.length === 0) {
      const fetchModels = async () => {
        try {
          const res = await fetch('/api/models');
          const data = await res.json();
          if (data.models) {
            // Filter for featured models first
            const featured = data.models.filter((m: any) => m.featured);
            // If not enough featured, fallback to all (or just keep featured as per request)
            // User explicitly asked for "featured model card"
            setModels(featured);
          }
        } catch (error) {
          console.error("Failed to fetch models", error);
        }
      };
      fetchModels();
    }
  }, [activeTab, models.length]);

  useEffect(() => {
    if (activeTab === 'blog' && blogs.length === 0) {
      const fetchBlogs = async () => {
        try {
          const res = await fetch('/api/blog');
          const data = await res.json();
          if (data.blogs) {
            setBlogs(data.blogs);
          }
        } catch (error) {
          console.error("Failed to fetch blogs", error);
        }
      };
      fetchBlogs();
    }
  }, [activeTab, blogs.length]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-16 lg:pt-0">

      {/* Top Banner Section */}
      <div className="relative h-[250px] lg:h-[400px] w-full bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <Image
            src="/assets/charles-banner.png"
            alt="Gamaelle Charles Banner"
            fill
            className="object-cover object-center bg-gray-100" // Added light bg as fallback
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>

        {/* Abstract Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-chart-2/10 rounded-full blur-[80px] opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 -mt-24 lg:-mt-48 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="sticky top-24">
              <div className="bg-card rounded-lg p-6 border border-border shadow-2xl backdrop-blur-sm">
                {/* Image */}
                <div className="relative w-full aspect-[4/5] mb-6 rounded-lg overflow-hidden bg-gradient-to-b from-muted to-card ring-1 ring-border group">
                  <Image
                    src="/assets/gamaelle-charles.png"
                    alt="Gamaelle Charles"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Info */}
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-xl font-bold text-foreground">
                    Gamaelle Charles
                  </h2>
                  <p className="text-primary font-medium text-xs pt-1 leading-relaxed">
                    Junior at Babson College | Fidelity Scholar | MLT Fellow | GWI SIP ’25
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-lg bg-accent border border-border text-center group hover:border-primary/30 transition-colors">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Email</p>
                    <a href="mailto:gamaellechar123@gmail.com" className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors truncate block">
                      gamaellechar123@gmail.com
                    </a>
                  </div>
                </div>

                {/* Socials */}
                <div className="flex justify-center gap-2 mb-6">
                  {[
                    { icon: Facebook, href: '#' },
                    { icon: Twitter, href: '#' },
                    { icon: Linkedin, href: 'https://linkedin.com' },
                    { icon: Instagram, href: '#' }
                  ].map((Item, i) => (
                    <Button key={i} variant="outline" size="icon" className="rounded-full bg-accent border-border hover:bg-gradient-to-r hover:from-primary hover:to-chart-4 hover:text-primary-foreground hover:border-transparent transition-all text-muted-foreground h-9 w-9">
                      <Item.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                {/* Resume Button */}
                <Button asChild className="w-full rounded-lg py-5 bg-transparent border border-border hover:bg-foreground hover:text-background transition-all text-foreground font-medium text-sm group">
                  <a href="/assets/gamaelle-charles-resume.pdf" download="Gamaelle_Charles_Resume.pdf">
                    Download My CV
                    <Download className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-7 xl:col-span-7 mt-10 lg:mt-36 min-h-[500px]">

            {/* ABOUT TAB */}
            <div className={`mb-12 lg:mb-0 ${activeTab === 'about' ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : 'block lg:hidden'}`}>
              {/* Header Section */}
              <div className="bg-card rounded-lg p-8 border border-border relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <LineChart className="w-64 h-64" />
                </div>

                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wider uppercase mb-4">
                    About Me
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-foreground">
                    Finance Student & Aspiring Investment Banker
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                    Finance student passionate about fair and free markets, civil duty, and investment banking/private equity with hands-on internship experience in private credit analysis and equity research.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Developing expertise in financial modeling (DCF, LBO, pro forma), due diligence, and transaction analysis through professional experience and coursework. Fellow at Management Leadership for Tomorrow (MLT) and Girls Who Invest (GWI).
                  </p>
                </div>
              </div>

              {/* What I Do Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                  What I Do?
                  <span className="h-px bg-border flex-1 ml-4"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { icon: LineChart, title: 'Financial Modeling', color: 'text-chart-1', bg: 'bg-chart-1/10', desc: 'Developing complex models including DCF, LBO, and Pro Forma analysis.' },
                    { icon: Briefcase, title: 'M&A Advisory', color: 'text-chart-2', bg: 'bg-chart-2/10', desc: 'Expert advice on sell-side and buy-side transactions and structuring.' },
                    { icon: Target, title: 'Due Diligence', color: 'text-chart-3', bg: 'bg-chart-3/10', desc: 'Rigorous financial and operational due diligence to validate theses.' },
                    { icon: PieChart, title: 'Valuation Partners', color: 'text-chart-4', bg: 'bg-chart-4/10', desc: 'Driving long-term business success through accurate valuation.' }
                  ].map((item, i) => (
                    <div key={i} className="group bg-card p-6 rounded-lg border border-border hover:border-primary/20 transition-all hover:bg-accent relative overflow-hidden">
                      <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[
                  { val: '15B+', label: 'Transaction Value' },
                  { val: '40+', label: 'M&A Deals' },
                  { val: '8', label: 'Sectors' },
                  { val: '2+', label: 'Years Exp.' }
                ].map((stat, i) => (
                  <div key={i} className="bg-card p-5 rounded-lg border border-border text-center hover:border-primary/20 transition-all group">
                    <h3 className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{stat.val}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RESUME TAB */}
            <div className={`mb-12 lg:mb-0 ${activeTab === 'resume' ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : 'block lg:hidden'}`}>
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-foreground">
                  <Briefcase className="text-primary" /> Experience
                </h3>
                <div className="space-y-8 border-l-2 border-border pl-8 ml-4">
                  {[
                    { role: 'Private Credit Analyst', company: 'TPG Twin Brook Capital Partners', period: 'Jul 2025 - Aug 2025', desc: 'Incoming Summer Intern. Focusing on private credit analysis.' },
                    { role: 'Fall Analyst', company: 'Thresher Fixed', period: 'Sep 2024 - May 2025', desc: 'Remote internship. Conducting fixed income research and analysis.' },
                    { role: 'Finance Analyst', company: 'Charles River Development', period: 'Jul 2022 - Aug 2022', desc: 'Gained experience in financial operations and creative problem solving.' },
                    { role: 'Client Solutions', company: 'State Street Global Advisors', period: 'Jul 2021 - Aug 2021', desc: 'Learned about client services and learning management systems.' }
                  ].map((item, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary"></span>
                      <h4 className="text-xl font-bold text-foreground mb-1">{item.role}</h4>
                      <p className="text-sm text-primary mb-2">{item.company} <span className="text-muted-foreground mx-2">|</span> {item.period}</p>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg p-8 border border-border mt-8">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-foreground">
                  <GraduationCap className="text-chart-2" /> Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { degree: 'Finance, General', school: 'The London School of Economics (LSE)', year: '2025 - 2026' },
                    { degree: 'BS Accounting & Finance', school: 'Babson College', year: '2023 - 2027' },
                    { degree: 'Career Prep Fellow', school: 'Management Leadership for Tomorrow', year: '2024 - 2025' },
                    { degree: 'High School Diploma', school: 'Boston Latin Academy', year: '2019 - 2023' }
                  ].map((item, i) => (
                    <div key={i} className="bg-accent p-6 rounded-lg border border-border">
                      <span className="text-xs text-chart-2 font-bold tracking-wider">{item.year}</span>
                      <h4 className="text-lg font-bold text-foreground mt-1 mb-2">{item.degree}</h4>
                      <p className="text-muted-foreground text-sm">{item.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PORTFOLIO TAB */}
            <div className={`${activeTab === 'portfolio' ? 'hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}>
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Featured Financial Models</h3>

                {/* Desktop Only Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {models.length > 0 ? (
                    models.slice(0, 4).map((model) => (
                      <div key={model._id} className="h-full">
                        <ModelCard model={model} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      Loading featured models...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BLOG TAB */}
            <div className={`${activeTab === 'blog' ? 'hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}>
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Featured Insights</h3>

                {/* Desktop Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {blogs.length > 0 ? (
                    blogs.slice(0, 4).map((blog) => (
                      <div key={blog._id} className="h-full">
                        <BlogCard blog={blog} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      Loading latest insights...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTACT TAB */}
            <div className={`${activeTab === 'contact' ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : 'block lg:hidden'}`}>
              <div className="bg-card rounded-lg p-8 border border-border">
                <div className="mb-8">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Get in Touch</span>
                  <h2 className="text-3xl font-bold mb-2 text-foreground">Contact With Me</h2>
                  <p className="text-muted-foreground text-sm">
                    Have a project in mind, a question, or just want to say hello? Feel free to reach out! I'm always open to discussing new ideas, collaborations, or freelance opportunities.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Your Name</label>
                      <Input placeholder="Enter your name" className="bg-accent border-border focus:border-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                      <Input placeholder="Enter phone number" className="bg-accent border-border focus:border-primary h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Your Email</label>
                      <Input type="email" placeholder="Enter your email" className="bg-accent border-border focus:border-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Your Subject</label>
                      <Input placeholder="Enter subject" className="bg-accent border-border focus:border-primary h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Your Message</label>
                    <Textarea placeholder="Write your message here" className="bg-accent border-border focus:border-primary min-h-[150px] resize-none" />
                  </div>

                  <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-chart-4 hover:from-primary/80 hover:to-chart-4/80 shadow-lg shadow-primary/20 text-primary-foreground">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Navigation (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-2 mt-10 lg:mt-36">
            <div className="sticky top-24">
              {/* Electric Border Container */}
              <div className="relative rounded-lg p-[1px] overflow-hidden">
                {/* Rotating Gradient Border */}
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#3b82f6_100%)]" />

                {/* Background Mask */}
                <div className="relative bg-card rounded-lg p-4 space-y-3 h-full w-full backdrop-blur-3xl">
                  {[
                    { id: 'about', label: 'About', icon: User },
                    { id: 'resume', label: 'Resume', icon: FileText },
                    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
                    { id: 'blog', label: 'Blog', icon: LineChart },
                    { id: 'contact', label: 'Contact', icon: Send },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={`relative p-[1px] rounded-lg transition-all duration-300 ${activeTab === item.id
                        ? 'bg-gradient-to-r from-primary to-chart-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-transparent hover:bg-gradient-to-r hover:from-chart-2 hover:to-primary'
                        }`}
                    >
                      <Button
                        onClick={() => setActiveTab(item.id)}
                        variant="ghost"
                        className={`w-full justify-start h-12 rounded-lg px-4 font-medium transition-all duration-300 relative z-10 ${activeTab === item.id
                          ? 'bg-primary text-primary-foreground shadow-md border border-primary/20'
                          : 'bg-card text-muted-foreground hover:text-foreground hover:bg-card border border-transparent'
                          }`}
                      >
                        <span className="flex-1 text-sm">{item.label}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>

        </div>
      </div>

    </div>
  )
}