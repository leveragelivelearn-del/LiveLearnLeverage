import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft',
  },
  featuredImage: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
  }],
  category: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  seoTitle: {
    type: String,
  },
  seoDescription: {
    type: String,
  },
  readTime: {
    type: Number,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// FIXED: Async function, NO parameters, NO next() call
BlogSchema.pre('save', async function () {
  this.updatedAt = new Date()
  
  // Calculate read time (approx 200 words per minute)
  if (this.content) {
    const words = this.content.split(/\s+/).length
    this.readTime = Math.ceil(words / 200)
  }
  
  // Set publishedAt if publishing for first time
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
})

// Delete existing model from cache if it exists to prevent Hot Reload errors
if (mongoose.models.Blog) {
  delete mongoose.models.Blog
}

export default mongoose.model('Blog', BlogSchema)