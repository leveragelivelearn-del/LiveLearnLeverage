# LiveLearnLeverage - M&A Insights Platform

A full-stack blog and portfolio website showcasing M&A models, deal rationales, and financial insights with comprehensive admin capabilities.

---

## 🚀 Features

### Core Features
- **Responsive Design** - Mobile-first approach ensuring optimal viewing across all devices
- **Authentication System** - Secure admin dashboard with role-based access control
- **Content Management** - Complete CRUD operations for blog posts and M&A models
- **File Management** - Image uploads via ImgBB and Excel file storage with Vercel Blob
- **SEO Optimization** - Automatic sitemap generation, robots.txt, and comprehensive meta tags
- **Performance** - Optimized for Core Web Vitals and fast page loads

### Content Features
- **Blog System** - Rich text editor with categories, tags, and full-text search
- **M&A Models** - Excel file uploads, deal analysis tools, and presentation slides
- **Comments** - Built-in moderated commenting system
- **Contact Form** - Email integration with spam protection
- **Analytics Dashboard** - Comprehensive insights and metrics

### Technical Stack
- **Next.js 14** - App Router with React Server Components
- **TypeScript** - Full type safety throughout the application
- **MongoDB** - NoSQL database with Mongoose ODM
- **Tailwind CSS** - Utility-first styling framework
- **shadcn/ui** - High-quality reusable UI components
- **NextAuth.js** - Robust authentication system

---

## 🛠️ Installation

### Prerequisites
- Node.js 18 or higher
- MongoDB 6 or higher
- npm or yarn package manager

### Quick Start

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/livelearnleverage.org.git
cd livelearnleverage.org
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/livelearnleverage
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

**4. Initialize database**
```bash
node scripts/create-admin.js
node scripts/seed-database.js
```

**5. Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

### Docker Deployment

```bash
# Build image
docker build -t livelearnleverage .

# Run container
docker run -p 3000:3000 --env-file .env.local livelearnleverage
```

### Environment Variables

See `.env.local.example` for all required configuration variables.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public-facing pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── blog/             # Blog components
│   ├── models/           # M&A model components
│   ├── ui/               # shadcn/ui components
│   └── shared/           # Shared components
├── lib/                  # Utilities and configurations
├── models/               # Mongoose schemas
└── types/               # TypeScript type definitions
```

---

## 📈 SEO Optimization

- Automatic sitemap generation
- Configurable robots.txt
- JSON-LD structured data
- Open Graph and Twitter card support
- Optimized meta tags for all pages
- Canonical URL management

---

## 🔒 Security Features

- Password hashing with bcrypt
- CSRF protection
- API rate limiting
- Input validation with Zod
- SQL injection prevention
- XSS protection headers

---

## ⚡ Performance

- Next.js Image optimization
- Automatic code splitting and lazy loading
- SWR for efficient client-side data fetching
- Edge caching with Vercel
- Bundle size optimization

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Email**: contact@livelearnleverage.org
- **Issues**: Open an issue on GitHub

---

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)

---

## 📋 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
npm run setup            # Run initial setup
npm run seed             # Seed database
npm run test             # Run all tests
npm run deploy:vercel    # Deploy to Vercel
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
```

---

## 🎯 Project Status

**Status**: Production Ready ✅

### Implemented Features
- ✅ Complete frontend (Home, About, Models, Blog pages)
- ✅ Admin dashboard with full CMS functionality
- ✅ Authentication system with role-based access
- ✅ File upload system (images + Excel files)
- ✅ Analytics and reporting dashboard
- ✅ User management for multi-admin support
- ✅ Draft/publish workflows
- ✅ Search functionality across all pages
- ✅ Bulk operations for content management
- ✅ SEO optimization (sitemap, robots.txt, meta tags)
- ✅ Contact form with spam protection
- ✅ Comments system
- ✅ Performance optimizations
- ✅ Deployment ready (Vercel + Docker)

---

**Ready to build the future of M&A insights! 🚀**