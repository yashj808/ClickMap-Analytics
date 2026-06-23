import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    index: true,
  },
  event_type: {
    type: String,
    required: true,
    enum: ['page_view', 'click', 'scroll_depth'],
  },
  page_url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
  },
  x: {
    type: Number,
    default: null,
  },
  y: {
    type: Number,
    default: null,
  },
  depth: {
    type: Number,
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for heatmap queries
EventSchema.index({ page_url: 1, event_type: 1 });
// Index for sorting events and sessions list
EventSchema.index({ timestamp: -1 });

const Event = mongoose.model('Event', EventSchema);

export default Event;
