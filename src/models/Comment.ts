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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for now to support old comments or guests if we ever allow that
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
}, { timestamps: true })

// FIX: Force delete model to clear bad cache from previous HMR
if (process.env.NODE_ENV === 'development' && mongoose.models && mongoose.models.Comment) {
  delete mongoose.models.Comment
}

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema)