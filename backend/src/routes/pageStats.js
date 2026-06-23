import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// GET /api/page-stats?page_url=<encoded-url>
router.get('/', async (req, res) => {
  try {
    const { page_url } = req.query;

    if (!page_url) {
      return res.status(400).json({ error: 'page_url query parameter is required.' });
    }

    // Get unique session IDs that have visited this URL
    const distinctSessions = await Event.distinct('session_id', { page_url });
    const total_sessions = distinctSessions.length;

    if (total_sessions === 0) {
      return res.json({
        page_url,
        total_sessions: 0,
        bounce_rate: 0,
        avg_events_per_session: 0,
        max_scroll_depth: 0,
        top_referrers: [],
      });
    }

    // Aggregate average events and bounce counts for these sessions overall
    const sessionStats = await Event.aggregate([
      {
        $match: {
          session_id: { $in: distinctSessions },
        },
      },
      {
        $group: {
          _id: '$session_id',
          total_events: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          avg_events: { $avg: '$total_events' },
          bounced_count: {
            $sum: { $cond: [{ $eq: ['$total_events', 1]}, 1, 0] },
          },
        },
      },
    ]);

    const avg_events_per_session =
      sessionStats.length > 0 ? parseFloat(sessionStats[0].avg_events.toFixed(1)) : 0;
    const bounced_count = sessionStats.length > 0 ? sessionStats[0].bounced_count : 0;
    const bounce_rate =
      total_sessions > 0 ? parseFloat((bounced_count / total_sessions).toFixed(2)) : 0;

    // Find the maximum scroll depth milestone crossed on this page
    const maxScroll = await Event.aggregate([
      {
        $match: {
          page_url: page_url,
          event_type: 'scroll_depth',
        },
      },
      {
        $group: {
          _id: null,
          max_depth: { $max: '$depth' },
        },
      },
    ]);
    const max_scroll_depth = maxScroll.length > 0 ? maxScroll[0].max_depth : 0;

    // Extract top 5 referrers for this page from the initial page view metadata
    const referrers = await Event.aggregate([
      {
        $match: {
          page_url: page_url,
          event_type: 'page_view',
          'metadata.referrer': { $ne: null, $ne: '' },
        },
      },
      {
        $group: {
          _id: '$metadata.referrer',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const top_referrers = referrers.map((r) => r._id);

    res.json({
      page_url,
      total_sessions,
      bounce_rate,
      avg_events_per_session,
      max_scroll_depth,
      top_referrers,
    });
  } catch (error) {
    console.error('Error fetching page stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
