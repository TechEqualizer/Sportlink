// Mock data for local development
export const mockAthletes = [
  {
    id: "1",
    name: "John Smith",
    position: "Point Guard",
    jersey_number: "23",
    class_year: "Senior",
    height: "6'2\"",
    weight: "185 lbs",
    hometown: "Chicago, IL",
    high_school: "Lincoln High School",
    recruiting_status: "Open",
    sport_type: "Basketball",
    school_level: "High School",
    gpa: 3.8,
    sat_score: 1200,
    major: "Computer Science",
    college_interest: ["Duke", "UNC", "Michigan", "Kentucky", "Villanova"],
    character_traits: ["Team Leader", "Coachable", "High Basketball IQ", "Clutch Performer", "Strong Work Ethic"],
    achievements: ["2x All-State First Team", "Regional Championship MVP", "School Record: Most Assists (Season)", "Academic Honor Roll", "Team Captain (2 years)"],
    updated_date: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    position: "Shooting Guard",
    jersey_number: "15",
    class_year: "Junior",
    height: "5'8\"",
    weight: "150 lbs",
    hometown: "Los Angeles, CA",
    high_school: "Hollywood High",
    recruiting_status: "Committed",
    sport_type: "Basketball",
    school_level: "High School",
    gpa: 3.9,
    sat_score: 1350,
    major: "Business",
    college_interest: ["UCLA", "USC", "Stanford", "Gonzaga", "Oregon"],
    character_traits: ["Natural Scorer", "Competitive Spirit", "Mentally Tough", "Great Shooter", "Team First Attitude"],
    achievements: ["All-League First Team", "1,000 Career Points", "League Leading Scorer", "Student-Athlete Award", "Perfect Attendance"],
    updated_date: new Date().toISOString()
  },
  {
    id: "3",
    name: "Mike Williams",
    position: "Center",
    jersey_number: "33",
    class_year: "Sophomore", 
    height: "6'8\"",
    weight: "220 lbs",
    hometown: "Houston, TX",
    high_school: "Central High",
    recruiting_status: "Verbal",
    sport_type: "Basketball",
    school_level: "High School",
    gpa: 3.5,
    sat_score: 1100,
    major: "Engineering",
    college_interest: ["Texas", "Rice", "Houston", "Baylor", "Texas A&M"],
    character_traits: ["Dominant Presence", "Shot Blocker", "Reliable", "Hard Worker", "Developing Leader"],
    achievements: ["District Defensive Player of Year", "All-Region Team", "Double-Double Average", "Honor Roll Student", "Community Service Award"],
    updated_date: new Date().toISOString()
  }
];

export const mockTeam = {
  id: "team1",
  name: "Lincoln Eagles",
  sport_type: "Basketball",
  school_level: "High School",
  primary_color: "#1e40af",
  secondary_color: "#f59e0b",
  logo_url: null
};

// Mock season statistics data
export const mockSeasonStats = {
  "1": { // John Smith
    currentSeason: {
      gamesPlayed: 24,
      ppg: 18.5,
      apg: 7.2,
      rpg: 4.1,
      spg: 2.3,
      bpg: 0.2,
      fg_percentage: 48.5,
      three_percentage: 38.2,
      ft_percentage: 85.4,
      turnovers: 2.1,
      fouls: 2.3,
      minutes: 31.5
    },
    careerAverages: {
      ppg: 16.2,
      apg: 6.8,
      rpg: 3.9,
      spg: 2.1,
      fg_percentage: 47.2,
      three_percentage: 36.5,
      ft_percentage: 83.1
    },
    recentGames: [
      { date: "2024-01-20", opponent: "West High", points: 22, assists: 9, rebounds: 5, steals: 3, result: "W 78-65" },
      { date: "2024-01-18", opponent: "East Valley", points: 19, assists: 6, rebounds: 3, steals: 2, result: "W 82-71" },
      { date: "2024-01-15", opponent: "North Central", points: 24, assists: 8, rebounds: 6, steals: 4, result: "W 91-77" },
      { date: "2024-01-12", opponent: "South Regional", points: 15, assists: 11, rebounds: 4, steals: 2, result: "L 69-72" },
      { date: "2024-01-10", opponent: "Mountain View", points: 28, assists: 7, rebounds: 5, steals: 3, result: "W 85-78" }
    ],
    performanceMetrics: {
      efficiency: 22.4,
      per: 21.8,
      winShares: 5.2,
      usageRate: 24.5,
      assistRatio: 28.9,
      reboundRate: 8.7
    }
  },
  "2": { // Sarah Johnson
    currentSeason: {
      gamesPlayed: 22,
      ppg: 24.3,
      apg: 3.1,
      rpg: 5.2,
      spg: 1.8,
      bpg: 0.3,
      fg_percentage: 51.2,
      three_percentage: 42.1,
      ft_percentage: 88.7,
      turnovers: 1.8,
      fouls: 1.9,
      minutes: 29.8
    },
    careerAverages: {
      ppg: 21.5,
      apg: 2.9,
      rpg: 4.8,
      spg: 1.6,
      fg_percentage: 49.8,
      three_percentage: 40.3,
      ft_percentage: 87.2
    },
    recentGames: [
      { date: "2024-01-20", opponent: "West High", points: 31, assists: 4, rebounds: 6, steals: 2, result: "W 78-65" },
      { date: "2024-01-18", opponent: "East Valley", points: 26, assists: 2, rebounds: 4, steals: 1, result: "W 82-71" },
      { date: "2024-01-15", opponent: "North Central", points: 29, assists: 3, rebounds: 7, steals: 3, result: "W 91-77" },
      { date: "2024-01-12", opponent: "South Regional", points: 18, assists: 5, rebounds: 5, steals: 2, result: "L 69-72" },
      { date: "2024-01-10", opponent: "Mountain View", points: 22, assists: 3, rebounds: 4, steals: 1, result: "W 85-78" }
    ],
    performanceMetrics: {
      efficiency: 26.8,
      per: 25.2,
      winShares: 6.1,
      usageRate: 28.3,
      assistRatio: 12.4,
      reboundRate: 11.2
    }
  },
  "3": { // Mike Williams
    currentSeason: {
      gamesPlayed: 20,
      ppg: 14.2,
      apg: 1.4,
      rpg: 10.3,
      spg: 0.8,
      bpg: 3.2,
      fg_percentage: 58.4,
      three_percentage: 0.0,
      ft_percentage: 68.5,
      turnovers: 2.4,
      fouls: 3.1,
      minutes: 26.2
    },
    careerAverages: {
      ppg: 12.8,
      apg: 1.2,
      rpg: 9.6,
      spg: 0.7,
      fg_percentage: 56.9,
      three_percentage: 0.0,
      ft_percentage: 65.3
    },
    recentGames: [
      { date: "2024-01-20", opponent: "West High", points: 16, assists: 2, rebounds: 12, blocks: 4, result: "W 78-65" },
      { date: "2024-01-18", opponent: "East Valley", points: 12, assists: 1, rebounds: 9, blocks: 3, result: "W 82-71" },
      { date: "2024-01-15", opponent: "North Central", points: 18, assists: 2, rebounds: 14, blocks: 5, result: "W 91-77" },
      { date: "2024-01-12", opponent: "South Regional", points: 10, assists: 0, rebounds: 8, blocks: 2, result: "L 69-72" },
      { date: "2024-01-10", opponent: "Mountain View", points: 15, assists: 3, rebounds: 11, blocks: 3, result: "W 85-78" }
    ],
    performanceMetrics: {
      efficiency: 20.1,
      per: 19.5,
      winShares: 4.3,
      usageRate: 18.2,
      assistRatio: 5.6,
      reboundRate: 22.4
    }
  }
};

// Mock performance chart data
export const mockPerformanceData = {
  "1": { // John Smith
    monthlyAverages: [
      { month: "Sep", ppg: 14.2, apg: 5.8, rpg: 3.5 },
      { month: "Oct", ppg: 15.8, apg: 6.2, rpg: 3.8 },
      { month: "Nov", ppg: 17.1, apg: 6.9, rpg: 4.0 },
      { month: "Dec", ppg: 18.5, apg: 7.1, rpg: 4.2 },
      { month: "Jan", ppg: 19.8, apg: 7.5, rpg: 4.3 }
    ],
    shootingTrends: [
      { month: "Sep", fg: 45.2, three: 34.1, ft: 81.2 },
      { month: "Oct", fg: 46.8, three: 35.8, ft: 82.5 },
      { month: "Nov", fg: 47.5, three: 37.2, ft: 84.1 },
      { month: "Dec", fg: 48.1, three: 37.9, ft: 85.0 },
      { month: "Jan", fg: 49.2, three: 39.1, ft: 86.2 }
    ]
  },
  "2": { // Sarah Johnson
    monthlyAverages: [
      { month: "Sep", ppg: 20.1, apg: 2.5, rpg: 4.2 },
      { month: "Oct", ppg: 22.3, apg: 2.8, rpg: 4.6 },
      { month: "Nov", ppg: 23.8, apg: 3.0, rpg: 5.0 },
      { month: "Dec", ppg: 24.5, apg: 3.2, rpg: 5.1 },
      { month: "Jan", ppg: 25.2, apg: 3.4, rpg: 5.3 }
    ],
    shootingTrends: [
      { month: "Sep", fg: 48.5, three: 38.2, ft: 85.3 },
      { month: "Oct", fg: 49.8, three: 39.5, ft: 86.8 },
      { month: "Nov", fg: 50.4, three: 41.2, ft: 87.5 },
      { month: "Dec", fg: 51.0, three: 41.8, ft: 88.2 },
      { month: "Jan", fg: 52.1, three: 43.2, ft: 89.1 }
    ]
  },
  "3": { // Mike Williams
    monthlyAverages: [
      { month: "Sep", ppg: 10.5, apg: 0.8, rpg: 8.2 },
      { month: "Oct", ppg: 12.1, apg: 1.0, rpg: 9.1 },
      { month: "Nov", ppg: 13.5, apg: 1.2, rpg: 9.8 },
      { month: "Dec", ppg: 14.0, apg: 1.3, rpg: 10.1 },
      { month: "Jan", ppg: 14.8, apg: 1.5, rpg: 10.5 }
    ],
    shootingTrends: [
      { month: "Sep", fg: 54.2, three: 0.0, ft: 62.1 },
      { month: "Oct", fg: 56.1, three: 0.0, ft: 64.5 },
      { month: "Nov", fg: 57.8, three: 0.0, ft: 66.8 },
      { month: "Dec", fg: 58.2, three: 0.0, ft: 67.9 },
      { month: "Jan", fg: 59.1, three: 0.0, ft: 69.2 }
    ]
  }
};

// Mock team statistics
export const mockTeamStats = {
  teamRecord: { wins: 18, losses: 6 },
  conference: { wins: 12, losses: 2 },
  rankings: {
    state: 8,
    regional: 3,
    national: 45
  },
  teamAverages: {
    ppg: 78.5,
    papg: 65.2,
    rpg: 38.4,
    apg: 18.2,
    spg: 8.5,
    bpg: 4.2,
    fg_percentage: 47.8,
    three_percentage: 36.5,
    ft_percentage: 78.2
  },
  streaks: {
    current: "W4",
    best: "W8",
    home: "8-1",
    away: "10-5"
  }
};