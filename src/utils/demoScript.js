// Demo script to showcase the platform's value for coaches
import { loadSampleGameData } from "@/api/sampleGameData";
import { calculateBadgesForPerformance, BADGE_DEFINITIONS } from "./badges";

export const DEMO_SCENARIOS = {
  PLAYER_DEVELOPMENT: {
    title: "📈 Player Development Over Time",
    description: "See how John Smith improved from 15 PPG to 22 PPG across 5 games",
    highlights: [
      "Track performance trends game by game",
      "Identify improvement areas (assists up 40%)",
      "Monitor shooting efficiency changes",
      "Celebrate achievement milestones"
    ]
  },
  
  BADGE_MOTIVATION: {
    title: "🏆 Achievement-Based Motivation", 
    description: "Players earn badges for standout performances, creating engagement",
    highlights: [
      "Sarah earned 'Laser Shooter Gold' (7 threes at 58%)",
      "Mike achieved 'Glass Cleaner Silver' (16 rebounds)",
      "John unlocked 'Triple-Double Master' (18-10-12)",
      "Team earned 12+ total badges across 5 games"
    ]
  },

  COACHING_INSIGHTS: {
    title: "🎯 Data-Driven Coaching Decisions",
    description: "Use performance data to make strategic adjustments",
    highlights: [
      "Identify who performs best in clutch situations", 
      "Track defensive impact (steals + blocks)",
      "Monitor player stamina and minutes distribution",
      "Compare performance home vs away games"
    ]
  },

  PARENT_ENGAGEMENT: {
    title: "👨‍👩‍👧‍👦 Parent & Player Engagement",
    description: "Transparent tracking builds trust and shows progress",
    highlights: [
      "Parents see concrete evidence of improvement",
      "Players motivated by badge achievements", 
      "Clear performance metrics for college recruiting",
      "Historical data shows long-term development"
    ]
  }
};

export const BADGE_SHOWCASE = [
  {
    scenario: "🎯 Elite Shooting Night",
    player: "Sarah Johnson vs West Valley",
    stats: "31 PTS, 7/12 3PM (58%)",
    badges: ["Scoring Machine Silver", "Laser Shooter Gold"],
    impact: "Earned team's highest single-game score this season"
  },
  {
    scenario: "🎪 Playmaking Excellence", 
    player: "John Smith vs Central High",
    stats: "22 PTS, 11 AST, 8 REB",
    badges: ["Playmaker Bronze", "Near Triple-Double"],
    impact: "Led team comeback in 4th quarter with clutch assists"
  },
  {
    scenario: "🛡️ Defensive Dominance",
    player: "Mike Williams vs East Regional", 
    stats: "14 PTS, 13 REB, 5 BLK, 3 STL",
    badges: ["Glass Cleaner Bronze", "Defensive Wall Bronze"],
    impact: "Controlled the paint, limited opponents to 35% shooting"
  },
  {
    scenario: "💎 Complete Performance",
    player: "John Smith vs West Valley",
    stats: "18 PTS, 10 REB, 12 AST",
    badges: ["Triple-Double Master Bronze", "Iron Man Silver"],
    impact: "First triple-double of season in 42-minute performance"
  }
];

export function getDemoStoryline() {
  return {
    gameProgression: [
      {
        game: 1,
        title: "Season Opener - Finding Chemistry", 
        outcome: "W 82-78 vs Central High",
        story: "Close win with balanced scoring. John shows leadership with 11 assists, Sarah finds her shooting rhythm.",
        keyMoments: ["Sarah's 7 three-pointers", "Mike's 4-block defensive stand", "Clutch free throws in final minute"]
      },
      {
        game: 2,
        title: "Offensive Explosion",
        outcome: "W 95-68 vs West Valley", 
        story: "Dominant performance! John records first triple-double, team shoots 52% from field.",
        keyMoments: ["John's 18-10-12 triple-double", "Sarah's efficient 27 points", "Mike's 20-12 double-double"]
      },
      {
        game: 3, 
        title: "Tough Road Loss - Learning Experience",
        outcome: "L 71-73 vs North Side",
        story: "Close game that came down to free throws. Team showed resilience but needs to improve at the line.",
        keyMoments: ["Sarah's 5 steals defensively", "John played 38 minutes (Iron Man)", "Missed 8 free throws as a team"]
      },
      {
        game: 4,
        title: "Tournament Clutch Performance", 
        outcome: "W 89-85 vs East Regional (OT)",
        story: "Overtime thriller! Players stepped up in big moments. Sarah perfect from free throw line when it mattered.",
        keyMoments: ["John's 28 points in clutch game", "Sarah 8/8 from free throw line", "Mike's 5 blocks protecting rim"]
      },
      {
        game: 5,
        title: "Building Momentum",
        outcome: "W 76-72 vs Metro High",
        story: "Controlled road victory. Team chemistry showing as ball movement leads to open shots.",
        keyMoments: ["John's 13 assists (season high)", "Sarah's 5 three-pointers", "Mike's 16 rebounds"]
      }
    ],

    playerStories: {
      john: {
        arc: "Leadership Development",
        progression: "Started cautious, gained confidence, became floor general by game 5",
        stats: "Assists improved from 11 → 13, shooting efficiency up 8%",
        badges: ["Playmaker Bronze → Silver", "Triple-Double Master", "Iron Man Bronze → Silver"]
      },
      sarah: {
        arc: "Elite Shooter Emergence", 
        progression: "Found three-point stroke early, became the team's go-to scorer",
        stats: "Three-point shooting 42% over 5 games, 24.6 PPG average",
        badges: ["Laser Shooter Bronze → Gold", "Scoring Machine Silver", "Perfect Shooter"]
      },
      mike: {
        arc: "Paint Presence",
        progression: "Defensive anchor who developed offensive touch", 
        stats: "Rebounds up from 14 → 16 per game, blocks consistent at 3+",
        badges: ["Glass Cleaner Bronze → Silver", "Defensive Wall", "Double-Double King"]
      }
    }
  };
}

export function getCoachingTakeaways() {
  return {
    strengths: [
      "🎯 Three-point shooting (38% team average)",
      "🤝 Ball movement (18 assists per game)", 
      "🛡️ Defensive rebounding (controlling the glass)",
      "💪 Clutch performance (3-1 in close games)"
    ],
    
    improvements: [
      "🎯 Free throw shooting consistency (72% team average)",
      "⚡ Turnovers in transition (12 per game)", 
      "🔄 Bench depth and rotation management",
      "🎮 Late-game execution under pressure"
    ],

    individualPlans: [
      "John: Continue developing court vision, work on shot consistency",
      "Sarah: Maintain shooting confidence, improve defensive rebounding", 
      "Mike: Expand offensive range, reduce fouling in post defense"
    ],

    recruitingHighlights: [
      "John's triple-double shows elite court vision for PG position",
      "Sarah's 58% three-point game demonstrates clutch shooting ability",
      "Mike's defensive presence (4+ blocks) and rebounding consistency"
    ]
  };
}

// Function to export performance summary for sharing
export function exportPerformanceSummary() {
  const summary = {
    teamRecord: "4-1 in last 5 games",
    standoutPerformances: BADGE_SHOWCASE,
    playerDevelopment: getDemoStoryline().playerStories,
    coachingInsights: getCoachingTakeaways(),
    generatedAt: new Date().toISOString()
  };
  
  return JSON.stringify(summary, null, 2);
}