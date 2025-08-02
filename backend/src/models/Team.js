import { query } from '../config/database.js';

export class Team {
  
  // Get all teams
  static async findAll() {
    const sql = `
      SELECT 
        t.*,
        COUNT(a.id) as athlete_count
      FROM teams t
      LEFT JOIN athletes a ON t.id = a.team_id
      GROUP BY t.id
      ORDER BY t.name
    `;
    
    const result = await query(sql);
    return result.rows;
  }

  // Find team by ID
  static async findById(id) {
    const sql = `
      SELECT 
        t.*,
        COUNT(a.id) as athlete_count
      FROM teams t
      LEFT JOIN athletes a ON t.id = a.team_id
      WHERE t.id = $1
      GROUP BY t.id
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Create new team
  static async create(teamData) {
    const {
      name,
      sport_type = 'Basketball',
      school_level = 'High School',
      location,
      coach_name,
      coach_email,
      season
    } = teamData;

    const sql = `
      INSERT INTO teams (
        name, sport_type, school_level, location, coach_name, coach_email, season
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *
    `;

    const params = [name, sport_type, school_level, location, coach_name, coach_email, season];
    const result = await query(sql, params);
    return result.rows[0];
  }

  // Update team
  static async update(id, teamData) {
    const updates = [];
    const params = [];
    let paramCount = 0;

    const allowedFields = ['name', 'sport_type', 'school_level', 'location', 'coach_name', 'coach_email', 'season'];

    for (const field of allowedFields) {
      if (teamData.hasOwnProperty(field)) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        params.push(teamData[field]);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    params.push(id);

    const sql = `
      UPDATE teams 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, params);
    return result.rows[0] || null;
  }

  // Delete team
  static async delete(id) {
    const sql = 'DELETE FROM teams WHERE id = $1 RETURNING id';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Get team athletes
  static async getAthletes(id) {
    const sql = `
      SELECT * FROM athletes 
      WHERE team_id = $1 
      ORDER BY name
    `;
    
    const result = await query(sql, [id]);
    return result.rows;
  }
}

export default Team;