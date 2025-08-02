import { query } from '../config/database.js';

export class Video {
  
  // Get all videos with filtering and pagination
  static async findAll(options = {}) {
    const { 
      sortBy = 'created_at', 
      sortOrder = 'DESC', 
      limit = 50, 
      offset = 0,
      filters = {}
    } = options;

    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramCount = 0;

    // Apply filters
    if (filters.athlete_id) {
      paramCount++;
      whereClause += ` AND v.athlete_id = $${paramCount}`;
      params.push(filters.athlete_id);
    }

    if (filters.category) {
      paramCount++;
      whereClause += ` AND v.category = $${paramCount}`;
      params.push(filters.category);
    }

    if (filters.source) {
      paramCount++;
      whereClause += ` AND v.source = $${paramCount}`;
      params.push(filters.source);
    }

    if (filters.is_featured !== undefined) {
      paramCount++;
      whereClause += ` AND v.is_featured = $${paramCount}`;
      params.push(filters.is_featured);
    }

    // Build query
    const validSortColumns = ['created_at', 'updated_at', 'title', 'views', 'category'];
    const safeSort = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    paramCount++;
    const limitParam = paramCount;
    paramCount++;
    const offsetParam = paramCount;
    
    const sql = `
      SELECT 
        v.*,
        a.name as athlete_name,
        a.position as athlete_position
      FROM videos v
      LEFT JOIN athletes a ON v.athlete_id = a.id
      ${whereClause}
      ORDER BY v.${safeSort} ${safeOrder}
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;
    
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  }

  // Get total count for pagination
  static async count(filters = {}) {
    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramCount = 0;

    // Apply same filters as findAll
    if (filters.athlete_id) {
      paramCount++;
      whereClause += ` AND athlete_id = $${paramCount}`;
      params.push(filters.athlete_id);
    }

    if (filters.category) {
      paramCount++;
      whereClause += ` AND category = $${paramCount}`;
      params.push(filters.category);
    }

    if (filters.source) {
      paramCount++;
      whereClause += ` AND source = $${paramCount}`;
      params.push(filters.source);
    }

    if (filters.is_featured !== undefined) {
      paramCount++;
      whereClause += ` AND is_featured = $${paramCount}`;
      params.push(filters.is_featured);
    }

    const sql = `SELECT COUNT(*) as total FROM videos ${whereClause}`;
    const result = await query(sql, params);
    return parseInt(result.rows[0].total);
  }

  // Find video by ID
  static async findById(id) {
    const sql = `
      SELECT 
        v.*,
        a.name as athlete_name,
        a.position as athlete_position
      FROM videos v
      LEFT JOIN athletes a ON v.athlete_id = a.id
      WHERE v.id = $1
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Create new video
  static async create(videoData) {
    const {
      athlete_id,
      title,
      video_url,
      category = 'highlights',
      description,
      source = 'youtube',
      source_id,
      thumbnail,
      duration,
      is_featured = false
    } = videoData;

    const sql = `
      INSERT INTO videos (
        athlete_id, title, video_url, category, description, 
        source, source_id, thumbnail, duration, is_featured
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `;

    const params = [
      athlete_id, title, video_url, category, description,
      source, source_id, thumbnail, duration, is_featured
    ];

    const result = await query(sql, params);
    return result.rows[0];
  }

  // Update video
  static async update(id, videoData) {
    const updates = [];
    const params = [];
    let paramCount = 0;

    // Build dynamic update query
    const allowedFields = [
      'title', 'video_url', 'category', 'description', 'source',
      'source_id', 'thumbnail', 'duration', 'is_featured'
    ];

    for (const field of allowedFields) {
      if (videoData.hasOwnProperty(field)) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        params.push(videoData[field]);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    params.push(id);

    const sql = `
      UPDATE videos 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, params);
    return result.rows[0] || null;
  }

  // Delete video
  static async delete(id) {
    const sql = 'DELETE FROM videos WHERE id = $1 RETURNING id';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Increment view count
  static async incrementViews(id) {
    const sql = `
      UPDATE videos 
      SET views = views + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING views
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Get videos by category for an athlete
  static async findByAthleteAndCategory(athleteId, category) {
    const sql = `
      SELECT * FROM videos 
      WHERE athlete_id = $1 AND category = $2
      ORDER BY created_at DESC
    `;
    
    const result = await query(sql, [athleteId, category]);
    return result.rows;
  }

  // Get featured videos
  static async getFeatured(limit = 10) {
    const sql = `
      SELECT 
        v.*,
        a.name as athlete_name,
        a.position as athlete_position
      FROM videos v
      LEFT JOIN athletes a ON v.athlete_id = a.id
      WHERE v.is_featured = true
      ORDER BY v.created_at DESC
      LIMIT $1
    `;
    
    const result = await query(sql, [limit]);
    return result.rows;
  }

  // Get videos by athlete with categories grouped
  static async getByAthleteGrouped(athleteId) {
    const sql = `
      SELECT 
        category,
        COUNT(*) as count,
        json_agg(
          json_build_object(
            'id', id,
            'title', title,
            'video_url', video_url,
            'thumbnail', thumbnail,
            'duration', duration,
            'views', views,
            'created_at', created_at
          ) ORDER BY created_at DESC
        ) as videos
      FROM videos 
      WHERE athlete_id = $1
      GROUP BY category
      ORDER BY category
    `;
    
    const result = await query(sql, [athleteId]);
    return result.rows;
  }
}

export default Video;