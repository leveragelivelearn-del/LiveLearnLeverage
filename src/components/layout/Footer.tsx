import Link from 'next/link'
import { Facebook, Linkedin, Twitter, Mail, Instagram, MapPin, Phone } from 'lucide-react'
import dbConnect from '@/lib/db'
import Settings from '@/models/settings'
import Logo from '../logo'
import { WhatsAppIcon } from '../icons/WhatsappIcon'

async function getSettings() {
  try {
    await dbConnect()
    const settings = await Settings.findOne().lean()
    return settings || {}
  } catch (error) {
    console.error('Failed to load footer settings', error)
    return {}
  }
}

export async function Footer() {
  const settings = await getSettings()
  const currentYear = new Date().getFullYear()

  const socialLinks = []

  if (settings?.socialLinks?.linkedin) {
    socialLinks.push({ icon: Linkedin, href: settings.socialLinks.linkedin, label: 'LinkedIn' })
  }
  if (settings?.socialLinks?.twitter) {
    socialLinks.push({ icon: Twitter, href: settings.socialLinks.twitter, label: 'Twitter' })
  }
  if (settings?.socialLinks?.facebook) {
    socialLinks.push({ icon: Facebook, href: settings.socialLinks.facebook, label: 'Facebook' })
  }
  if (settings?.socialLinks?.instagram) {
    socialLinks.push({ icon: Instagram, href: settings.socialLinks.instagram, label: 'Instagram' })
  }
  if (settings?.socialLinks?.whatsapp) {
    socialLinks.push({ icon: WhatsAppIcon, href: settings.socialLinks.whatsapp, label: 'WhatsApp' })
  }
  // Optional: Add email to social row if desired, or keep just in contact section below
  if (settings?.contactEmail) {
    socialLinks.push({ icon: Mail, href: `mailto:${settings.contactEmail}`, label: 'Email' })
  }

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Models', href: '/models' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/about#contact' },
  ]

  return (
    <footer className="border-t bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {settings?.siteDescription || 'Showcasing M&A expertise, financial models, and investment insights.'}
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
            <h3 className="text-lg text-white font-semibold mb-4">Quick Links</h3>
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
            <h3 className="text-lg text-white font-semibold mb-4">Contact</h3>
            <address className="not-italic space-y-3 text-sm text-muted-foreground">
              {/* Address Section */}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                {settings?.contactAddress ? (
                  <span className="whitespace-pre-line">{settings.contactAddress}</span>
                ) : (
                  <div>
                    <p>123 Financial District</p>
                    <p>New York, NY 10005</p>
                    <p>United States</p>
                  </div>
                )}
              </div>

              {/* Phone Section */}
              {settings?.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-primary transition-colors">
                    {settings.contactPhone}
                  </a>
                </div>
              )}

              {/* Email Section */}
              {settings?.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary transition-colors">
                    {settings.contactEmail}
                  </a>
                </div>
              )}
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} {settings?.siteName || 'LiveLearnLeverage'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}