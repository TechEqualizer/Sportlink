// Badge definitions and criteria
export const BADGE_DEFINITIONS = {
  // Scoring badges
  LASER_SHOOTER: {
    id: 'laser_shooter',
    name: 'Laser Shooter',
    description: 'Elite 3-point shooting performance',
    icon: '🎯',
    criteria: {
      bronze: { three_pointers_made: 3, min_percentage: 40 },
      silver: { three_pointers_made: 5, min_percentage: 45 },
      gold: { three_pointers_made: 7, min_percentage: 50 },
      platinum: { three_pointers_made: 10, min_percentage: 60 }
    }
  },
  
  SCORING_MACHINE: {
    id: 'scoring_machine',
    name: 'Scoring Machine',
    description: 'High scoring performance',
    icon: '🔥',
    criteria: {
      bronze: { points: 20 },
      silver: { points: 30 },
      gold: { points: 40 },
      platinum: { points: 50 }
    }
  },
  
  // Rebounding badges
  GLASS_CLEANER: {
    id: 'glass_cleaner',
    name: 'Glass Cleaner',
    description: 'Dominated the boards',
    icon: '🧹',
    criteria: {
      bronze: { rebounds: 10 },
      silver: { rebounds: 15 },
      gold: { rebounds: 20 },
      platinum: { rebounds: 25 }
    }
  },
  
  // Assist badges
  PLAYMAKER: {
    id: 'playmaker',
    name: 'Playmaker',
    description: 'Elite passing performance',
    icon: '🎪',
    criteria: {
      bronze: { assists: 7 },
      silver: { assists: 10 },
      gold: { assists: 13 },
      platinum: { assists: 15 }
    }
  },
  
  // Defense badges
  DEFENSIVE_WALL: {
    id: 'defensive_wall',
    name: 'Defensive Wall',
    description: 'Lockdown defense with steals and blocks',
    icon: '🛡️',
    criteria: {
      bronze: { combined_steals_blocks: 5 },
      silver: { combined_steals_blocks: 7 },
      gold: { combined_steals_blocks: 10 },
      platinum: { combined_steals_blocks: 12 }
    }
  },
  
  SHOT_BLOCKER: {
    id: 'shot_blocker',
    name: 'Shot Blocker',
    description: 'Rejected multiple shots',
    icon: '🚫',
    criteria: {
      bronze: { blocks: 3 },
      silver: { blocks: 5 },
      gold: { blocks: 7 },
      platinum: { blocks: 10 }
    }
  },
  
  PICKPOCKET: {
    id: 'pickpocket',
    name: 'Pickpocket',
    description: 'Elite stealing ability',
    icon: '🥷',
    criteria: {
      bronze: { steals: 3 },
      silver: { steals: 5 },
      gold: { steals: 7 },
      platinum: { steals: 10 }
    }
  },
  
  // All-around badges
  DOUBLE_DOUBLE: {
    id: 'double_double',
    name: 'Double-Double King',
    description: 'Double digits in two categories',
    icon: '👑',
    criteria: {
      bronze: { categories_with_10_plus: 2 },
      silver: { categories_with_10_plus: 2, min_points: 15 },
      gold: { categories_with_10_plus: 2, min_points: 20 },
      platinum: { categories_with_10_plus: 2, min_points: 25 }
    }
  },
  
  TRIPLE_DOUBLE: {
    id: 'triple_double',
    name: 'Triple-Double Master',
    description: 'Double digits in three categories',
    icon: '💎',
    criteria: {
      bronze: { categories_with_10_plus: 3 },
      silver: { categories_with_10_plus: 3, min_points: 15 },
      gold: { categories_with_10_plus: 3, min_points: 20 },
      platinum: { categories_with_10_plus: 3, min_points: 25 }
    }
  },
  
  // Efficiency badges
  EFFICIENT_SCORER: {
    id: 'efficient_scorer',
    name: 'Efficient Scorer',
    description: 'High scoring with great efficiency',
    icon: '⚡',
    criteria: {
      bronze: { points: 15, min_fg_percentage: 50 },
      silver: { points: 20, min_fg_percentage: 55 },
      gold: { points: 25, min_fg_percentage: 60 },
      platinum: { points: 30, min_fg_percentage: 65 }
    }
  },
  
  PERFECT_SHOOTER: {
    id: 'perfect_shooter',
    name: 'Perfect from the Line',
    description: 'Perfect free throw shooting',
    icon: '💯',
    criteria: {
      bronze: { free_throws_made: 5, min_ft_percentage: 100 },
      silver: { free_throws_made: 8, min_ft_percentage: 100 },
      gold: { free_throws_made: 10, min_ft_percentage: 100 },
      platinum: { free_throws_made: 15, min_ft_percentage: 100 }
    }
  },
  
  // Clutch badges
  CLUTCH_PERFORMER: {
    id: 'clutch_performer',
    name: 'Clutch Performer',
    description: 'Stepped up in a close game',
    icon: '🎯',
    criteria: {
      bronze: { points: 20, game_decided_by: 5 },
      silver: { points: 25, game_decided_by: 3 },
      gold: { points: 30, game_decided_by: 2 },
      platinum: { points: 35, game_decided_by: 1 }
    }
  },
  
  // Durability badges
  IRON_MAN: {
    id: 'iron_man',
    name: 'Iron Man',
    description: 'Played heavy minutes',
    icon: '🦾',
    criteria: {
      bronze: { minutes: 32 },
      silver: { minutes: 36 },
      gold: { minutes: 40 },
      platinum: { minutes: 45 }
    }
  }
};

// Helper function to calculate badges earned in a game
export function calculateBadgesForPerformance(performance, game) {
  const earnedBadges = [];
  
  // Calculate derived stats
  const fg_percentage = performance.field_goals_attempted > 0 
    ? (performance.field_goals_made / performance.field_goals_attempted) * 100 
    : 0;
  
  const three_percentage = performance.three_pointers_attempted > 0
    ? (performance.three_pointers_made / performance.three_pointers_attempted) * 100
    : 0;
    
  const ft_percentage = performance.free_throws_attempted > 0
    ? (performance.free_throws_made / performance.free_throws_attempted) * 100
    : 0;
  
  const combined_steals_blocks = (performance.steals || 0) + (performance.blocks || 0);
  
  // Count categories with 10+ for double/triple double
  const categories_with_10_plus = [
    performance.points >= 10,
    performance.rebounds >= 10,
    performance.assists >= 10,
    performance.steals >= 10,
    performance.blocks >= 10
  ].filter(Boolean).length;
  
  const game_margin = Math.abs(game.team_score - game.opponent_score);
  
  // Check each badge
  Object.values(BADGE_DEFINITIONS).forEach(badge => {
    let highestLevel = null;
    
    // Check from platinum down to bronze
    ['platinum', 'gold', 'silver', 'bronze'].forEach(level => {
      const criteria = badge.criteria[level];
      let qualified = true;
      
      // Check each criterion
      if (criteria.points !== undefined && performance.points < criteria.points) qualified = false;
      if (criteria.rebounds !== undefined && performance.rebounds < criteria.rebounds) qualified = false;
      if (criteria.assists !== undefined && performance.assists < criteria.assists) qualified = false;
      if (criteria.steals !== undefined && performance.steals < criteria.steals) qualified = false;
      if (criteria.blocks !== undefined && performance.blocks < criteria.blocks) qualified = false;
      if (criteria.three_pointers_made !== undefined && performance.three_pointers_made < criteria.three_pointers_made) qualified = false;
      if (criteria.free_throws_made !== undefined && performance.free_throws_made < criteria.free_throws_made) qualified = false;
      if (criteria.minutes !== undefined && performance.minutes < criteria.minutes) qualified = false;
      
      // Percentage checks
      if (criteria.min_percentage !== undefined && three_percentage < criteria.min_percentage) qualified = false;
      if (criteria.min_fg_percentage !== undefined && fg_percentage < criteria.min_fg_percentage) qualified = false;
      if (criteria.min_ft_percentage !== undefined && ft_percentage < criteria.min_ft_percentage) qualified = false;
      
      // Combined stats
      if (criteria.combined_steals_blocks !== undefined && combined_steals_blocks < criteria.combined_steals_blocks) qualified = false;
      if (criteria.categories_with_10_plus !== undefined && categories_with_10_plus < criteria.categories_with_10_plus) qualified = false;
      
      // Game context
      if (criteria.game_decided_by !== undefined && game_margin > criteria.game_decided_by) qualified = false;
      
      // Additional criteria for higher levels
      if (criteria.min_points !== undefined && performance.points < criteria.min_points) qualified = false;
      
      if (qualified && !highestLevel) {
        highestLevel = level;
      }
    });
    
    if (highestLevel) {
      earnedBadges.push({
        badgeId: badge.id,
        level: highestLevel,
        name: badge.name,
        description: badge.description,
        icon: badge.icon
      });
    }
  });
  
  return earnedBadges;
}

// Get badge color based on level
export function getBadgeColor(level) {
  switch (level) {
    case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

// Get badge level name
export function getBadgeLevelName(level) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}