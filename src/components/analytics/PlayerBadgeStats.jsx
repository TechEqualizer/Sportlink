import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  TrendingUp, 
  Calendar,
  Flame,
  Target,
  Award,
  Star,
  Zap
} from "lucide-react";
import { GamePerformance, Game } from "@/api/entities";
import { BADGE_DEFINITIONS, calculateBadgesForPerformance } from "@/utils/badges";
import { format, differenceInDays } from "date-fns";
import { mockPlayerAnalytics } from "@/api/mockPerformanceData";

export default function PlayerBadgeStats({ playerId }) {
  const [stats, setStats] = useState({
    totalBadges: 0,
    byTier: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
    recentBadges: [],
    currentStreak: 0,
    bestStreak: 0,
    avgBadgesPerGame: 0,
    rarestBadge: null,
    mostCommonBadge: null,
    lastBadgeDate: null,
    badgeTimeline: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      calculateBadgeStats();
    }
  }, [playerId]);

  const calculateBadgeStats = async () => {
    setIsLoading(true);
    try {
      // Use mock data if available
      const mockData = mockPlayerAnalytics[playerId];
      if (mockData && mockData.badgeStats) {
        const badgeData = mockData.badgeStats;
        
        setStats({
          totalBadges: badgeData.totalBadges,
          byTier: badgeData.byTier,
          recentBadges: badgeData.recentBadges,
          currentStreak: badgeData.currentStreak,
          bestStreak: badgeData.bestStreak,
          avgBadgesPerGame: (badgeData.totalBadges / 5).toFixed(1), // 5 games
          rarestBadge: badgeData.rarestBadge,
          mostCommonBadge: null,
          lastBadgeDate: badgeData.recentBadges[0]?.date,
          badgeTimeline: badgeData.recentBadges
        });
        
        setIsLoading(false);
        return;
      }
      
      // Load all performances and games for the player
      const [performances, games] = await Promise.all([
        GamePerformance.getByAthlete(playerId),
        Game.list()
      ]);

      // Create a map of game data
      const gameMap = {};
      games.forEach(game => {
        gameMap[game.id] = game;
      });

      // Calculate badges for each performance
      const badgesByGame = [];
      const badgeCount = {};
      const tierCount = { bronze: 0, silver: 0, gold: 0, platinum: 0 };
      let totalBadges = 0;

      performances.forEach(perf => {
        const game = gameMap[perf.game_id];
        if (game) {
          const badges = calculateBadgesForPerformance(perf, game);
          if (badges.length > 0) {
            badgesByGame.push({
              date: game.date,
              badges: badges,
              gameId: game.id,
              opponent: game.opponent
            });

            badges.forEach(badge => {
              totalBadges++;
              tierCount[badge.level]++;
              badgeCount[badge.badgeId] = (badgeCount[badge.badgeId] || 0) + 1;
            });
          }
        }
      });

      // Sort by date
      badgesByGame.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Calculate streaks
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;
      let lastGameDate = null;

      badgesByGame.forEach((game, index) => {
        if (index === 0) {
          tempStreak = 1;
        } else {
          const daysDiff = differenceInDays(
            new Date(lastGameDate),
            new Date(game.date)
          );
          
          // If games are within 7 days, continue streak
          if (daysDiff <= 7) {
            tempStreak++;
          } else {
            if (tempStreak > bestStreak) {
              bestStreak = tempStreak;
            }
            tempStreak = 1;
          }
        }
        lastGameDate = game.date;
      });

      // Set current streak if recent
      if (badgesByGame.length > 0) {
        const daysSinceLastBadge = differenceInDays(
          new Date(),
          new Date(badgesByGame[0].date)
        );
        currentStreak = daysSinceLastBadge <= 7 ? tempStreak : 0;
      }

      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }

      // Find rarest and most common badges
      let rarestBadge = null;
      let mostCommonBadge = null;
      let minCount = Infinity;
      let maxCount = 0;

      Object.entries(badgeCount).forEach(([badgeId, count]) => {
        const badgeDef = Object.values(BADGE_DEFINITIONS).find(b => b.id === badgeId);
        if (badgeDef) {
          if (count < minCount) {
            minCount = count;
            rarestBadge = { ...badgeDef, count };
          }
          if (count > maxCount) {
            maxCount = count;
            mostCommonBadge = { ...badgeDef, count };
          }
        }
      });

      // Get recent badges (last 5 games with badges)
      const recentBadges = badgesByGame.slice(0, 5).map(game => ({
        date: game.date,
        opponent: game.opponent,
        badges: game.badges
      }));

      // Calculate average badges per game
      const avgBadgesPerGame = performances.length > 0 
        ? (totalBadges / performances.length).toFixed(1)
        : 0;

      setStats({
        totalBadges,
        byTier: tierCount,
        recentBadges,
        currentStreak,
        bestStreak,
        avgBadgesPerGame,
        rarestBadge,
        mostCommonBadge,
        lastBadgeDate: badgesByGame[0]?.date || null,
        badgeTimeline: badgesByGame.slice(0, 10) // Last 10 games with badges
      });

    } catch (error) {
      console.error("Error calculating badge stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Badges",
      value: stats.totalBadges,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      detail: `${stats.avgBadgesPerGame} per game`
    },
    {
      title: "Current Streak",
      value: stats.currentStreak,
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      detail: `Best: ${stats.bestStreak} games`
    },
    {
      title: "Platinum Badges",
      value: stats.byTier.platinum,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      detail: `${stats.byTier.gold} Gold, ${stats.byTier.silver} Silver`
    },
    {
      title: "Collection Rate",
      value: `${Math.round((Object.keys(stats.byTier).length / Object.keys(BADGE_DEFINITIONS).length) * 100)}%`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      detail: "Badge types earned"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Badge Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentBadges.length > 0 ? (
                stats.recentBadges.map((game, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="text-sm text-gray-500 min-w-[80px]">
                      {format(new Date(game.date), 'MMM dd')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">vs {game.opponent}</p>
                      <div className="flex flex-wrap gap-1">
                        {game.badges.map((badge, badgeIndex) => (
                          <Badge key={badgeIndex} variant="outline" className="text-xs">
                            {badge.icon} {badge.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No badges earned yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Special Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="w-5 h-5" />
              Special Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.rarestBadge && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Rarest Badge</p>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">{stats.rarestBadge.icon}</span>
                  <div>
                    <p className="font-medium">{stats.rarestBadge.name}</p>
                    <p className="text-xs text-gray-600">Earned {stats.rarestBadge.count} time{stats.rarestBadge.count > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            )}
            
            {stats.mostCommonBadge && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Most Frequent</p>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">{stats.mostCommonBadge.icon}</span>
                  <div>
                    <p className="font-medium">{stats.mostCommonBadge.name}</p>
                    <p className="text-xs text-gray-600">Earned {stats.mostCommonBadge.count} times</p>
                  </div>
                </div>
              </div>
            )}

            {stats.lastBadgeDate && (
              <div className="text-center pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Last badge earned {format(new Date(stats.lastBadgeDate), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}