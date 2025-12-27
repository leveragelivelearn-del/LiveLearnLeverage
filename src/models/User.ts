import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    select: false // <--- ADD THIS! (Protects password from being leaked)
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'user'], // Added 'user' just in case
    default: 'user',
  },
  image: { type: String },
  bio: { type: String },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  createdAt: { type: Date, default: Date.now },
})

// FIX: Force delete model to clear bad cache from previous HMR (Crucial for Schema updates)
if (process.env.NODE_ENV === 'development' && mongoose.models && mongoose.models.User) {
  delete mongoose.models.User
}

export default mongoose.models.User || mongoose.model('User', UserSchema)