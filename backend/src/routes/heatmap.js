import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// GET /api/heatmap/urls
// Helper endpoint to get all unique page URLs that have tracked events
router.get('/urls', async (req, res) => {
  try {
    const urls = await Event.distinct('page_url');
    res.json(urls);
  } catch (error) {
    console.error('Error fetching unique URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/heatmap
// Returns click events for a specific page URL
router.get('/', async (req, res) => {
  try {
    const { page_url } = req.query;

    if (!page_url) {
      return res.status(400).json({ error: 'page_url query parameter is required.' });
    }

    const clicks = await Event.find({
      page_url: page_url,
      event_type: 'click',
    }).select('x y timestamp session_id -_id');

    res.json(clicks);
  } catch (error) {
    console.error('Error fetching heatmap clicks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
