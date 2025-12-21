import Link from 'next/link'
import { Facebook, Linkedin, Twitter, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/gamaelle-charles-liv3theg00dlif3/', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Mail, href: 'mailto:gamaellechar123@gmail.com', label: 'Email' },
  ]

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Models', href: '/models' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/about#contact' },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">LiveLearnLeverage</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Showcasing M&A expertise, financial models, and investment insights.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>123 Financial District</p>
              <p>New York, NY 10005</p>
              <p>United States</p>
              <a
                href="mailto:contact@livelearnleverage.com"
                className="block hover:text-primary transition-colors"
              >
                  
              </a>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} LiveLearnLeverage. All rights reserved.</p>
                  </div>
      </div>
    </footer>
  )
}