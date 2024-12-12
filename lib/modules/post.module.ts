import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  isApproved:{
    type:Boolean,
    default:false
  }, 
  content: {
    type: String,
    unique: true,
  },
  city: {
    type: String,
    unique: true,
  },
  phone: {
    type: Number,
    unique: true,
  },
  categorie: {
    type: String,
    unique: true,
  },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
});

const Post = models?.Post || model("Post", PostSchema);

export default Post;