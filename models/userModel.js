import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  refreshToken: {
    type: String,
    required: true,
    default: 'null',
  },
}, { minimize: false });

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;