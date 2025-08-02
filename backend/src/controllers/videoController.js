import Video from '../models/Video.js';
import Athlete from '../models/Athlete.js';

// Get all videos with filtering and pagination
export const getVideos = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      athlete_id,
      category,
      source,
      featured
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const filters = {};
    if (athlete_id) filters.athlete_id = athlete_id;
    if (category && category !== 'all') filters.category = category;
    if (source) filters.source = source;
    if (featured !== undefined) filters.is_featured = featured === 'true';

    const options = {
      sortBy,
      sortOrder,
      limit: limitNum,
      offset,
      filters
    };

    const [videos, total] = await Promise.all([
      Video.findAll(options),
      Video.count(filters)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: videos,
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

// Get single video by ID
export const getVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// Create new video
export const createVideo = async (req, res, next) => {
  try {
    const videoData = req.body;

    // Basic validation
    if (!videoData.athlete_id || !videoData.title || !videoData.video_url) {
      return res.status(400).json({
        success: false,
        error: 'Athlete ID, title, and video URL are required fields'
      });
    }

    // Check if athlete exists
    const athlete = await Athlete.findById(videoData.athlete_id);
    if (!athlete) {
      return res.status(400).json({
        success: false,
        error: 'Invalid athlete ID'
      });
    }

    // Extract YouTube ID if it's a YouTube URL
    if (videoData.video_url.includes('youtube.com') || videoData.video_url.includes('youtu.be')) {
      const youtubeId = extractYouTubeId(videoData.video_url);
      if (youtubeId) {
        videoData.source = 'youtube';
        videoData.source_id = youtubeId;
        if (!videoData.thumbnail) {
          videoData.thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }
      }
    }

    const video = await Video.create(videoData);

    res.status(201).json({
      success: true,
      data: video,
      message: 'Video created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update video
export const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videoData = req.body;

    const video = await Video.update(id, videoData);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    res.json({
      success: true,
      data: video,
      message: 'Video updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete video
export const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Video.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Increment video view count
export const incrementViews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Video.incrementViews(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    res.json({
      success: true,
      data: { views: result.views },
      message: 'View count updated'
    });
  } catch (error) {
    next(error);
  }
};

// Get featured videos
export const getFeaturedVideos = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const videos = await Video.getFeatured(parseInt(limit));

    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

// Get videos by athlete with categories grouped
export const getVideosByAthleteGrouped = async (req, res, next) => {
  try {
    const { athlete_id } = req.params;

    // Check if athlete exists
    const athlete = await Athlete.findById(athlete_id);
    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    const videoGroups = await Video.getByAthleteGrouped(athlete_id);

    res.json({
      success: true,
      data: videoGroups
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to extract YouTube video ID
const extractYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/) |youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};