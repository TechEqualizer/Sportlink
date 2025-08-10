// Sample game data to demonstrate the performance tracking and badge system
export const sampleGames = [
  {
    id: "game_1",
    date: "2024-08-01",
    opponent: "Central High Eagles",
    location: "Home",
    game_type: "Regular Season",
    season: "2024",
    team_score: 82,
    opponent_score: 78,
    notes: "Close game, great team effort in the fourth quarter"
  },
  {
    id: "game_2", 
    date: "2024-08-04",
    opponent: "West Valley Warriors",
    location: "Away",
    game_type: "Regular Season", 
    season: "2024",
    team_score: 95,
    opponent_score: 68,
    notes: "Dominant performance, excellent ball movement"
  },
  {
    id: "game_3",
    date: "2024-08-07",
    opponent: "North Side Panthers",
    location: "Home",
    game_type: "Regular Season",
    season: "2024", 
    team_score: 71,
    opponent_score: 73,
    notes: "Tough loss, need to work on free throw shooting"
  },
  {
    id: "game_4",
    date: "2024-08-10",
    opponent: "East Regional Rockets",
    location: "Neutral",
    game_type: "Tournament",
    season: "2024",
    team_score: 89,
    opponent_score: 85,
    notes: "Tournament opener - clutch performance in overtime"
  },
  {
    id: "game_5",
    date: "2024-08-12",
    opponent: "Metro High Mustangs", 
    location: "Away",
    game_type: "Regular Season",
    season: "2024",
    team_score: 76,
    opponent_score: 72,
    notes: "Good defensive effort, controlled the pace"
  }
];

export const samplePerformances = [
  // Game 1 - John Smith has a great all-around game
  {
    game_id: "game_1",
    athlete_id: "1", // John Smith
    minutes: 34,
    points: 22,
    rebounds: 8,
    assists: 11, // Gets Playmaker badge
    steals: 3,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 8,
    field_goals_attempted: 15,
    three_pointers_made: 2,
    three_pointers_attempted: 5,
    free_throws_made: 4,
    free_throws_attempted: 4,
    fouls: 2
  },
  // Game 1 - Sarah Johnson lights it up from three
  {
    game_id: "game_1", 
    athlete_id: "2", // Sarah Johnson
    minutes: 32,
    points: 31, // Scoring Machine Silver
    rebounds: 6,
    assists: 4,
    steals: 2,
    blocks: 0,
    turnovers: 3,
    field_goals_made: 10,
    field_goals_attempted: 18,
    three_pointers_made: 7, // Laser Shooter Gold
    three_pointers_attempted: 12,
    free_throws_made: 4,
    free_throws_attempted: 5,
    fouls: 1
  },
  // Game 1 - Mike Williams dominates the paint
  {
    game_id: "game_1",
    athlete_id: "3", // Mike Williams  
    minutes: 28,
    points: 16,
    rebounds: 14, // Glass Cleaner Bronze
    assists: 2,
    steals: 1,
    blocks: 4, // Shot Blocker Bronze
    turnovers: 1,
    field_goals_made: 7,
    field_goals_attempted: 10,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 4,
    fouls: 3
  },

  // Game 2 - John Smith gets a triple-double
  {
    game_id: "game_2",
    athlete_id: "1", // John Smith
    minutes: 36,
    points: 18,
    rebounds: 10, 
    assists: 12, // Triple-Double Master Bronze
    steals: 4,
    blocks: 1,
    turnovers: 1,
    field_goals_made: 7,
    field_goals_attempted: 12,
    three_pointers_made: 2,
    three_pointers_attempted: 4,
    free_throws_made: 2,
    free_throws_attempted: 2,
    fouls: 1
  },
  // Game 2 - Sarah Johnson efficient scoring
  {
    game_id: "game_2",
    athlete_id: "2", // Sarah Johnson
    minutes: 35,
    points: 27, // Efficient Scorer Bronze (27 pts on 60% shooting)
    rebounds: 5,
    assists: 6,
    steals: 3,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 10,
    field_goals_attempted: 15, // 66.7% shooting
    three_pointers_made: 4,
    three_pointers_attempted: 7,
    free_throws_made: 3,
    free_throws_attempted: 3,
    fouls: 2
  },
  // Game 2 - Mike Williams double-double
  {
    game_id: "game_2",
    athlete_id: "3", // Mike Williams
    minutes: 30,
    points: 20, // Double-Double King Bronze
    rebounds: 12,
    assists: 3,
    steals: 0,
    blocks: 3,
    turnovers: 2,
    field_goals_made: 9,
    field_goals_attempted: 13,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 6,
    fouls: 4
  },

  // Game 3 - Tough loss, but some good individual performances
  {
    game_id: "game_3",
    athlete_id: "1", // John Smith
    minutes: 38, // Iron Man Bronze
    points: 24,
    rebounds: 7,
    assists: 8,
    steals: 2,
    blocks: 0,
    turnovers: 4,
    field_goals_made: 9,
    field_goals_attempted: 19,
    three_pointers_made: 3,
    three_pointers_attempted: 8,
    free_throws_made: 3,
    free_throws_attempted: 6,
    fouls: 3
  },
  {
    game_id: "game_3",
    athlete_id: "2", // Sarah Johnson
    minutes: 33,
    points: 19,
    rebounds: 4,
    assists: 5,
    steals: 5, // Pickpocket Bronze
    blocks: 0,
    turnovers: 3,
    field_goals_made: 7,
    field_goals_attempted: 15,
    three_pointers_made: 3,
    three_pointers_attempted: 9,
    free_throws_made: 2,
    free_throws_attempted: 4,
    fouls: 2
  },
  {
    game_id: "game_3",
    athlete_id: "3", // Mike Williams
    minutes: 31,
    points: 12,
    rebounds: 11,
    assists: 1,
    steals: 1,
    blocks: 2,
    turnovers: 3,
    field_goals_made: 5,
    field_goals_attempted: 11,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 8,
    fouls: 5
  },

  // Game 4 - Tournament game with clutch performances
  {
    game_id: "game_4",
    athlete_id: "1", // John Smith - Clutch in close game
    minutes: 42, // Iron Man Silver
    points: 28, // Clutch Performer Bronze (28 pts in 4-point game)
    rebounds: 6,
    assists: 9,
    steals: 2,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 11,
    field_goals_attempted: 20,
    three_pointers_made: 4,
    three_pointers_attempted: 8,
    free_throws_made: 2,
    free_throws_attempted: 2,
    fouls: 2
  },
  {
    game_id: "game_4",
    athlete_id: "2", // Sarah Johnson - Perfect from the line
    minutes: 39,
    points: 26,
    rebounds: 8,
    assists: 4,
    steals: 1,
    blocks: 0,
    turnovers: 1,
    field_goals_made: 8,
    field_goals_attempted: 16,
    three_pointers_made: 2,
    three_pointers_attempted: 6,
    free_throws_made: 8, // Perfect Shooter Bronze
    free_throws_attempted: 8,
    fouls: 1
  },
  {
    game_id: "game_4",
    athlete_id: "3", // Mike Williams - Defensive wall
    minutes: 35,
    points: 14,
    rebounds: 13,
    assists: 2,
    steals: 3,
    blocks: 5, // Defensive Wall Bronze (8 combined steals/blocks)
    turnovers: 2,
    field_goals_made: 6,
    field_goals_attempted: 9,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 4,
    fouls: 3
  },

  // Game 5 - Recent strong performances
  {
    game_id: "game_5",
    athlete_id: "1", // John Smith
    minutes: 35,
    points: 21,
    rebounds: 5,
    assists: 13, // Playmaker Silver
    steals: 3,
    blocks: 0,
    turnovers: 3,
    field_goals_made: 8,
    field_goals_attempted: 14,
    three_pointers_made: 3,
    three_pointers_attempted: 6,
    free_throws_made: 2,
    free_throws_attempted: 2,
    fouls: 2
  },
  {
    game_id: "game_5",
    athlete_id: "2", // Sarah Johnson  
    minutes: 37,
    points: 23,
    rebounds: 7,
    assists: 3,
    steals: 4,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 9,
    field_goals_attempted: 17,
    three_pointers_made: 5, // Laser Shooter Silver
    three_pointers_attempted: 10,
    free_throws_made: 0,
    free_throws_attempted: 0,
    fouls: 1
  },
  {
    game_id: "game_5", 
    athlete_id: "3", // Mike Williams
    minutes: 29,
    points: 18,
    rebounds: 16, // Glass Cleaner Silver
    assists: 1,
    steals: 2,
    blocks: 3,
    turnovers: 1,
    field_goals_made: 8,
    field_goals_attempted: 12,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 3,
    fouls: 2
  }
];

// Function to load sample data into localStorage
export function loadSampleGameData() {
  // Load games
  const existingGames = JSON.parse(localStorage.getItem('mock_games') || '[]');
  const gameIds = existingGames.map(g => g.id);
  
  // Only add games that don't already exist
  const newGames = sampleGames.filter(game => !gameIds.includes(game.id));
  const updatedGames = [...existingGames, ...newGames];
  localStorage.setItem('mock_games', JSON.stringify(updatedGames));
  
  // Load performances
  const existingPerformances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
  const perfKeys = existingPerformances.map(p => `${p.game_id}_${p.athlete_id}`);
  
  // Only add performances that don't already exist
  const newPerformances = samplePerformances
    .filter(perf => !perfKeys.includes(`${perf.game_id}_${perf.athlete_id}`))
    .map((perf, index) => ({
      id: `perf_${Date.now()}_${index}`,
      ...perf,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    }));
  
  const updatedPerformances = [...existingPerformances, ...newPerformances];
  localStorage.setItem('mock_gamePerformances', JSON.stringify(updatedPerformances));
  
  console.log(`Loaded ${newGames.length} new games and ${newPerformances.length} new performances`);
  return { games: newGames.length, performances: newPerformances.length };
}

// Function to clear all game data (useful for testing)
export function clearGameData() {
  localStorage.removeItem('mock_games');
  localStorage.removeItem('mock_gamePerformances');
  console.log('Cleared all game data');
}