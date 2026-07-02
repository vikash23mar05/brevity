import mongoose from 'mongoose';

// Define the schema for a URL
const UrlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Allow null for anonymous links
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Ensure the model isn't compiled multiple times in development
const Url = mongoose.models.Url || mongoose.model('Url', UrlSchema);

export default Url;
