import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockSeasonStats, mockPerformanceData } from "@/api/mockData";

const StatRow = ({ label, value, suffix = "" }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-medium-contrast text-sm md:text-base">{label}</span>
    <span className="font-semibold text-high-contrast">{value}{suffix}</span>
  </div>
);

const GameRow = ({ game }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 text-sm">
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

export default function StatsSection({ athlete }) {
  const stats = mockSeasonStats[athlete.id] || {};
  const performanceData = mockPerformanceData[athlete.id] || {};
  
  const currentSeason = stats.currentSeason || {};
  const careerAverages = stats.careerAverages || {};
  const recentGames = stats.recentGames || [];
  const performanceMetrics = stats.performanceMetrics || {};
  const monthlyAverages = performanceData.monthlyAverages || [];
  const shootingTrends = performanceData.shootingTrends || [];

  return (
    <div className="space-y-6">
      {/* Season Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Current Season */}
        <Card className="card-readable">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl text-high-contrast">Current Season</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <StatRow label="Games Played" value={currentSeason.gamesPlayed || 0} />
            <StatRow label="Points" value={currentSeason.ppg || "0.0"} suffix=" PPG" />
            <StatRow label="Assists" value={currentSeason.apg || "0.0"} suffix=" APG" />
            <StatRow label="Rebounds" value={currentSeason.rpg || "0.0"} suffix=" RPG" />
            <StatRow label="Steals" value={currentSeason.spg || "0.0"} suffix=" SPG" />
            <StatRow label="FG%" value={currentSeason.fg_percentage || "0.0"} suffix="%" />
            <StatRow label="3PT%" value={currentSeason.three_percentage || "0.0"} suffix="%" />
            <StatRow label="FT%" value={currentSeason.ft_percentage || "0.0"} suffix="%" />
          </CardContent>
        </Card>

        {/* Career Averages */}
        <Card className="card-readable">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl text-high-contrast">Career Averages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <StatRow label="Points" value={careerAverages.ppg || "0.0"} suffix=" PPG" />
            <StatRow label="Assists" value={careerAverages.apg || "0.0"} suffix=" APG" />
            <StatRow label="Rebounds" value={careerAverages.rpg || "0.0"} suffix=" RPG" />
            <StatRow label="Steals" value={careerAverages.spg || "0.0"} suffix=" SPG" />
            <StatRow label="FG%" value={careerAverages.fg_percentage || "0.0"} suffix="%" />
            <StatRow label="3PT%" value={careerAverages.three_percentage || "0.0"} suffix="%" />
            <StatRow label="FT%" value={careerAverages.ft_percentage || "0.0"} suffix="%" />
          </CardContent>
        </Card>

        {/* Advanced Metrics */}
        <Card className="card-readable">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl text-high-contrast">Advanced Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <StatRow label="Efficiency" value={performanceMetrics.efficiency || "0.0"} />
            <StatRow label="PER" value={performanceMetrics.per || "0.0"} />
            <StatRow label="Win Shares" value={performanceMetrics.winShares || "0.0"} />
            <StatRow label="Usage Rate" value={performanceMetrics.usageRate || "0.0"} suffix="%" />
            <StatRow label="Assist Ratio" value={performanceMetrics.assistRatio || "0.0"} suffix="%" />
            <StatRow label="Rebound Rate" value={performanceMetrics.reboundRate || "0.0"} suffix="%" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Games */}
      <Card className="card-readable">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl text-high-contrast">Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGames.length > 0 ? (
            <div className="space-y-2">
              {recentGames.map((game, index) => (
                <GameRow key={index} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-medium-contrast text-center py-8">No recent games recorded.</p>
          )}
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Monthly Averages Chart */}
        <Card className="card-readable">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl text-high-contrast">Performance Trends</CardTitle>
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

        {/* Shooting Percentages Chart */}
        <Card className="card-readable">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl text-high-contrast">Shooting Trends</CardTitle>
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
    </div>
  );
}