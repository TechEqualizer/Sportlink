import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Cell, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Target, Trophy } from "lucide-react";
import { Game, GamePerformance, Benchmark } from "@/api/entities";
import { format } from "date-fns";
import { calculateBadgesForPerformance } from "@/utils/badges";

// Custom tooltip component
const BenchmarkTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <div className="text-white font-medium mb-1">{data.opponent}</div>
        <div className="text-slate-300 text-sm mb-2">{data.date}</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-300">Actual:</span>
            <span className={`font-bold ${data.actual >= data.target ? 'text-green-400' : 'text-red-400'}`}>
              {data.actual}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-300">Target:</span>
            <span className="text-yellow-400 font-bold">{data.target}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-300">Difference:</span>
            <span className={`font-bold ${data.difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.difference >= 0 ? '+' : ''}{data.difference}
            </span>
          </div>
        </div>
        {data.badges && data.badges.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-600">
            <div className="text-xs text-slate-300 mb-1">Badges Earned:</div>
            <div className="flex gap-1">
              {data.badges.slice(0, 3).map((badge, index) => (
                <span key={index} className="text-sm" title={badge.name}>
                  {badge.icon}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function PlayerBenchmarkBar({ 
  playerId, 
  statType = "points", 
  filters = {}, 
  className = "" 
}) {
  const [chartData, setChartData] = useState([]);
  const [benchmark, setBenchmark] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hitRate, setHitRate] = useState(0);
  const [avgActual, setAvgActual] = useState(0);

  useEffect(() => {
    if (playerId) {
      loadChartData();
    }
  }, [playerId, statType, filters]);

  const loadChartData = async () => {
    setIsLoading(true);
    try {
      // Load player benchmarks
      const benchmarks = await Benchmark.getByPlayer(playerId);
      const playerBenchmark = benchmarks.find(b => b.stat_type === statType && b.active);
      setBenchmark(playerBenchmark);

      if (!playerBenchmark) {
        setChartData([]);
        setIsLoading(false);
        return;
      }

      // Load games and performances
      const [games, performances] = await Promise.all([
        Game.list('-date'),
        GamePerformance.getByAthlete(playerId)
      ]);

      // Filter games based on filters
      let filteredGames = games;
      if (filters.period === "last5") {
        filteredGames = games.slice(0, 5);
      } else if (filters.period === "last10") {
        filteredGames = games.slice(0, 10);
      }

      if (filters.location && filters.location !== "all") {
        filteredGames = filteredGames.filter(g => 
          g.location?.toLowerCase() === filters.location
        );
      }

      if (filters.result && filters.result !== "all") {
        filteredGames = filteredGames.filter(g => {
          const won = g.team_score > g.opponent_score;
          return filters.result === "win" ? won : !won;
        });
      }

      // Combine game and performance data
      const gamePerformanceData = filteredGames.map(game => {
        const performance = performances.find(p => p.game_id === game.id);
        if (!performance) return null;

        const actualValue = performance[statType] || 0;
        const targetValue = playerBenchmark.target_value;
        const difference = actualValue - targetValue;
        const hit = actualValue >= targetValue;

        // Calculate badges for this game
        const badges = calculateBadgesForPerformance(performance, game);

        return {
          gameId: game.id,
          opponent: game.opponent,
          date: format(new Date(game.date), 'MM/dd'),
          fullDate: format(new Date(game.date), 'MMM dd'),
          actual: actualValue,
          target: targetValue,
          difference: difference,
          hit: hit,
          result: game.team_score > game.opponent_score ? 'W' : 'L',
          teamScore: game.team_score,
          opponentScore: game.opponent_score,
          badges: badges,
          // Bar color based on performance
          fill: hit ? '#10b981' : '#ef4444' // green for hit, red for miss
        };
      }).filter(Boolean).reverse(); // Reverse to show chronological order

      setChartData(gamePerformanceData);

      // Calculate hit rate and average
      if (gamePerformanceData.length > 0) {
        const hits = gamePerformanceData.filter(d => d.hit).length;
        const rate = (hits / gamePerformanceData.length * 100).toFixed(0);
        setHitRate(rate);

        const avgValue = gamePerformanceData.reduce((sum, d) => sum + d.actual, 0) / gamePerformanceData.length;
        setAvgActual(avgValue.toFixed(1));
      }

    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatLabel = (statType) => {
    const labels = {
      points: "Points",
      assists: "Assists", 
      rebounds: "Rebounds",
      three_pointers_made: "3-Pointers Made",
      steals: "Steals",
      blocks: "Blocks"
    };
    return labels[statType] || statType;
  };

  if (isLoading) {
    return (
      <Card className={`bg-slate-900 border-slate-700 ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!benchmark) {
    return (
      <Card className={`bg-slate-900 border-slate-700 ${className}`}>
        <CardContent className="p-6 text-center">
          <Target className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300">No benchmark set for {getStatLabel(statType)}</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className={`bg-slate-900 border-slate-700 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-slate-300">No game data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-slate-900 border-slate-700 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            {getStatLabel(statType)} Performance
          </CardTitle>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Hit Rate</div>
              <div className={`text-lg font-bold ${hitRate >= 60 ? 'text-green-400' : hitRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {hitRate}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Avg Actual</div>
              <div className="text-lg font-bold text-white">
                {avgActual}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Target</div>
              <div className="text-lg font-bold text-yellow-400">
                {benchmark.target_value}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip content={<BenchmarkTooltip />} />
              
              {/* Target line */}
              <ReferenceLine 
                y={benchmark.target_value} 
                stroke="#fbbf24" 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ 
                  value: `Target: ${benchmark.target_value}`, 
                  position: "topLeft",
                  fill: "#fbbf24",
                  fontSize: 12
                }}
              />
              
              <Bar 
                dataKey="actual" 
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Game Results Summary */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-300">Hit Target ({chartData.filter(d => d.hit).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-300">Missed Target ({chartData.filter(d => !d.hit).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-slate-300">Target Line</span>
          </div>
        </div>

        {/* Recent Streak */}
        {chartData.length >= 3 && (
          <div className="mt-4 text-center">
            <div className="text-xs text-slate-400 mb-1">Recent Form (Last 3 Games)</div>
            <div className="flex items-center justify-center gap-1">
              {chartData.slice(-3).map((game, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className={`text-xs ${
                    game.hit 
                      ? 'bg-green-900/30 text-green-400 border-green-400/30' 
                      : 'bg-red-900/30 text-red-400 border-red-400/30'
                  }`}
                >
                  {game.hit ? '✓' : '✗'}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}