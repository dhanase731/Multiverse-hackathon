import mongoose from 'mongoose';

const actionItemSchema = new mongoose.Schema({
  person: { type: String, default: 'Team' },
  task:   { type: String, required: true },
}, { _id: false });

const meetingSchema = new mongoose.Schema({
  meetingId:    { type: String, required: true, unique: true, index: true },
  meetingTitle: { type: String, default: 'Untitled Meeting' },
  userId:       { type: String, default: 'anonymous' },
  status:       { type: String, enum: ['LIVE', 'COMPLETED'], default: 'LIVE' },
  transcript:   { type: String, default: '' },
  transcriptLines: { type: Number, default: 0 },
  bulletPoints: [String],
  summary:      { type: String, default: '' },
  actionItems:  [actionItemSchema],
  decisions:    [String],
  keyPoints:    [String],
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);
