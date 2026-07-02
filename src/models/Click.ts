import mongoose from 'mongoose';

const ClickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Desktop' }, // Desktop, Mobile, Tablet
  country: { type: String, default: 'Unknown' },
}, {
  timestamps: true // Gives us the exact time of the click
});

const Click = mongoose.models.Click || mongoose.model('Click', ClickSchema);

export default Click;
