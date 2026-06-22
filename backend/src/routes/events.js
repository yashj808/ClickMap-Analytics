import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const { session_id, event_type, page_url, timestamp, x, y } = req.body;

    // Validate required fields
    if (!session_id || !event_type || !page_url || !timestamp) {
      return res.status(400).json({
        error: 'Missing required fields: session_id, event_type, page_url, and timestamp are required.',
      });
    }

    if (event_type !== 'page_view' && event_type !== 'click') {
      return res.status(400).json({
        error: "Invalid event_type. Must be either 'page_view' or 'click'.",
      });
    }

    const newEvent = new Event({
      session_id,
      event_type,
      page_url,
      timestamp: new Date(timestamp),
      x: event_type === 'click' ? x : null,
      y: event_type === 'click' ? y : null,
    });

    await newEvent.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error ingesting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
