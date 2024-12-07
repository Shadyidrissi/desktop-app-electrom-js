import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true }, // Ensure each Clerk user ID is unique
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
