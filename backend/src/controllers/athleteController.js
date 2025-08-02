import Athlete from '../models/Athlete.js';

// Get all athletes with filtering and pagination
export const getAthletes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 25,
      sortBy = 'updated_at',
      sortOrder = 'DESC',
      name,
      class_year,
      recruiting_status,
      sport_type,
      minGpa
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const filters = {};
    if (name) filters.name = name;
    if (class_year && class_year !== 'All') filters.class_year = class_year;
    if (recruiting_status && recruiting_status !== 'All') filters.recruiting_status = recruiting_status;
    if (sport_type && sport_type !== 'All') filters.sport_type = sport_type;
    if (minGpa) filters.minGpa = minGpa;

    const options = {
      sortBy,
      sortOrder,
      limit: limitNum,
      offset,
      filters
    };

    const [athletes, total] = await Promise.all([
      Athlete.findAll(options),
      Athlete.count(filters)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: athletes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single athlete by ID
export const getAthlete = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const athlete = await Athlete.findById(id);
    
    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    res.json({
      success: true,
      data: athlete
    });
  } catch (error) {
    next(error);
  }
};

// Create new athlete
export const createAthlete = async (req, res, next) => {
  try {
    const athleteData = req.body;

    // Basic validation
    if (!athleteData.name || !athleteData.position) {
      return res.status(400).json({
        success: false,
        error: 'Name and position are required fields'
      });
    }

    const athlete = await Athlete.create(athleteData);

    res.status(201).json({
      success: true,
      data: athlete,
      message: 'Athlete created successfully'
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === '23505' && error.constraint?.includes('email')) {
      return res.status(400).json({
        success: false,
        error: 'Email address already exists'
      });
    }
    next(error);
  }
};

// Update athlete
export const updateAthlete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const athleteData = req.body;

    const athlete = await Athlete.update(id, athleteData);

    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    res.json({
      success: true,
      data: athlete,
      message: 'Athlete updated successfully'
    });
  } catch (error) {
    if (error.code === '23505' && error.constraint?.includes('email')) {
      return res.status(400).json({
        success: false,
        error: 'Email address already exists'
      });
    }
    next(error);
  }
};

// Delete athlete
export const deleteAthlete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Athlete.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    res.json({
      success: true,
      message: 'Athlete deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get athlete statistics
export const getAthleteStatistics = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if athlete exists
    const athlete = await Athlete.findById(id);
    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    const statistics = await Athlete.getStatistics(id);

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};

// Get athlete videos
export const getAthleteVideos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    // Check if athlete exists
    const athlete = await Athlete.findById(id);
    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    const videos = await Athlete.getVideos(id, category);

    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

// Search athletes (for autocomplete/typeahead)
export const searchAthletes = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const options = {
      limit: parseInt(limit),
      offset: 0,
      filters: { name: q }
    };

    const athletes = await Athlete.findAll(options);

    res.json({
      success: true,
      data: athletes.map(athlete => ({
        id: athlete.id,
        name: athlete.name,
        position: athlete.position,
        class_year: athlete.class_year,
        sport_type: athlete.sport_type
      }))
    });
  } catch (error) {
    next(error);
  }
};