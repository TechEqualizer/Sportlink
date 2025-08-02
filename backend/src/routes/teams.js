import express from 'express';
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamAthletes
} from '../controllers/teamController.js';

const router = express.Router();

// Routes
router.route('/')
  .get(getTeams)      // GET /api/teams - Get all teams
  .post(createTeam);  // POST /api/teams - Create new team

router.route('/:id')
  .get(getTeam)       // GET /api/teams/:id - Get single team
  .put(updateTeam)    // PUT /api/teams/:id - Update team
  .delete(deleteTeam); // DELETE /api/teams/:id - Delete team

router.get('/:id/athletes', getTeamAthletes); // GET /api/teams/:id/athletes

export default router;