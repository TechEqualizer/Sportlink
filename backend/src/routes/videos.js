import express from 'express';
import {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  incrementViews,
  getFeaturedVideos,
  getVideosByAthleteGrouped
} from '../controllers/videoController.js';

const router = express.Router();

// Routes
router.route('/')
  .get(getVideos)      // GET /api/videos - Get all videos with filtering/pagination
  .post(createVideo);  // POST /api/videos - Create new video

router.get('/featured', getFeaturedVideos); // GET /api/videos/featured

router.route('/:id')
  .get(getVideo)       // GET /api/videos/:id - Get single video
  .put(updateVideo)    // PUT /api/videos/:id - Update video
  .delete(deleteVideo); // DELETE /api/videos/:id - Delete video

router.post('/:id/view', incrementViews); // POST /api/videos/:id/view - Increment view count

router.get('/athlete/:athlete_id/grouped', getVideosByAthleteGrouped); // GET /api/videos/athlete/:athlete_id/grouped

export default router;