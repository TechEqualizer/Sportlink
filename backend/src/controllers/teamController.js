import Team from '../models/Team.js';

// Get all teams
export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll();

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

// Get single team by ID
export const getTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const team = await Team.findById(id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// Create new team
export const createTeam = async (req, res, next) => {
  try {
    const teamData = req.body;

    // Basic validation
    if (!teamData.name) {
      return res.status(400).json({
        success: false,
        error: 'Team name is required'
      });
    }

    const team = await Team.create(teamData);

    res.status(201).json({
      success: true,
      data: team,
      message: 'Team created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update team
export const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teamData = req.body;

    const team = await Team.update(id, teamData);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team,
      message: 'Team updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete team
export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Team.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get team athletes
export const getTeamAthletes = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if team exists
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    const athletes = await Team.getAthletes(id);

    res.json({
      success: true,
      data: athletes
    });
  } catch (error) {
    next(error);
  }
};