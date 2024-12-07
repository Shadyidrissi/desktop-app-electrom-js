import mongoose from "mongoose";

const Post = mongoose.Schema(
  {
    name: String,
    age:Number
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model("Posts", Post);