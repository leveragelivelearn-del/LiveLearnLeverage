/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  postId: {
    type: String,
    required: true,
  },
  postType: {
    type: String,
    enum: ['blog', 'model'],
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
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

CommentSchema.pre('save', function (next: any) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema)