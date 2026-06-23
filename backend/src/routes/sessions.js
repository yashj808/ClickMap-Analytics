import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// GET /api/sessions
// Returns aggregated sessions sorted by last activity (descending)
router.get('/', async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$session_id',
          event_count: { $sum: 1 },
          first_seen: { $min: '$timestamp' },
          last_seen: { $max: '$timestamp' },
          device: { $max: '$metadata' },
        },
      },
      {
        $project: {
          _id: 0,
          session_id: '$_id',
          event_count: 1,
          first_seen: 1,
          last_seen: 1,
          bounced: { $eq: ['$event_count', 1] },
          device: 1,
        },
      },
      {
        $sort: { last_seen: -1 },
      },
    ]);

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sessions/:session_id
// Returns chronological events for a single session
router.get('/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;
    const events = await Event.find({ session_id }).sort({ timestamp: 1 });

    res.json(events);
  } catch (error) {
    console.error('Error fetching session events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
