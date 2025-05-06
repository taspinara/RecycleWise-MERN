import mongoose from 'mongoose';

const CompletionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ChallengeCompletion', CompletionSchema);
