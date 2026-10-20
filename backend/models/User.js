const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter your name'], trim: true },
  email: { type: String, required: [true, 'Please enter your email'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Please enter a password'], minlength: 6 },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
