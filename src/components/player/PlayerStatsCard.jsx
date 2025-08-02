import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlayerStatsCard({ athlete }) {
  const stats = athlete.season_stats || {};
  
  const displayStats = [
    { label: "Points", value: stats["Points per Game"] || "0.0", key: "points" },
    { label: "Assists", value: stats["Assists per Game"] || "0.0", key: "assists" }, 
    { label: "Rebounds", value: stats["Rebounds per Game"] || "0.0", key: "rebounds" },
    { label: "Steals", value: stats["Steals per Game"] || "0.0", key: "steals" }
  ];

  const statColors = {
    points: "text-blue-600",
    assists: "text-green-600", 
    rebounds: "text-purple-600",
    steals: "text-orange-600"
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Season Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayStats.map((stat) => (
          <div key={stat.key} className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">{stat.label}</span>
            <span className={`text-xl font-bold ${statColors[stat.key]}`}>
              {typeof stat.value === 'number' ? stat.value.toFixed(1) : stat.value}
            </span>
          </div>
        ))}
        
        {/* Additional stats if available */}
        {stats["Field Goal %"] && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Field Goal %</span>
              <span className="text-lg font-semibold text-gray-800">
                {typeof stats["Field Goal %"] === 'number' ? `${stats["Field Goal %"].toFixed(1)}%` : stats["Field Goal %"]}
              </span>
            </div>
          </div>
        )}
        
        {stats["3-Point %"] && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">3-Point %</span>
            <span className="text-lg font-semibold text-gray-800">
              {typeof stats["3-Point %"] === 'number' ? `${stats["3-Point %"].toFixed(1)}%` : stats["3-Point %"]}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}