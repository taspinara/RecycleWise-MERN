import mongoose from 'mongoose';

const ScanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  recyclable: { type: Boolean, required: true },
  instructions: { type: String }
});

export default mongoose.model('Scan', ScanSchema);
