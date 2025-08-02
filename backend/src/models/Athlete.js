import { query } from '../config/database.js';

export class Athlete {
  
  // Get all athletes with optional sorting and filtering
  static async findAll(options = {}) {
    const { 
      sortBy = 'updated_at', 
      sortOrder = 'DESC', 
      limit = 100, 
      offset = 0,
      filters = {}
    } = options;

    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramCount = 0;

    // Apply filters
    if (filters.name) {
      paramCount++;
      whereClause += ` AND LOWER(name) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.name}%`);
    }

    if (filters.class_year) {
      paramCount++;
      whereClause += ` AND class_year = $${paramCount}`;
      params.push(filters.class_year);
    }

    if (filters.recruiting_status) {
      paramCount++;
      whereClause += ` AND recruiting_status = $${paramCount}`;
      params.push(filters.recruiting_status);
    }

    if (filters.sport_type) {
      paramCount++;
      whereClause += ` AND a.sport_type = $${paramCount}`;
      params.push(filters.sport_type);
    }

    if (filters.minGpa) {
      paramCount++;
      whereClause += ` AND gpa >= $${paramCount}`;
      params.push(parseFloat(filters.minGpa));
    }

    // Build query
    const validSortColumns = ['name', 'created_at', 'updated_at', 'class_year', 'gpa', 'recruiting_status'];
    const safeSort = validSortColumns.includes(sortBy) ? sortBy : 'updated_at';
    const safeOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    paramCount++;
    const limitParam = paramCount;
    paramCount++;
    const offsetParam = paramCount;
    
    const sql = `
      SELECT 
        a.*,
        t.name as team_name,
        (SELECT COUNT(*) FROM videos v WHERE v.athlete_id = a.id) as video_count
      FROM athletes a
      LEFT JOIN teams t ON a.team_id = t.id
      ${whereClause}
      ORDER BY a.${safeSort} ${safeOrder}
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
    if (filters.name) {
      paramCount++;
      whereClause += ` AND LOWER(name) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.name}%`);
    }

    if (filters.class_year) {
      paramCount++;
      whereClause += ` AND class_year = $${paramCount}`;
      params.push(filters.class_year);
    }

    if (filters.recruiting_status) {
      paramCount++;
      whereClause += ` AND recruiting_status = $${paramCount}`;
      params.push(filters.recruiting_status);
    }

    if (filters.sport_type) {
      paramCount++;
      whereClause += ` AND a.sport_type = $${paramCount}`;
      params.push(filters.sport_type);
    }

    if (filters.minGpa) {
      paramCount++;
      whereClause += ` AND gpa >= $${paramCount}`;
      params.push(parseFloat(filters.minGpa));
    }

    const sql = `SELECT COUNT(*) as total FROM athletes ${whereClause}`;
    const result = await query(sql, params);
    return parseInt(result.rows[0].total);
  }

  // Find athlete by ID
  static async findById(id) {
    const sql = `
      SELECT 
        a.*,
        t.name as team_name,
        (SELECT COUNT(*) FROM videos v WHERE v.athlete_id = a.id) as video_count
      FROM athletes a
      LEFT JOIN teams t ON a.team_id = t.id
      WHERE a.id = $1
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Create new athlete
  static async create(athleteData) {
    const {
      name,
      email,
      phone,
      position,
      jersey_number,
      class_year,
      school_level = 'High School',
      sport_type = 'Basketball',
      height,
      weight,
      hometown,
      high_school,
      recruiting_status = 'Open',
      gpa,
      act_score,
      sat_score,
      profile_image,
      bio,
      team_id
    } = athleteData;

    const sql = `
      INSERT INTO athletes (
        name, email, phone, position, jersey_number, class_year, 
        school_level, sport_type, height, weight, hometown, high_school,
        recruiting_status, gpa, act_score, sat_score, profile_image, bio, team_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *
    `;

    const params = [
      name, email, phone, position, jersey_number, class_year,
      school_level, sport_type, height, weight, hometown, high_school,
      recruiting_status, gpa, act_score, sat_score, profile_image, bio, team_id
    ];

    const result = await query(sql, params);
    return result.rows[0];
  }

  // Update athlete
  static async update(id, athleteData) {
    const updates = [];
    const params = [];
    let paramCount = 0;

    // Build dynamic update query
    const allowedFields = [
      'name', 'email', 'phone', 'position', 'jersey_number', 'class_year',
      'school_level', 'sport_type', 'height', 'weight', 'hometown', 'high_school',
      'recruiting_status', 'gpa', 'act_score', 'sat_score', 'profile_image', 'bio', 'team_id'
    ];

    for (const field of allowedFields) {
      if (athleteData.hasOwnProperty(field)) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        params.push(athleteData[field]);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    params.push(id);

    const sql = `
      UPDATE athletes 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, params);
    return result.rows[0] || null;
  }

  // Delete athlete
  static async delete(id) {
    const sql = 'DELETE FROM athletes WHERE id = $1 RETURNING id';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Get athlete statistics
  static async getStatistics(id) {
    const sql = `
      SELECT * FROM statistics 
      WHERE athlete_id = $1 
      ORDER BY season DESC
    `;
    
    const result = await query(sql, [id]);
    return result.rows;
  }

  // Get athlete videos
  static async getVideos(id, category = null) {
    let sql = `
      SELECT * FROM videos 
      WHERE athlete_id = $1
    `;
    
    const params = [id];
    
    if (category) {
      sql += ' AND category = $2';
      params.push(category);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    return result.rows;
  }
}

export default Athlete;