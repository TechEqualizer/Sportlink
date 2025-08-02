import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function PlayerStatisticsTab({ athlete }) {
  const stats = athlete.season_stats || {};
  
  const chartData = Object.entries(stats).map(([key, value]) => ({
    name: key.replace(" per Game", "").replace(" %", "%"),
    value: parseFloat(value) || 0,
    fullName: key
  }));

  const keyStats = [
    { label: "Points per Game", value: stats["Points per Game"] || 0, color: "text-blue-600" },
    { label: "Rebounds per Game", value: stats["Rebounds per Game"] || 0, color: "text-green-600" },
    { label: "Assists per Game", value: stats["Assists per Game"] || 0, color: "text-purple-600" },
    { label: "Field Goal %", value: stats["Field Goal %"] || 0, color: "text-orange-600", isPercentage: true },
  ];

  const additionalStats = [
    { label: "3-Point %", value: stats["3-Point %"] || 0, isPercentage: true },
    { label: "Free Throw %", value: stats["Free Throw %"] || 0, isPercentage: true },
    { label: "Steals per Game", value: stats["Steals per Game"] || 0 },
    { label: "Blocks per Game", value: stats["Blocks per Game"] || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {keyStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {typeof stat.value === 'number' ? 
                  (stat.isPercentage ? `${stat.value.toFixed(1)}%` : stat.value.toFixed(1)) : 
                  stat.value
                }
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Season Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      typeof value === 'number' ? value.toFixed(1) : value,
                      props.payload.fullName
                    ]}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold text-gray-800 mb-1">
                  {typeof stat.value === 'number' ? 
                    (stat.isPercentage ? `${stat.value.toFixed(1)}%` : stat.value.toFixed(1)) : 
                    stat.value
                  }
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      {Object.keys(stats).length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No Statistics Available</h3>
            <p className="text-gray-400">Season statistics have not been recorded yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}