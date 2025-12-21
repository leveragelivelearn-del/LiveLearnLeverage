import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. HARDCODED CLOUD URI (Fixed to include database name '/LiveLearnLeverage')
const MONGODB_URI = "mongodb+srv://LiveLearnLeverage:jVtmpvPoNuDnAMeG@cluster0.e5n1hnl.mongodb.net/LiveLearnLeverage?retryWrites=true&w=majority";

async function createAdmin() {
  try {
    // 2. Connect to the Real Cloud Database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Cloud MongoDB (LiveLearnLeverage)');

    // 3. Define User Schema
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: 'user' },
      name: { type: String },
      createdAt: { type: Date, default: Date.now }
    });

    // Use existing model or create new one
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // 4. Admin Details
    const email = 'admin@example.com';
    const password = 'admin123';
    const name = 'Admin User';

    // 5. Check if admin exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // If user exists, we UPDATE their password to be sure it matches
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.role = 'admin'; // Ensure they are admin
        await existingUser.save();
        console.log('🔄 User existed. Password and Role UPDATED successfully.');
        process.exit(0);
    }

    // 6. Create User (if not exists)
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });

    console.log('🎉 Admin user created successfully in CLOUD DB!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createAdmin();