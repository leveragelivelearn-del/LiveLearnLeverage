import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema({
  
  // General
  siteName: { type: String, default: 'LiveLearnLeverage' },
  siteUrl: { type: String, default: 'https://livelearnleverage.com' },
  siteDescription: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  maintenanceMode: { type: Boolean, default: false },

  // Social Links
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },

  // Contact Info
  contactAddress: { type: String, default: '' },
  contactPhone: { type: String, default: '' },

  // NEW: FAQs
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],

  // SEO
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  generateSitemap: { type: Boolean, default: true },

  // Email
  smtpHost: { type: String, default: '' },
  smtpPort: { type: String, default: '' },
  smtpUser: { type: String, default: '' },
  smtpPass: { type: String, default: '' },
  fromEmail: { type: String, default: '' },
  notifyNewUser: { type: Boolean, default: true },
  notifyNewComment: { type: Boolean, default: true },

  // Security
  sessionTimeout: { type: Number, default: 30 },
  require2FA: { type: Boolean, default: false },
  rateLimit: { type: Boolean, default: true },
  maxLoginAttempts: { type: Number, default: 5 },
  minPasswordLength: { type: Number, default: 8 },
  requireSpecialChar: { type: Boolean, default: true },
  requireNumbers: { type: Boolean, default: true },

  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)