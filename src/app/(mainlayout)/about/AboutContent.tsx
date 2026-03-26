'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { WhatsAppIcon } from '@/components/icons/WhatsappIcon';
import emailjs from '@emailjs/browser';
import { SparklesCore } from "@/components/ui/sparkles";

interface AboutContentProps {
  initialAboutData: any;
  initialSettings: any;
  initialModels: any[];
  initialBlogs: any[];
}

export default function AboutContent({
  initialAboutData,
  initialSettings,
  initialModels,
  initialBlogs
}: AboutContentProps) {
  const [activeTab, setActiveTab] = useState('about');
  const [models, setModels] = useState<any[]>(initialModels || []);
  const [blogs, setBlogs] = useState<any[]>(initialBlogs || []);
  const [settings] = useState<any>(initialSettings);
  const [aboutData] = useState<any>(initialAboutData);

  // Contact form state
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'sending' | 'success' | 'error' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Contact form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    if (!form.current) return;

    emailjs
      .sendForm(
        'service_vgs5pnk',
        'template_uw8xbk6',
        form.current,
        '9HWquHx5aqMLa0d6l'
      )
      .then(
        (result) => {
          setStatus('success');
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
          setTimeout(() => setStatus(null), 3000);
        },
        (error) => {
          setStatus('error');
          setTimeout(() => setStatus(null), 3000);
        }
      );
  };

  // Only fetch if not provided as initial data
  useEffect(() => {
    if (activeTab === 'portfolio' && models.length === 0) {
      const fetchModels = async () => {
        try {
          const res = await fetch('/api/models');
          const data = await res.json();
          if (data.models) {
            const featured = data.models.filter((m: any) => m.featured);
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
    <div className="min-h-screen text-foreground font-sans pt-16 lg:pt-0">

      {/* Top Banner Section */}
      <div className="relative h-[250px] lg:h-[400px] w-full bg-transparent overflow-hidden flex items-center justify-end px-6 md:px-12 lg:px-24">
        {/* Background Effects */}
        <div className="w-full absolute inset-0 h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 lg:-mt-48 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="sticky top-24">
              <div className="bg-card rounded-lg p-6 border border-border shadow-2xl backdrop-blur-sm">
                <div className="relative w-full aspect-[4/5] mb-6 rounded-lg overflow-hidden bg-gradient-to-b from-muted to-card ring-1 ring-border group">
                  <Image
                    src={aboutData?.profileImage || "/assets/gamaelle-charles.png"}
                    alt={aboutData?.name || "Gamaelle Charles"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>

                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-xl font-bold text-foreground">
                    {aboutData?.name || "Gamaelle Charles"}
                  </h2>
                  <p className="text-primary font-medium text-xs pt-1 leading-relaxed">
                    {aboutData?.tagline || "Junior at Babson College | Fidelity Scholar | MLT Fellow | GWI SIP ’25"}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-lg bg-accent border border-border text-center group hover:border-primary/30 transition-colors">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Email</p>
                    <a href={`mailto:${aboutData?.email || "gamaellechar123@gmail.com"}`} className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors truncate block">
                      {aboutData?.email || "gamaellechar123@gmail.com"}
                    </a>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                  {(() => {
                    const links = [];
                    if (settings?.socialLinks?.facebook) links.push({ icon: Facebook, href: settings.socialLinks.facebook });
                    if (settings?.socialLinks?.twitter) links.push({ icon: Twitter, href: settings.socialLinks.twitter });
                    if (settings?.socialLinks?.linkedin) links.push({ icon: Linkedin, href: settings.socialLinks.linkedin });
                    if (settings?.socialLinks?.instagram) links.push({ icon: Instagram, href: settings.socialLinks.instagram });
                    if (settings?.socialLinks?.whatsapp) links.push({ icon: WhatsAppIcon, href: settings.socialLinks.whatsapp });

                    if (links.length === 0) {
                      return (
                        <Button variant="outline" size="icon" className="rounded-full bg-accent border-border hover:bg-gradient-to-r hover:from-primary hover:to-chart-4 hover:text-primary-foreground hover:border-transparent transition-all text-muted-foreground h-9 w-9">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )
                    }

                    return links.map((link, i) => (
                      <a key={i} href={link.href} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-full bg-accent border-border hover:bg-gradient-to-r hover:from-primary hover:to-chart-4 hover:text-primary-foreground hover:border-transparent transition-all text-muted-foreground h-9 w-9">
                          <link.icon className="h-4 w-4" />
                        </Button>
                      </a>
                    ));
                  })()}
                </div>

                <Button asChild className="w-full rounded-lg py-5 bg-transparent border border-border hover:bg-foreground hover:text-background transition-all text-foreground font-medium text-sm group">
                  <a href={aboutData?.resumeUrl || "/assets/gamaelle-charles-resume.pdf"} download={`${(aboutData?.name || "Gamaelle_Charles").replace(/\s+/g, '_')}_Resume.pdf`}>
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
              <div className="bg-card rounded-lg p-8 border border-border relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <LineChart className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-foreground">
                    {aboutData?.bioTitle || "About Me"}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                    {aboutData?.bioParagraph1 || "Finance student passionate about fair and free markets, civil duty, and investment banking/private equity."}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {aboutData?.bioParagraph2 || "Developing expertise in financial modeling (DCF, LBO, pro forma), due diligence, and transaction analysis."}
                  </p>
                </div>
              </div>
            </div>

            {/* RESUME TAB */}
            <div className={`mb-12 lg:mb-0 ${activeTab === 'resume' ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : 'block lg:hidden'}`}>
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-foreground">
                  <Briefcase className="text-primary" /> Experience
                </h3>
                <div className="space-y-8 border-l-2 border-border pl-8 ml-4">
                  {(aboutData?.experience && aboutData.experience.length > 0) ? (
                    aboutData.experience.map((item: any, i: number) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary"></span>
                        <h4 className="text-xl font-bold text-foreground mb-1">{item.role}</h4>
                        <p className="text-sm text-primary mb-2">{item.company} <span className="text-muted-foreground mx-2">|</span> {item.period}</p>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No experience data available.</p>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-lg p-8 border border-border mt-8">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-foreground">
                  <GraduationCap className="text-chart-2" /> Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(aboutData?.education && aboutData.education.length > 0) ? (
                    aboutData.education.map((item: any, i: number) => (
                      <div key={i} className="bg-accent p-6 rounded-lg border border-border">
                        <span className="text-xs text-chart-2 font-bold tracking-wider">{item.year}</span>
                        <h4 className="text-lg font-bold text-foreground mt-1 mb-2">{item.degree}</h4>
                        <p className="text-muted-foreground text-sm">{item.school}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No education data available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* PORTFOLIO TAB */}
            <div className={`${activeTab === 'portfolio' ? 'hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}>
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Featured Financial Models</h3>
                <div className="grid grid-cols-2 gap-6">
                  {models.length > 0 ? (
                    models.slice(0, 4).map((model) => (
                      <div key={model._id} className="h-full">
                        <ModelCard model={model} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      No featured models available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BLOG TAB */}
            <div className={`${activeTab === 'blog' ? 'hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}>
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Featured Insights</h3>
                <div className="grid grid-cols-2 gap-6">
                  {blogs.length > 0 ? (
                    blogs.slice(0, 4).map((blog) => (
                      <div key={blog._id} className="h-full">
                        <BlogCard blog={blog} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      No blog insights available.
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
                    {aboutData?.contactDescription || "Have a question or feedback? Feel free to reach out!"}
                  </p>
                </div>

                <form ref={form} className="space-y-6" onSubmit={sendEmail}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Your Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="bg-accent border-border focus:border-primary h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="bg-accent border-border focus:border-primary h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Your Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="bg-accent border-border focus:border-primary h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Your Subject</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                        className="bg-accent border-border focus:border-primary h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Your Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here"
                      className="bg-accent border-border focus:border-primary min-h-[150px] resize-none"
                      required
                    />
                  </div>

                  {status && (
                    <div className={`p-4 rounded-lg text-center font-medium ${status === 'sending' ? 'bg-blue-500/10 text-blue-500' :
                      status === 'success' ? 'bg-green-500/10 text-green-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                      {status === 'sending' && 'Sending message...'}
                      {status === 'success' && '✓ Message sent successfully!'}
                      {status === 'error' && '✗ Failed to send message. Please try again.'}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-chart-4 hover:from-primary/80 hover:to-chart-4/80 shadow-lg shadow-primary/20 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Navigation (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-2 mt-10 lg:mt-36">
            <div className="sticky top-24">
              <div className="relative rounded-lg p-[1px] overflow-hidden">
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#3b82f6_100%)]" />
                <div className="relative bg-card rounded-lg p-4 space-y-3 h-full w-full backdrop-blur-3xl">
                  {[
                    { id: 'about', label: 'About', icon: User },
                    { id: 'resume', label: 'Resume', icon: FileText },
                    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
                    { id: 'blog', label: 'Blog', icon: LineChart },
                    { id: 'contact', label: 'Contact', icon: Send },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      variant="ghost"
                      className={`w-full justify-start h-12 rounded-lg px-4 font-medium transition-all duration-300 relative z-10 ${activeTab === item.id
                        ? 'bg-primary text-primary-foreground shadow-md border border-primary/20'
                        : 'bg-card text-muted-foreground hover:text-foreground hover:bg-card border border-transparent'
                        }`}
                    >
                      <span className="flex-1 text-sm">{item.label}</span>
                    </Button>
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
