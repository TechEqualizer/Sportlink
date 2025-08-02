import express from 'express';
import {
  getAthletes,
  getAthlete,
  createAthlete,
  updateAthlete,
  deleteAthlete,
  getAthleteStatistics,
  getAthleteVideos,
  searchAthletes
} from '../controllers/athleteController.js';

const router = express.Router();

// Routes
router.route('/')
  .get(getAthletes)      // GET /api/athletes - Get all athletes with filtering/pagination
  .post(createAthlete);  // POST /api/athletes - Create new athlete

router.get('/search', searchAthletes); // GET /api/athletes/search - Search athletes for autocomplete

router.route('/:id')
  .get(getAthlete)       // GET /api/athletes/:id - Get single athlete
  .put(updateAthlete)    // PUT /api/athletes/:id - Update athlete
  .delete(deleteAthlete); // DELETE /api/athletes/:id - Delete athlete

router.get('/:id/statistics', getAthleteStatistics); // GET /api/athletes/:id/statistics
router.get('/:id/videos', getAthleteVideos);         // GET /api/athletes/:id/videos

export default router;