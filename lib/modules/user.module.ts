import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
    role: {
    type: String,
    enum: ["viewer", "blogger", "admin"],
    default: "viewer",
  },
  firstName: { type: String },
  lastName: { type: String },
  photo: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
