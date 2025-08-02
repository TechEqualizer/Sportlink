import { query } from '../src/config/database.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (in reverse order due to foreign keys)
    await query('DELETE FROM statistics');
    await query('DELETE FROM videos');
    await query('DELETE FROM athletes');
    await query('DELETE FROM teams');
    await query('DELETE FROM users');
    
    // Reset sequences
    await query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE teams_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE athletes_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE videos_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE statistics_id_seq RESTART WITH 1');

    // Seed teams
    const teams = [
      {
        name: 'Lincoln High Eagles',
        sport_type: 'Basketball',
        school_level: 'High School',
        location: 'Chicago, IL',
        coach_name: 'Coach Johnson',
        coach_email: 'coach.johnson@lincoln.edu',
        season: '2023-24'
      },
      {
        name: 'Oak Park Warriors',
        sport_type: 'Basketball', 
        school_level: 'High School',
        location: 'Oak Park, IL',
        coach_name: 'Coach Davis',
        coach_email: 'coach.davis@oakpark.edu',
        season: '2023-24'
      }
    ];

    for (const team of teams) {
      await query(`
        INSERT INTO teams (name, sport_type, school_level, location, coach_name, coach_email, season)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [team.name, team.sport_type, team.school_level, team.location, team.coach_name, team.coach_email, team.season]);
    }

    // Seed athletes
    const athletes = [
      {
        name: 'Marcus Johnson',
        email: 'marcus.johnson@example.com',
        phone: '(555) 123-4567',
        position: 'Point Guard',
        jersey_number: '1',
        class_year: 'Senior',
        school_level: 'High School',
        sport_type: 'Basketball',
        height: '6\'2"',
        weight: '180 lbs',
        hometown: 'Chicago, IL',
        high_school: 'Lincoln High School',
        recruiting_status: 'Open',
        gpa: 3.8,
        act_score: 28,
        sat_score: 1320,
        bio: 'Dynamic point guard with excellent court vision and leadership skills.',
        team_id: 1
      },
      {
        name: 'Tyler Washington',
        email: 'tyler.washington@example.com',
        phone: '(555) 234-5678',
        position: 'Shooting Guard',
        jersey_number: '23',
        class_year: 'Junior',
        school_level: 'High School',
        sport_type: 'Basketball',
        height: '6\'4"',
        weight: '195 lbs',
        hometown: 'Evanston, IL',
        high_school: 'Lincoln High School',
        recruiting_status: 'Verbal',
        gpa: 3.6,
        act_score: 26,
        sat_score: 1280,
        bio: 'Excellent shooter with great defensive instincts.',
        team_id: 1
      },
      {
        name: 'Jordan Davis',
        email: 'jordan.davis@example.com',
        phone: '(555) 345-6789',
        position: 'Power Forward',
        jersey_number: '32',
        class_year: 'Senior',
        school_level: 'High School',
        sport_type: 'Basketball',
        height: '6\'8"',
        weight: '220 lbs',
        hometown: 'Oak Park, IL',
        high_school: 'Oak Park High School',
        recruiting_status: 'Committed',
        gpa: 3.9,
        act_score: 30,
        sat_score: 1420,
        bio: 'Dominant inside presence with developing outside shot.',
        team_id: 2
      },
      {
        name: 'Alex Thompson',
        email: 'alex.thompson@example.com',
        phone: '(555) 456-7890',
        position: 'Small Forward',
        jersey_number: '15',
        class_year: 'Sophomore',
        school_level: 'High School',
        sport_type: 'Basketball',
        height: '6\'6"',
        weight: '205 lbs',
        hometown: 'Naperville, IL',
        high_school: 'Oak Park High School',
        recruiting_status: 'Open',
        gpa: 3.7,
        bio: 'Versatile player with excellent athleticism and potential.',
        team_id: 2
      }
    ];

    for (const athlete of athletes) {
      await query(`
        INSERT INTO athletes (
          name, email, phone, position, jersey_number, class_year, school_level,
          sport_type, height, weight, hometown, high_school, recruiting_status,
          gpa, act_score, sat_score, bio, team_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
      `, [
        athlete.name, athlete.email, athlete.phone, athlete.position, athlete.jersey_number,
        athlete.class_year, athlete.school_level, athlete.sport_type, athlete.height,
        athlete.weight, athlete.hometown, athlete.high_school, athlete.recruiting_status,
        athlete.gpa, athlete.act_score, athlete.sat_score, athlete.bio, athlete.team_id
      ]);
    }

    // Seed videos
    const videos = [
      {
        athlete_id: 1,
        title: 'Marcus Johnson - Senior Year Highlights',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'highlights',
        description: 'Best plays from senior season',
        source: 'youtube',
        source_id: 'dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '3:45',
        views: 127,
        is_featured: true
      },
      {
        athlete_id: 1,
        title: 'Marcus Johnson vs Oak Park - Full Game',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'gamefilm',
        description: 'Complete game footage against Oak Park',
        source: 'youtube',
        source_id: 'dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '15:30',
        views: 89
      },
      {
        athlete_id: 2,
        title: 'Tyler Washington - Shooting Showcase',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'highlights',
        description: 'Best shots and scoring plays',
        source: 'youtube',
        source_id: 'dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '2:15',
        views: 156
      },
      {
        athlete_id: 3,
        title: 'Jordan Davis - Recruit Interview',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'interviews',
        description: 'Post-game interview and recruiting discussion',
        source: 'youtube',
        source_id: 'dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '5:20',
        views: 78
      }
    ];

    for (const video of videos) {
      await query(`
        INSERT INTO videos (
          athlete_id, title, video_url, category, description, source,
          source_id, thumbnail, duration, views, is_featured
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
      `, [
        video.athlete_id, video.title, video.video_url, video.category,
        video.description, video.source, video.source_id, video.thumbnail,
        video.duration, video.views, video.is_featured || false
      ]);
    }

    // Seed statistics
    const statistics = [
      {
        athlete_id: 1,
        season: '2023-24',
        games_played: 25,
        points_per_game: 18.5,
        rebounds_per_game: 5.2,
        assists_per_game: 8.1,
        steals_per_game: 2.3,
        blocks_per_game: 0.4,
        field_goal_percentage: 45.2,
        three_point_percentage: 38.5,
        free_throw_percentage: 82.1
      },
      {
        athlete_id: 2,
        season: '2023-24',
        games_played: 23,
        points_per_game: 22.3,
        rebounds_per_game: 4.8,
        assists_per_game: 3.2,
        steals_per_game: 1.8,
        blocks_per_game: 0.6,
        field_goal_percentage: 48.7,
        three_point_percentage: 42.1,
        free_throw_percentage: 85.3
      },
      {
        athlete_id: 3,
        season: '2023-24',
        games_played: 26,
        points_per_game: 16.8,
        rebounds_per_game: 11.2,
        assists_per_game: 2.1,
        steals_per_game: 1.2,
        blocks_per_game: 2.8,
        field_goal_percentage: 52.3,
        three_point_percentage: 28.5,
        free_throw_percentage: 68.9
      }
    ];

    for (const stat of statistics) {
      await query(`
        INSERT INTO statistics (
          athlete_id, season, games_played, points_per_game, rebounds_per_game,
          assists_per_game, steals_per_game, blocks_per_game, field_goal_percentage,
          three_point_percentage, free_throw_percentage
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
      `, [
        stat.athlete_id, stat.season, stat.games_played, stat.points_per_game,
        stat.rebounds_per_game, stat.assists_per_game, stat.steals_per_game,
        stat.blocks_per_game, stat.field_goal_percentage, stat.three_point_percentage,
        stat.free_throw_percentage
      ]);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Sample data created:');
    console.log('   - 2 teams');
    console.log('   - 4 athletes');
    console.log('   - 4 videos');
    console.log('   - 3 statistical records');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedDatabase;