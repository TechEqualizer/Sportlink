import { query } from '../src/config/database.js';

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'coach',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create teams table
    await query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sport_type VARCHAR(100) DEFAULT 'Basketball',
        school_level VARCHAR(100) DEFAULT 'High School',
        location VARCHAR(255),
        coach_name VARCHAR(255),
        coach_email VARCHAR(255),
        season VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create athletes table
    await query(`
      CREATE TABLE IF NOT EXISTS athletes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        position VARCHAR(100),
        jersey_number VARCHAR(10),
        class_year VARCHAR(50),
        school_level VARCHAR(100) DEFAULT 'High School',
        sport_type VARCHAR(100) DEFAULT 'Basketball',
        height VARCHAR(20),
        weight VARCHAR(20),
        hometown VARCHAR(255),
        high_school VARCHAR(255),
        recruiting_status VARCHAR(50) DEFAULT 'Open',
        gpa DECIMAL(3,2),
        act_score INTEGER,
        sat_score INTEGER,
        profile_image VARCHAR(500),
        bio TEXT,
        team_id INTEGER REFERENCES teams(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create videos table
    await query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        video_url VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT 'highlights',
        description TEXT,
        source VARCHAR(100) DEFAULT 'youtube',
        source_id VARCHAR(255),
        thumbnail VARCHAR(500),
        duration VARCHAR(20),
        views INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create statistics table
    await query(`
      CREATE TABLE IF NOT EXISTS statistics (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
        season VARCHAR(50),
        games_played INTEGER DEFAULT 0,
        points_per_game DECIMAL(5,2) DEFAULT 0,
        rebounds_per_game DECIMAL(5,2) DEFAULT 0,
        assists_per_game DECIMAL(5,2) DEFAULT 0,
        steals_per_game DECIMAL(5,2) DEFAULT 0,
        blocks_per_game DECIMAL(5,2) DEFAULT 0,
        field_goal_percentage DECIMAL(5,2) DEFAULT 0,
        three_point_percentage DECIMAL(5,2) DEFAULT 0,
        free_throw_percentage DECIMAL(5,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_athletes_team_id ON athletes(team_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_videos_athlete_id ON videos(athlete_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_statistics_athlete_id ON statistics(athlete_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_athletes_sport_type ON athletes(sport_type)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_athletes_class_year ON athletes(class_year)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_athletes_recruiting_status ON athletes(recruiting_status)`);

    // Create triggers for updated_at timestamps
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Apply triggers to all tables
    const tables = ['users', 'teams', 'athletes', 'videos', 'statistics'];
    for (const table of tables) {
      await query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at
          BEFORE UPDATE ON ${table}
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    console.log('✅ Database migration completed successfully!');
    console.log('📋 Tables created:');
    console.log('   - users');
    console.log('   - teams');
    console.log('   - athletes');
    console.log('   - videos');
    console.log('   - statistics');
    console.log('🔍 Indexes and triggers created for optimal performance');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTables()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default createTables;