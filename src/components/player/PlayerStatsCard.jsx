import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSeasonStats } from "@/api/mockData";

export default function PlayerStatsCard({ athlete }) {
  const stats = mockSeasonStats[athlete.id] || {};
  const currentSeason = stats.currentSeason || {};
  
  const displayStats = [
    { label: "Points", value: currentSeason.ppg || "0.0", key: "points" },
    { label: "Assists", value: currentSeason.apg || "0.0", key: "assists" }, 
    { label: "Rebounds", value: currentSeason.rpg || "0.0", key: "rebounds" },
    { label: "Steals", value: currentSeason.spg || "0.0", key: "steals" }
  ];

  const statColors = {
    points: "text-blue-600",
    assists: "text-green-600", 
    rebounds: "text-purple-600",
    steals: "text-orange-600"
  };

  return (
    <Card className="card-readable">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-high-contrast">Season Stats</CardTitle>
        <p className="text-xs text-medium-contrast">
          {currentSeason.gamesPlayed || 0} games played
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayStats.map((stat) => (
          <div key={stat.key} className="flex justify-between items-center">
            <span className="text-medium-contrast text-sm">{stat.label}</span>
            <span className={`text-xl font-bold ${statColors[stat.key]}`}>
              {typeof stat.value === 'number' ? stat.value.toFixed(1) : stat.value}
            </span>
          </div>
        ))}
        
        {/* Shooting percentages */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-medium-contrast text-sm">Field Goal %</span>
            <span className="text-lg font-semibold text-high-contrast">
              {currentSeason.fg_percentage || "0.0"}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-medium-contrast text-sm">3-Point %</span>
            <span className="text-lg font-semibold text-high-contrast">
              {currentSeason.three_percentage || "0.0"}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-medium-contrast text-sm">Free Throw %</span>
            <span className="text-lg font-semibold text-high-contrast">
              {currentSeason.ft_percentage || "0.0"}%
            </span>
          </div>
        </div>

        {/* Performance Rating */}
        {stats.performanceMetrics && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-medium-contrast text-sm font-medium">PER Rating</span>
              <span className="text-lg font-bold text-team-primary">
                {stats.performanceMetrics.per || "0.0"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}