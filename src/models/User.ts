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
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)