import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true // Ensure name is required
  },
  avatar: {
    type: String,   // URL to the user's avatar
    default: ''     // Optional field with a default value
  },
  last_time_connect: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
