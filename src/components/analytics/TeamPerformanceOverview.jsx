import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Target,
  Home,
  MapPin,
  Calendar,
  Award
} from "lucide-react";
import { mockTeamMetrics } from "@/api/mockPerformanceData";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function TeamPerformanceOverview() {
  const teamData = mockTeamMetrics;

  const winPercentage = (teamData.overallRecord.wins / (teamData.overallRecord.wins + teamData.overallRecord.losses) * 100).toFixed(1);
  const confWinPercentage = (teamData.conferenceRecord.wins / (teamData.conferenceRecord.wins + teamData.conferenceRecord.losses) * 100).toFixed(1);

  // Prepare chart data
  const monthlyData = teamData.monthlyProgress.map(month => ({
    ...month,
    winPercentage: (month.wins / (month.wins + month.losses) * 100).toFixed(1),
    pointDifferential: month.ppg - month.papg
  }));

  const gameTypeData = Object.entries(teamData.performanceByType).map(([type, stats]) => ({
    name: type,
    wins: stats.wins,
    losses: stats.losses,
    winPercentage: (stats.wins / (stats.wins + stats.losses) * 100).toFixed(1),
    ppg: stats.ppg
  }));

  const badgeCategoryData = Object.entries(teamData.teamBadges.byCategory).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count
  }));

  return (
    <div className="space-y-6">
      {/* Team Record Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Record</p>
                <p className="text-2xl font-bold">
                  {teamData.overallRecord.wins}-{teamData.overallRecord.losses}
                </p>
                <p className="text-xs text-green-600">{winPercentage}% Win Rate</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conference</p>
                <p className="text-2xl font-bold">
                  {teamData.conferenceRecord.wins}-{teamData.conferenceRecord.losses}
                </p>
                <p className="text-xs text-green-600">{confWinPercentage}% Win Rate</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Home Record</p>
                <p className="text-2xl font-bold">
                  {teamData.homeRecord.wins}-{teamData.homeRecord.losses}
                </p>
                <p className="text-xs text-blue-600">Strong Home Court</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Badges</p>
                <p className="text-2xl font-bold">{teamData.teamBadges.totalEarned}</p>
                <p className="text-xs text-orange-600">Across All Players</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="ppg" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Points For"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="papg" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Points Against"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="winPercentage" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Win %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Badge Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Team Badge Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={badgeCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {badgeCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-green-700">Team Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamData.strengthsWeaknesses.strengths.map((strength, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-900">{strength.area}</div>
                    <div className="text-sm text-green-700">{strength.rank}</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">{strength.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-700">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamData.strengthsWeaknesses.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium text-orange-900">{weakness.area}</div>
                    <div className="text-sm text-orange-700">{weakness.rank}</div>
                  </div>
                  <div className="text-lg font-bold text-orange-600">{weakness.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Top Badge Earners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamData.teamBadges.topPerformers.map((performer, index) => (
              <div key={index} className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-900">{performer.playerName}</div>
                <div className="text-2xl font-bold text-yellow-600">{performer.badges}</div>
                <div className="text-sm text-yellow-700">Badges Earned</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}