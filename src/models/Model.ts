import mongoose from 'mongoose'

const slideSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
})

const ModelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  dealSize: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  industry: {
    type: String,
    required: true,
  },
  dealType: {
    type: String,
    required: true,
  },
  completionDate: {
    type: Date,
    required: true,
  },
  excelFileUrl: {
    type: String,
  },
  slides: [slideSchema],
  rationale: {
    type: String,
    required: true,
  },
  keyMetrics: {
    type: Map,
    of: String,
  },
  featured: {
    type: Boolean,
    default: false,
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

// FIXED: Use async function and remove 'next' parameter
ModelSchema.pre('save', async function () {
  this.updatedAt = new Date()
})

// Delete from cache if exists to prevent Hot Reload errors in Next.js
if (mongoose.models.Model) {
  delete mongoose.models.Model
}

export default mongoose.model('Model', ModelSchema)