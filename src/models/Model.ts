import mongoose from 'mongoose'

const slideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  order: { type: Number, required: true },
})

const ModelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'published' 
  },
  dealSize: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  industry: { type: String, required: true },
  dealType: { type: String, required: true },
  completionDate: { type: Date, required: true },
  excelFileUrl: { type: String },
  slides: [slideSchema],
  rationale: { type: String, required: true },
  keyMetrics: { type: Map, of: String },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Middleware to update timestamp
ModelSchema.pre('save', async function () {
  this.updatedAt = new Date()
})

// FIXED: Singleton Pattern
// If the model exists, use it. If not, create it.
// This prevents "OverwriteModelError" without deleting the cache.
const Model = mongoose.models.Model || mongoose.model('Model', ModelSchema)

export default Model