// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  ecoPoints: {
    type: Number,
    default: 0,
  },
  badges: [String],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
