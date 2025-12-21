import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import Model from '@/models/Model'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect()
  
  const baseUrl = process.env.NEXTAUTH_URL || 'https://livelearnleverage.com'
  
  // Get all published blog posts
  const blogs = await Blog.find({ published: true })
    .select('slug updatedAt publishedAt')
    .lean()
  
  // Get all models
  const models = await Model.find()
    .select('slug updatedAt completionDate')
    .lean()
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Blog posts
  const blogPosts = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Models
  const modelPages = models.map((model) => ({
    url: `${baseUrl}/models/${model.slug}`,
    lastModified: new Date(model.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPosts, ...modelPages]
}