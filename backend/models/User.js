const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  college: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18 },
  bio: { type: String, trim: true, default: '' },
  interests: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);