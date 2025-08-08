import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Activity, Target, Award } from "lucide-react";
import { mockSeasonStats, mockPerformanceData } from "@/api/mockData";
import { Game, GamePerformance } from "@/api/entities";
import { format } from "date-fns";

const StatRow = ({ label, value, suffix = "" }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-medium-contrast text-sm">{label}</span>
    <span className="font-semibold text-high-contrast">{value}{suffix}</span>
  </div>
);

const GameRow = ({ game }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 text-sm">
    <div className="flex-1">
      <div className="font-medium text-high-contrast">{game.opponent}</div>
      <div className="text-xs text-low-contrast">{new Date(game.date).toLocaleDateString()}</div>
    </div>
    <div className="flex gap-4 text-right">
      <div>
        <div className="font-semibold">{game.points} PTS</div>
        <div className="text-xs text-medium-contrast">
          {game.assists} AST / {game.rebounds} REB
        </div>
      </div>
      <div className={`font-bold ${game.result.startsWith('W') ? 'text-green-600' : 'text-red-600'}`}>
        {game.result}
      </div>
    </div>
  </div>
);

export default function PlayerStatisticsTab({ athlete }) {
  const [actualGames, setActualGames] = useState([]);
  const [actualPerformances, setActualPerformances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const stats = mockSeasonStats[athlete.id] || {};
  const performanceData = mockPerformanceData[athlete.id] || {};
  
  const currentSeason = stats.currentSeason || {};
  const careerAverages = stats.careerAverages || {};
  const recentGames = stats.recentGames || [];
  const performanceMetrics = stats.performanceMetrics || {};
  const monthlyAverages = performanceData.monthlyAverages || [];
  const shootingTrends = performanceData.shootingTrends || [];

  useEffect(() => {
    loadActualGames();
  }, [athlete.id]);

  const loadActualGames = async () => {
    setIsLoading(true);
    try {
      // Load all performances for this athlete
      const performances = await GamePerformance.getByAthlete(athlete.id);
      setActualPerformances(performances);
      
      // Load game details for each performance
      const gamePromises = performances.map(perf => Game.get(perf.game_id));
      const games = await Promise.all(gamePromises);
      
      // Combine game and performance data
      const gamesWithStats = games.map((game, index) => ({
        ...game,
        stats: performances[index]
      })).sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setActualGames(gamesWithStats);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate actual season stats from real games
  const calculateSeasonStats = () => {
    if (actualPerformances.length === 0) return currentSeason;
    
    const totals = actualPerformances.reduce((acc, perf) => ({
      points: acc.points + (perf.points || 0),
      rebounds: acc.rebounds + (perf.rebounds || 0),
      assists: acc.assists + (perf.assists || 0),
      steals: acc.steals + (perf.steals || 0),
      blocks: acc.blocks + (perf.blocks || 0),
      minutes: acc.minutes + (perf.minutes || 0),
      field_goals_made: acc.field_goals_made + (perf.field_goals_made || 0),
      field_goals_attempted: acc.field_goals_attempted + (perf.field_goals_attempted || 0),
      three_pointers_made: acc.three_pointers_made + (perf.three_pointers_made || 0),
      three_pointers_attempted: acc.three_pointers_attempted + (perf.three_pointers_attempted || 0),
      free_throws_made: acc.free_throws_made + (perf.free_throws_made || 0),
      free_throws_attempted: acc.free_throws_attempted + (perf.free_throws_attempted || 0),
    }), {
      points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, minutes: 0,
      field_goals_made: 0, field_goals_attempted: 0,
      three_pointers_made: 0, three_pointers_attempted: 0,
      free_throws_made: 0, free_throws_attempted: 0
    });
    
    const gamesPlayed = actualPerformances.length;
    
    return {
      gamesPlayed,
      ppg: (totals.points / gamesPlayed).toFixed(1),
      rpg: (totals.rebounds / gamesPlayed).toFixed(1),
      apg: (totals.assists / gamesPlayed).toFixed(1),
      spg: (totals.steals / gamesPlayed).toFixed(1),
      bpg: (totals.blocks / gamesPlayed).toFixed(1),
      minutes: (totals.minutes / gamesPlayed).toFixed(1),
      fg_percentage: totals.field_goals_attempted > 0 
        ? ((totals.field_goals_made / totals.field_goals_attempted) * 100).toFixed(1)
        : 0,
      three_percentage: totals.three_pointers_attempted > 0
        ? ((totals.three_pointers_made / totals.three_pointers_attempted) * 100).toFixed(1)
        : 0,
      ft_percentage: totals.free_throws_attempted > 0
        ? ((totals.free_throws_made / totals.free_throws_attempted) * 100).toFixed(1)
        : 0
    };
  };

  const actualSeasonStats = calculateSeasonStats();

  // Use actual stats if available, otherwise fall back to mock data
  const displayStats = actualPerformances.length > 0 ? actualSeasonStats : currentSeason;
  
  const keyStats = [
    { label: "PPG", value: displayStats.ppg || 0, color: "text-blue-600", icon: Target },
    { label: "APG", value: displayStats.apg || 0, color: "text-green-600", icon: Activity },
    { label: "RPG", value: displayStats.rpg || 0, color: "text-purple-600", icon: Award },
    { label: "FG%", value: displayStats.fg_percentage || 0, color: "text-orange-600", icon: TrendingUp, isPercentage: true },
  ];

  return (
    <div className="space-y-6">
      {/* Key Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {keyStats.map((stat, index) => (
          <Card key={index} className="card-readable">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
                <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
                  {stat.isPercentage ? `${stat.value}%` : stat.value}
                </div>
              </div>
              <div className="text-sm text-medium-contrast font-medium">{stat.label}</div>
              <div className="text-xs text-low-contrast mt-1">
                Career: {stat.isPercentage ? 
                  `${careerAverages[stat.label.toLowerCase().replace('%', '_percentage')] || 0}%` : 
                  careerAverages[stat.label.toLowerCase()] || 0
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Games Performance */}
      <Card className="card-readable">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-high-contrast">
            {actualGames.length > 0 ? "Actual Games" : "Recent Games"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actualGames.length > 0 ? (
            <div className="space-y-1">
              {actualGames.slice(0, 5).map((game) => (
                <GameRow 
                  key={game.id} 
                  game={{
                    opponent: game.opponent,
                    date: game.date,
                    points: game.stats.points,
                    assists: game.stats.assists,
                    rebounds: game.stats.rebounds,
                    result: `${game.team_score > game.opponent_score ? 'W' : 'L'} ${game.team_score}-${game.opponent_score}`
                  }} 
                />
              ))}
            </div>
          ) : recentGames.length > 0 ? (
            <div className="space-y-1">
              {recentGames.slice(0, 5).map((game, index) => (
                <GameRow key={index} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-medium-contrast text-center py-8">No recent games recorded.</p>
          )}
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Trends */}
        <Card className="card-readable">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-high-contrast flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Season Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              {monthlyAverages.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAverages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12} 
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ppg" 
                      name="Points" 
                      stroke="var(--team-primary)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--team-primary)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="apg" 
                      name="Assists" 
                      stroke="var(--team-secondary)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--team-secondary)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rpg" 
                      name="Rebounds" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-medium-contrast">
                  No performance data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shooting Percentages */}
        <Card className="card-readable">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-high-contrast">Shooting Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              {shootingTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shootingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="fg" 
                      name="FG%" 
                      fill="var(--team-primary)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="three" 
                      name="3PT%" 
                      fill="var(--team-secondary)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="ft" 
                      name="FT%" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-medium-contrast">
                  No shooting data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Season & Career Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Season Stats */}
        <Card className="card-readable">
          <CardHeader>
            <CardTitle className="text-lg text-high-contrast">Current Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <StatRow label="Games Played" value={displayStats.gamesPlayed || 0} />
              <StatRow label="Minutes" value={displayStats.minutes || "0.0"} suffix=" MPG" />
              <StatRow label="Points" value={displayStats.ppg || "0.0"} suffix=" PPG" />
              <StatRow label="Assists" value={displayStats.apg || "0.0"} suffix=" APG" />
              <StatRow label="Rebounds" value={displayStats.rpg || "0.0"} suffix=" RPG" />
              <StatRow label="Steals" value={displayStats.spg || "0.0"} suffix=" SPG" />
              <StatRow label="Blocks" value={displayStats.bpg || "0.0"} suffix=" BPG" />
              <StatRow label="Turnovers" value={displayStats.turnovers || "0.0"} suffix=" TPG" />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Metrics */}
        <Card className="card-readable">
          <CardHeader>
            <CardTitle className="text-lg text-high-contrast">Advanced Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <StatRow label="Efficiency Rating" value={performanceMetrics.efficiency || "0.0"} />
              <StatRow label="PER" value={performanceMetrics.per || "0.0"} />
              <StatRow label="Win Shares" value={performanceMetrics.winShares || "0.0"} />
              <StatRow label="Usage Rate" value={performanceMetrics.usageRate || "0.0"} suffix="%" />
              <StatRow label="Assist Ratio" value={performanceMetrics.assistRatio || "0.0"} suffix="%" />
              <StatRow label="Rebound Rate" value={performanceMetrics.reboundRate || "0.0"} suffix="%" />
              <div className="pt-2 mt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-medium-contrast">Overall Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-team-primary">
                      {((performanceMetrics.per || 0) * 4.5).toFixed(1)}
                    </div>
                    <span className="text-xs text-medium-contrast">/ 100</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* No Stats Message */}
      {Object.keys(stats).length === 0 && (
        <Card className="card-readable">
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-medium-contrast mb-2">No Statistics Available</h3>
            <p className="text-low-contrast">Season statistics have not been recorded yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}