import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  appliedForBlogger:{
    type:Boolean,
    default:false
  },
  isBlocked:{
    type:Boolean,
    default:false
  }, 
  role:{
    type:String,
    enum:['viewer','blogger','admin'],
    default:'viewer'
  },
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
});

const User = models?.User || model("User", UserSchema);

export default User;