// Comprehensive mock data for performance analytics
export const mockPlayerAnalytics = {
  "1": { // John Smith
    benchmarkProgress: {
      points: {
        target: 18.0,
        current: 19.2,
        hitRate: 80, // 4 out of 5 games hit target
        trend: 8.5, // +8.5% improvement
        lastFiveGames: [
          { date: "2024-01-20", actual: 22, target: 18, hit: true, opponent: "West High" },
          { date: "2024-01-18", actual: 19, target: 18, hit: true, opponent: "East Valley" },
          { date: "2024-01-15", actual: 24, target: 18, hit: true, opponent: "North Central" },
          { date: "2024-01-12", actual: 15, target: 18, hit: false, opponent: "South Regional" },
          { date: "2024-01-10", actual: 21, target: 18, hit: true, opponent: "Mountain View" }
        ]
      },
      assists: {
        target: 7.5,
        current: 8.2,
        hitRate: 100,
        trend: 12.3,
        lastFiveGames: [
          { date: "2024-01-20", actual: 9, target: 7.5, hit: true, opponent: "West High" },
          { date: "2024-01-18", actual: 8, target: 7.5, hit: true, opponent: "East Valley" },
          { date: "2024-01-15", actual: 8, target: 7.5, hit: true, opponent: "North Central" },
          { date: "2024-01-12", actual: 11, target: 7.5, hit: true, opponent: "South Regional" },
          { date: "2024-01-10", actual: 7, target: 7.5, hit: false, opponent: "Mountain View" }
        ]
      },
      rebounds: {
        target: 5.5,
        current: 5.8,
        hitRate: 60,
        trend: 5.4,
        lastFiveGames: [
          { date: "2024-01-20", actual: 5, target: 5.5, hit: false, opponent: "West High" },
          { date: "2024-01-18", actual: 6, target: 5.5, hit: true, opponent: "East Valley" },
          { date: "2024-01-15", actual: 6, target: 5.5, hit: true, opponent: "North Central" },
          { date: "2024-01-12", actual: 4, target: 5.5, hit: false, opponent: "South Regional" },
          { date: "2024-01-10", actual: 8, target: 5.5, hit: true, opponent: "Mountain View" }
        ]
      }
    },
    badgeStats: {
      totalBadges: 8,
      byTier: { bronze: 3, silver: 3, gold: 1, platinum: 1 },
      currentStreak: 2, // Games with badges
      bestStreak: 4,
      recentBadges: [
        {
          date: "2024-01-20",
          opponent: "West High",
          badges: [
            { name: "Playmaker", level: "silver", icon: "🎪" },
            { name: "Iron Man", level: "bronze", icon: "🦾" }
          ]
        },
        {
          date: "2024-01-15",
          opponent: "North Central", 
          badges: [
            { name: "Triple-Double Master", level: "bronze", icon: "💎" }
          ]
        }
      ],
      favoriteCategory: "playmaking",
      rarestBadge: { name: "Triple-Double Master", level: "bronze", count: 1 }
    },
    recruitingProfile: {
      collegeReadiness: 85,
      strengths: ["Court Vision", "Leadership", "Basketball IQ", "Clutch Performance"],
      improvements: ["Shooting Consistency", "Defensive Rebounding"],
      programFit: [
        { school: "Duke", fit: 92, reason: "Elite point guard program" },
        { school: "UNC", fit: 88, reason: "Strong academic-athletic balance" },
        { school: "Michigan", fit: 85, reason: "Development-focused coaching" }
      ]
    }
  },
  
  "2": { // Sarah Johnson
    benchmarkProgress: {
      points: {
        target: 22.5,
        current: 24.8,
        hitRate: 100,
        trend: 15.2,
        lastFiveGames: [
          { date: "2024-01-20", actual: 31, target: 22.5, hit: true, opponent: "West High" },
          { date: "2024-01-18", actual: 26, target: 22.5, hit: true, opponent: "East Valley" },
          { date: "2024-01-15", actual: 29, target: 22.5, hit: true, opponent: "North Central" },
          { date: "2024-01-12", actual: 18, target: 22.5, hit: false, opponent: "South Regional" },
          { date: "2024-01-10", actual: 22, target: 22.5, hit: false, opponent: "Mountain View" }
        ]
      },
      three_pointers_made: {
        target: 4.5,
        current: 5.2,
        hitRate: 80,
        trend: 18.9,
        lastFiveGames: [
          { date: "2024-01-20", actual: 7, target: 4.5, hit: true, opponent: "West High" },
          { date: "2024-01-18", actual: 4, target: 4.5, hit: false, opponent: "East Valley" },
          { date: "2024-01-15", actual: 6, target: 4.5, hit: true, opponent: "North Central" },
          { date: "2024-01-12", actual: 3, target: 4.5, hit: false, opponent: "South Regional" },
          { date: "2024-01-10", actual: 5, target: 4.5, hit: true, opponent: "Mountain View" }
        ]
      }
    },
    badgeStats: {
      totalBadges: 7,
      byTier: { bronze: 2, silver: 3, gold: 2, platinum: 0 },
      currentStreak: 4,
      bestStreak: 4,
      recentBadges: [
        {
          date: "2024-01-20",
          opponent: "West High",
          badges: [
            { name: "Scoring Machine", level: "silver", icon: "🔥" },
            { name: "Laser Shooter", level: "gold", icon: "🎯" }
          ]
        },
        {
          date: "2024-01-18",
          opponent: "East Valley",
          badges: [
            { name: "Efficient Scorer", level: "bronze", icon: "⚡" }
          ]
        }
      ],
      favoriteCategory: "scoring",
      rarestBadge: { name: "Laser Shooter", level: "gold", count: 2 }
    },
    recruitingProfile: {
      collegeReadiness: 92,
      strengths: ["Elite Shooting", "Scoring Ability", "Mental Toughness", "Clutch Gene"],
      improvements: ["Defensive Rebounding", "Ball Handling Under Pressure"],
      programFit: [
        { school: "Stanford", fit: 95, reason: "Academic excellence + shooting" },
        { school: "UCLA", fit: 90, reason: "Offensive system fit" },
        { school: "Gonzaga", fit: 88, reason: "Proven shooter development" }
      ]
    }
  },
  
  "3": { // Mike Williams
    benchmarkProgress: {
      rebounds: {
        target: 11.5,
        current: 12.8,
        hitRate: 80,
        trend: 11.3,
        lastFiveGames: [
          { date: "2024-01-20", actual: 12, target: 11.5, hit: true, opponent: "West High" },
          { date: "2024-01-18", actual: 9, target: 11.5, hit: false, opponent: "East Valley" },
          { date: "2024-01-15", actual: 14, target: 11.5, hit: true, opponent: "North Central" },
          { date: "2024-01-12", actual: 8, target: 11.5, hit: false, opponent: "South Regional" },
          { date: "2024-01-10", actual: 16, target: 11.5, hit: true, opponent: "Mountain View" }
        ]
      },
      blocks: {
        target: 2.5,
        current: 3.2,
        hitRate: 80,
        trend: 28.0,
        lastFiveGames: [
          { date: "2024-01-20", actual: 4, target: 2.5, hit: true, opponent: "West High" },
          { date: "2024-01-18", actual: 3, target: 2.5, hit: true, opponent: "East Valley" },
          { date: "2024-01-15", actual: 5, target: 2.5, hit: true, opponent: "North Central" },
          { date: "2024-01-12", actual: 2, target: 2.5, hit: false, opponent: "South Regional" },
          { date: "2024-01-10", actual: 3, target: 2.5, hit: true, opponent: "Mountain View" }
        ]
      }
    },
    badgeStats: {
      totalBadges: 6,
      byTier: { bronze: 3, silver: 2, gold: 1, platinum: 0 },
      currentStreak: 3,
      bestStreak: 3,
      recentBadges: [
        {
          date: "2024-01-20",
          opponent: "West High",
          badges: [
            { name: "Glass Cleaner", level: "bronze", icon: "🧹" },
            { name: "Shot Blocker", level: "bronze", icon: "🚫" }
          ]
        },
        {
          date: "2024-01-15",
          opponent: "North Central",
          badges: [
            { name: "Glass Cleaner", level: "silver", icon: "🧹" },
            { name: "Defensive Wall", level: "bronze", icon: "🛡️" }
          ]
        }
      ],
      favoriteCategory: "defense",
      rarestBadge: { name: "Double-Double King", level: "gold", count: 1 }
    },
    recruitingProfile: {
      collegeReadiness: 78,
      strengths: ["Paint Presence", "Shot Blocking", "Rebounding", "Developing Offense"],
      improvements: ["Free Throw Shooting", "Perimeter Defense", "Ball Handling"],
      programFit: [
        { school: "Texas", fit: 87, reason: "Strong big man development" },
        { school: "Baylor", fit: 84, reason: "Physical style of play" },
        { school: "Houston", fit: 82, reason: "Defensive emphasis" }
      ]
    }
  }
};

// Team-wide performance metrics
export const mockTeamMetrics = {
  overallRecord: { wins: 18, losses: 6 },
  conferenceRecord: { wins: 12, losses: 2 },
  homeRecord: { wins: 10, losses: 2 },
  awayRecord: { wins: 8, losses: 4 },
  
  monthlyProgress: [
    { month: "Sep", wins: 3, losses: 1, ppg: 72.5, papg: 68.2 },
    { month: "Oct", wins: 4, losses: 1, ppg: 75.8, papg: 65.4 },
    { month: "Nov", wins: 5, losses: 2, ppg: 78.2, papg: 67.1 },
    { month: "Dec", wins: 4, losses: 1, ppg: 81.4, papg: 64.8 },
    { month: "Jan", wins: 2, losses: 1, ppg: 83.7, papg: 66.3 }
  ],
  
  performanceByType: {
    "Regular Season": { wins: 15, losses: 5, ppg: 78.5 },
    "Tournament": { wins: 2, losses: 1, ppg: 82.3 },
    "Exhibition": { wins: 1, losses: 0, ppg: 75.0 }
  },
  
  teamBadges: {
    totalEarned: 45,
    byCategory: {
      scoring: 15,
      playmaking: 12,
      rebounding: 8,
      defense: 7,
      efficiency: 3
    },
    topPerformers: [
      { playerId: "2", playerName: "Sarah Johnson", badges: 7 },
      { playerId: "1", playerName: "John Smith", badges: 8 },
      { playerId: "3", playerName: "Mike Williams", badges: 6 }
    ]
  },
  
  strengthsWeaknesses: {
    strengths: [
      { area: "Three-Point Shooting", value: "38.2%", rank: "Top 10% in state" },
      { area: "Ball Movement", value: "18.2 APG", rank: "2nd in conference" },
      { area: "Defensive Rebounding", value: "28.4 RPG", rank: "1st in conference" },
      { area: "Free Throw Shooting", value: "78.2%", rank: "Above average" }
    ],
    weaknesses: [
      { area: "Turnovers", value: "14.2 TPG", rank: "Bottom 25% in conference" },
      { area: "Bench Scoring", value: "12.4 PPG", rank: "Below conference average" },
      { area: "Offensive Rebounding", value: "8.1 RPG", rank: "Middle of conference" }
    ]
  }
};

// Individual game performances with badge calculations
export const mockGamePerformances = [
  // Game 1: vs West High (W 82-78)
  {
    id: "perf_1_1",
    game_id: "game_1",
    athlete_id: "1",
    date: "2024-01-20",
    opponent: "West High",
    minutes: 34,
    points: 22,
    rebounds: 5,
    assists: 9,
    steals: 3,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 8,
    field_goals_attempted: 15,
    three_pointers_made: 2,
    three_pointers_attempted: 5,
    free_throws_made: 4,
    free_throws_attempted: 4,
    fouls: 2,
    plus_minus: 8,
    badges: [
      { name: "Playmaker", level: "bronze", icon: "🎪" },
      { name: "Iron Man", level: "bronze", icon: "🦾" }
    ]
  },
  {
    id: "perf_1_2", 
    game_id: "game_1",
    athlete_id: "2",
    date: "2024-01-20",
    opponent: "West High",
    minutes: 32,
    points: 31,
    rebounds: 6,
    assists: 4,
    steals: 2,
    blocks: 0,
    turnovers: 3,
    field_goals_made: 10,
    field_goals_attempted: 18,
    three_pointers_made: 7,
    three_pointers_attempted: 12,
    free_throws_made: 4,
    free_throws_attempted: 5,
    fouls: 1,
    plus_minus: 12,
    badges: [
      { name: "Scoring Machine", level: "silver", icon: "🔥" },
      { name: "Laser Shooter", level: "gold", icon: "🎯" }
    ]
  },
  {
    id: "perf_1_3",
    game_id: "game_1", 
    athlete_id: "3",
    date: "2024-01-20",
    opponent: "West High",
    minutes: 28,
    points: 16,
    rebounds: 12,
    assists: 2,
    steals: 1,
    blocks: 4,
    turnovers: 1,
    field_goals_made: 7,
    field_goals_attempted: 10,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 4,
    fouls: 3,
    plus_minus: 6,
    badges: [
      { name: "Glass Cleaner", level: "bronze", icon: "🧹" },
      { name: "Shot Blocker", level: "bronze", icon: "🚫" }
    ]
  },

  // Game 2: vs East Valley (W 95-68)
  {
    id: "perf_2_1",
    game_id: "game_2",
    athlete_id: "1",
    date: "2024-01-18",
    opponent: "East Valley",
    minutes: 36,
    points: 19,
    rebounds: 6,
    assists: 8,
    steals: 4,
    blocks: 1,
    turnovers: 1,
    field_goals_made: 7,
    field_goals_attempted: 12,
    three_pointers_made: 3,
    three_pointers_attempted: 6,
    free_throws_made: 2,
    free_throws_attempted: 2,
    fouls: 1,
    plus_minus: 15,
    badges: [
      { name: "Efficient Scorer", level: "bronze", icon: "⚡" },
      { name: "Pickpocket", level: "bronze", icon: "🥷" }
    ]
  },
  {
    id: "perf_2_2",
    game_id: "game_2",
    athlete_id: "2", 
    date: "2024-01-18",
    opponent: "East Valley",
    minutes: 35,
    points: 26,
    rebounds: 4,
    assists: 6,
    steals: 3,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 10,
    field_goals_attempted: 15,
    three_pointers_made: 4,
    three_pointers_attempted: 7,
    free_throws_made: 2,
    free_throws_attempted: 3,
    fouls: 2,
    plus_minus: 18,
    badges: [
      { name: "Efficient Scorer", level: "bronze", icon: "⚡" },
      { name: "Laser Shooter", level: "silver", icon: "🎯" }
    ]
  },
  {
    id: "perf_2_3",
    game_id: "game_2",
    athlete_id: "3",
    date: "2024-01-18", 
    opponent: "East Valley",
    minutes: 30,
    points: 20,
    rebounds: 9,
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
    fouls: 4,
    plus_minus: 10,
    badges: [
      { name: "Double-Double King", level: "bronze", icon: "👑" }
    ]
  },

  // Game 3: vs North Central (W 91-77)
  {
    id: "perf_3_1",
    game_id: "game_3",
    athlete_id: "1",
    date: "2024-01-15",
    opponent: "North Central",
    minutes: 38,
    points: 24,
    rebounds: 6,
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
    fouls: 3,
    plus_minus: 11,
    badges: [
      { name: "Iron Man", level: "silver", icon: "🦾" }
    ]
  },
  {
    id: "perf_3_2",
    game_id: "game_3",
    athlete_id: "2",
    date: "2024-01-15",
    opponent: "North Central", 
    minutes: 33,
    points: 29,
    rebounds: 7,
    assists: 5,
    steals: 5,
    blocks: 0,
    turnovers: 3,
    field_goals_made: 11,
    field_goals_attempted: 18,
    three_pointers_made: 6,
    three_pointers_attempted: 10,
    free_throws_made: 1,
    free_throws_attempted: 2,
    fouls: 2,
    plus_minus: 14,
    badges: [
      { name: "Scoring Machine", level: "silver", icon: "🔥" },
      { name: "Laser Shooter", level: "silver", icon: "🎯" },
      { name: "Pickpocket", level: "bronze", icon: "🥷" }
    ]
  },
  {
    id: "perf_3_3",
    game_id: "game_3",
    athlete_id: "3",
    date: "2024-01-15",
    opponent: "North Central",
    minutes: 31,
    points: 18,
    rebounds: 14,
    assists: 1,
    steals: 1,
    blocks: 5,
    turnovers: 3,
    field_goals_made: 8,
    field_goals_attempted: 12,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 4,
    fouls: 5,
    plus_minus: 9,
    badges: [
      { name: "Glass Cleaner", level: "silver", icon: "🧹" },
      { name: "Shot Blocker", level: "silver", icon: "🚫" },
      { name: "Defensive Wall", level: "bronze", icon: "🛡️" }
    ]
  },

  // Game 4: vs South Regional (L 69-72)
  {
    id: "perf_4_1",
    game_id: "game_4",
    athlete_id: "1",
    date: "2024-01-12",
    opponent: "South Regional",
    minutes: 42,
    points: 15,
    rebounds: 4,
    assists: 11,
    steals: 2,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 5,
    field_goals_attempted: 14,
    three_pointers_made: 1,
    three_pointers_attempted: 6,
    free_throws_made: 4,
    free_throws_attempted: 4,
    fouls: 2,
    plus_minus: -2,
    badges: [
      { name: "Playmaker", level: "silver", icon: "🎪" },
      { name: "Iron Man", level: "silver", icon: "🦾" }
    ]
  },
  {
    id: "perf_4_2",
    game_id: "game_4",
    athlete_id: "2",
    date: "2024-01-12",
    opponent: "South Regional",
    minutes: 39,
    points: 18,
    rebounds: 5,
    assists: 5,
    steals: 2,
    blocks: 0,
    turnovers: 1,
    field_goals_made: 6,
    field_goals_attempted: 16,
    three_pointers_made: 3,
    three_pointers_attempted: 9,
    free_throws_made: 3,
    free_throws_attempted: 3,
    fouls: 1,
    plus_minus: -1,
    badges: []
  },
  {
    id: "perf_4_3",
    game_id: "game_4",
    athlete_id: "3",
    date: "2024-01-12",
    opponent: "South Regional",
    minutes: 35,
    points: 10,
    rebounds: 8,
    assists: 0,
    steals: 3,
    blocks: 2,
    turnovers: 2,
    field_goals_made: 4,
    field_goals_attempted: 11,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 8,
    fouls: 5,
    plus_minus: -4,
    badges: []
  },

  // Game 5: vs Mountain View (W 85-78)
  {
    id: "perf_5_1",
    game_id: "game_5",
    athlete_id: "1",
    date: "2024-01-10",
    opponent: "Mountain View",
    minutes: 35,
    points: 21,
    rebounds: 8,
    assists: 7,
    steals: 3,
    blocks: 0,
    turnovers: 3,
    field_goals_made: 8,
    field_goals_attempted: 14,
    three_pointers_made: 3,
    three_pointers_attempted: 6,
    free_throws_made: 2,
    free_throws_attempted: 2,
    fouls: 2,
    plus_minus: 7,
    badges: [
      { name: "Scoring Machine", level: "bronze", icon: "🔥" }
    ]
  },
  {
    id: "perf_5_2",
    game_id: "game_5",
    athlete_id: "2",
    date: "2024-01-10",
    opponent: "Mountain View",
    minutes: 37,
    points: 22,
    rebounds: 4,
    assists: 3,
    steals: 4,
    blocks: 1,
    turnovers: 2,
    field_goals_made: 8,
    field_goals_attempted: 17,
    three_pointers_made: 5,
    three_pointers_attempted: 10,
    free_throws_made: 1,
    free_throws_attempted: 1,
    fouls: 1,
    plus_minus: 9,
    badges: [
      { name: "Laser Shooter", level: "silver", icon: "🎯" },
      { name: "Pickpocket", level: "bronze", icon: "🥷" }
    ]
  },
  {
    id: "perf_5_3",
    game_id: "game_5",
    athlete_id: "3",
    date: "2024-01-10",
    opponent: "Mountain View",
    minutes: 29,
    points: 16,
    rebounds: 16,
    assists: 1,
    steals: 2,
    blocks: 3,
    turnovers: 1,
    field_goals_made: 7,
    field_goals_attempted: 12,
    three_pointers_made: 0,
    three_pointers_attempted: 0,
    free_throws_made: 2,
    free_throws_attempted: 3,
    fouls: 2,
    plus_minus: 8,
    badges: [
      { name: "Glass Cleaner", level: "silver", icon: "🧹" },
      { name: "Double-Double King", level: "bronze", icon: "👑" }
    ]
  }
];

// Mock games data
export const mockGamesData = [
  {
    id: "game_1",
    date: "2024-01-20",
    opponent: "West High Eagles",
    location: "Home",
    game_type: "Regular Season",
    season: "2024",
    team_score: 82,
    opponent_score: 78,
    notes: "Close game, great team effort in the fourth quarter"
  },
  {
    id: "game_2",
    date: "2024-01-18", 
    opponent: "East Valley Warriors",
    location: "Away",
    game_type: "Regular Season",
    season: "2024",
    team_score: 95,
    opponent_score: 68,
    notes: "Dominant performance, excellent ball movement"
  },
  {
    id: "game_3",
    date: "2024-01-15",
    opponent: "North Central Panthers",
    location: "Home", 
    game_type: "Regular Season",
    season: "2024",
    team_score: 91,
    opponent_score: 77,
    notes: "Strong defensive effort, controlled the pace"
  },
  {
    id: "game_4",
    date: "2024-01-12",
    opponent: "South Regional Rockets",
    location: "Neutral",
    game_type: "Tournament",
    season: "2024",
    team_score: 69,
    opponent_score: 72,
    notes: "Tough loss, need to work on free throw shooting"
  },
  {
    id: "game_5",
    date: "2024-01-10",
    opponent: "Mountain View Mustangs",
    location: "Away",
    game_type: "Regular Season", 
    season: "2024",
    team_score: 85,
    opponent_score: 78,
    notes: "Good road win, clutch performance in overtime"
  }
];

// Function to load mock performance data
export function loadMockPerformanceData() {
  // Load games
  const existingGames = JSON.parse(localStorage.getItem('mock_games') || '[]');
  const gameIds = existingGames.map(g => g.id);
  
  const newGames = mockGamesData.filter(game => !gameIds.includes(game.id));
  const updatedGames = [...existingGames, ...newGames];
  localStorage.setItem('mock_games', JSON.stringify(updatedGames));
  
  // Load performances
  const existingPerformances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
  const perfKeys = existingPerformances.map(p => `${p.game_id}_${p.athlete_id}`);
  
  const newPerformances = mockGamePerformances
    .filter(perf => !perfKeys.includes(`${perf.game_id}_${perf.athlete_id}`))
    .map(perf => ({
      ...perf,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    }));
  
  const updatedPerformances = [...existingPerformances, ...newPerformances];
  localStorage.setItem('mock_gamePerformances', JSON.stringify(updatedPerformances));
  
  // Load benchmarks
  const existingBenchmarks = JSON.parse(localStorage.getItem('mock_benchmarks') || '[]');
  const benchmarkKeys = existingBenchmarks.map(b => `${b.player_id}_${b.stat_type}`);
  
  const defaultBenchmarks = [
    { id: "bench_1", player_id: "1", stat_type: "points", target_value: 18.0, active: true },
    { id: "bench_2", player_id: "1", stat_type: "assists", target_value: 7.5, active: true },
    { id: "bench_3", player_id: "1", stat_type: "rebounds", target_value: 5.5, active: true },
    { id: "bench_4", player_id: "2", stat_type: "points", target_value: 22.5, active: true },
    { id: "bench_5", player_id: "2", stat_type: "three_pointers_made", target_value: 4.5, active: true },
    { id: "bench_6", player_id: "3", stat_type: "rebounds", target_value: 11.5, active: true },
    { id: "bench_7", player_id: "3", stat_type: "blocks", target_value: 2.5, active: true }
  ];
  
  const newBenchmarks = defaultBenchmarks
    .filter(bench => !benchmarkKeys.includes(`${bench.player_id}_${bench.stat_type}`))
    .map(bench => ({
      ...bench,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    }));
  
  const updatedBenchmarks = [...existingBenchmarks, ...newBenchmarks];
  localStorage.setItem('mock_benchmarks', JSON.stringify(updatedBenchmarks));
  
  console.log(`Loaded ${newGames.length} games, ${newPerformances.length} performances, ${newBenchmarks.length} benchmarks`);
  return { 
    games: newGames.length, 
    performances: newPerformances.length,
    benchmarks: newBenchmarks.length 
  };
}

// Function to clear performance data
export function clearMockPerformanceData() {
  localStorage.removeItem('mock_games');
  localStorage.removeItem('mock_gamePerformances');
  localStorage.removeItem('mock_benchmarks');
  console.log('Cleared all performance data');
}