import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Award,
  Lock,
  Sparkles,
  ChevronRight,
  Info
} from "lucide-react";
import { BADGE_DEFINITIONS, getBadgeColor, getBadgeLevelName } from "@/utils/badges";
import { GamePerformance } from "@/api/entities";
import { mockPlayerAnalytics } from "@/api/mockPerformanceData";

const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum'];
const TIER_COLORS = {
  bronze: { bg: 'bg-gradient-to-br from-orange-100 to-orange-200', border: 'border-orange-400', text: 'text-orange-900' },
  silver: { bg: 'bg-gradient-to-br from-gray-100 to-gray-200', border: 'border-gray-400', text: 'text-gray-900' },
  gold: { bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200', border: 'border-yellow-500', text: 'text-yellow-900' },
  platinum: { bg: 'bg-gradient-to-br from-purple-100 to-purple-200', border: 'border-purple-500', text: 'text-purple-900' }
};

export default function BadgeShowcase({ playerId, onBadgeClick }) {
  const [playerBadges, setPlayerBadges] = useState([]);
  const [badgeProgress, setBadgeProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (playerId) {
      loadPlayerBadges();
    }
  }, [playerId]);

  const loadPlayerBadges = async () => {
    setIsLoading(true);
    try {
      // Use mock data if available
      const mockData = mockPlayerAnalytics[playerId];
      if (mockData && mockData.badgeStats) {
        const badgeData = mockData.badgeStats;
        
        // Convert recent badges to the expected format
        const earnedBadges = badgeData.recentBadges.flatMap(game => 
          game.badges.map(badge => ({
            id: badge.name.toLowerCase().replace(/\s+/g, '_'),
            name: badge.name,
            description: BADGE_DEFINITIONS[badge.name.toUpperCase().replace(/\s+/g, '_')]?.description || badge.name,
            icon: badge.icon,
            tier: badge.level,
            count: 1,
            lastEarned: game.date
          }))
        );
        
        setPlayerBadges(earnedBadges);
        setIsLoading(false);
        return;
      }
      
      // Load all performances for the player
      const performances = await GamePerformance.getByAthlete(playerId);
      
      // Calculate badges for each performance
      const allBadges = [];
      const badgeStats = {};
      
      performances.forEach(perf => {
        // Note: We would need the game data too for complete badge calculation
        // For now, we'll calculate based on performance stats only
        Object.entries(BADGE_DEFINITIONS).forEach(([badgeKey, badge]) => {
          const earnedTier = checkBadgeTier(perf, badge);
          if (earnedTier) {
            allBadges.push({
              ...badge,
              tier: earnedTier,
              performance: perf,
              date: perf.created_date
            });
            
            // Track highest tier achieved for each badge
            if (!badgeStats[badge.id] || TIER_ORDER.indexOf(earnedTier) > TIER_ORDER.indexOf(badgeStats[badge.id].tier)) {
              badgeStats[badge.id] = {
                ...badge,
                tier: earnedTier,
                count: (badgeStats[badge.id]?.count || 0) + 1,
                lastEarned: perf.created_date
              };
            } else if (badgeStats[badge.id]) {
              badgeStats[badge.id].count++;
            }
          }
        });
      });
      
      setPlayerBadges(Object.values(badgeStats));
      calculateBadgeProgress(performances);
    } catch (error) {
      console.error("Error loading player badges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkBadgeTier = (performance, badge) => {
    // Simplified badge checking - in real implementation would use full logic
    const tiers = ['platinum', 'gold', 'silver', 'bronze'];
    
    for (const tier of tiers) {
      const criteria = badge.criteria[tier];
      if (!criteria) continue;
      
      let meetsRequirements = true;
      
      // Check each criterion
      Object.entries(criteria).forEach(([key, value]) => {
        if (key === 'points' && performance.points < value) meetsRequirements = false;
        if (key === 'assists' && performance.assists < value) meetsRequirements = false;
        if (key === 'rebounds' && performance.rebounds < value) meetsRequirements = false;
        if (key === 'three_pointers_made' && performance.three_pointers_made < value) meetsRequirements = false;
        if (key === 'steals' && performance.steals < value) meetsRequirements = false;
        if (key === 'blocks' && performance.blocks < value) meetsRequirements = false;
      });
      
      if (meetsRequirements) return tier;
    }
    
    return null;
  };

  const calculateBadgeProgress = (performances) => {
    const progress = {};
    
    Object.entries(BADGE_DEFINITIONS).forEach(([badgeKey, badge]) => {
      // Calculate how close player is to each tier
      const recentPerfs = performances.slice(-5); // Last 5 games
      
      let bestStat = 0;
      const statKey = Object.keys(badge.criteria.bronze)[0]; // Get main stat
      
      recentPerfs.forEach(perf => {
        if (perf[statKey] > bestStat) {
          bestStat = perf[statKey];
        }
      });
      
      // Find next tier to achieve
      let nextTier = null;
      let progressPercent = 0;
      
      for (const tier of TIER_ORDER) {
        if (badge.criteria[tier] && badge.criteria[tier][statKey]) {
          const required = badge.criteria[tier][statKey];
          if (bestStat < required) {
            nextTier = tier;
            progressPercent = (bestStat / required) * 100;
            break;
          }
        }
      }
      
      progress[badge.id] = {
        currentBest: bestStat,
        nextTier,
        progressPercent,
        statKey
      };
    });
    
    setBadgeProgress(progress);
  };

  const categories = [
    { value: 'all', label: 'All Badges' },
    { value: 'scoring', label: 'Scoring' },
    { value: 'playmaking', label: 'Playmaking' },
    { value: 'rebounding', label: 'Rebounding' },
    { value: 'defense', label: 'Defense' },
    { value: 'efficiency', label: 'Efficiency' }
  ];

  const getCategoryForBadge = (badgeId) => {
    if (badgeId.includes('shoot') || badgeId.includes('scoring')) return 'scoring';
    if (badgeId.includes('assist') || badgeId.includes('playmaker')) return 'playmaking';
    if (badgeId.includes('rebound') || badgeId.includes('glass')) return 'rebounding';
    if (badgeId.includes('steal') || badgeId.includes('block') || badgeId.includes('defense')) return 'defense';
    if (badgeId.includes('efficient') || badgeId.includes('perfect')) return 'efficiency';
    return 'other';
  };

  const filteredBadges = selectedCategory === 'all' 
    ? playerBadges 
    : playerBadges.filter(badge => getCategoryForBadge(badge.id) === selectedCategory);

  const unlockedBadges = Object.entries(BADGE_DEFINITIONS).filter(([key, badge]) => 
    !playerBadges.find(pb => pb.id === badge.id) &&
    (selectedCategory === 'all' || getCategoryForBadge(badge.id) === selectedCategory)
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badge Stats Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-900">{playerBadges.length}</div>
              <div className="text-sm text-blue-700">Total Badges</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {playerBadges.filter(b => b.tier === 'platinum').length}
              </div>
              <div className="text-sm text-purple-700">Platinum</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-700">
                {playerBadges.filter(b => b.tier === 'gold').length}
              </div>
              <div className="text-sm text-yellow-600">Gold</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">
                {Math.round((playerBadges.length / Object.keys(BADGE_DEFINITIONS).length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Collection</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Earned Badges */}
      {filteredBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Earned Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBadges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`relative overflow-hidden cursor-pointer transform transition-all hover:scale-105 ${
                  badge.tier === 'platinum' ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                }`}
                onClick={() => onBadgeClick && onBadgeClick(badge)}
              >
                <div className={`absolute inset-0 ${TIER_COLORS[badge.tier].bg} opacity-20`}></div>
                <CardContent className="relative p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl">{badge.icon}</div>
                    <Badge className={getBadgeColor(badge.tier)}>
                      {getBadgeLevelName(badge.tier)}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                  {badge.count > 1 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3" />
                      Earned {badge.count} times
                    </div>
                  )}
                </CardContent>
                {badge.tier === 'platinum' && (
                  <div className="absolute top-0 right-0 p-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Progress Towards Next Badges */}
      {unlockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            Locked Badges - Keep Playing to Unlock!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedBadges.slice(0, 6).map(([key, badge]) => {
              const progress = badgeProgress[badge.id] || {};
              return (
                <Card key={badge.id} className="relative overflow-hidden opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-3xl grayscale opacity-50">{badge.icon}</div>
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-gray-600">{badge.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">{badge.description}</p>
                    
                    {progress.progressPercent > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Progress to {progress.nextTier}</span>
                          <span className="text-gray-600 font-medium">
                            {Math.round(progress.progressPercent)}%
                          </span>
                        </div>
                        <Progress value={progress.progressPercent} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}