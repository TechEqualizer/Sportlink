
import React, { useState, useEffect } from "react";
import { Athlete } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Users, Trophy, Target, Activity, Award } from "lucide-react";
import { mockTeamStats, mockSeasonStats } from "@/api/mockData";

export default function StatisticsPage() {
  const [athletes, setAthletes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await Athlete.list("-created_date");
      setAthletes(data || []);
    } catch (error) {
      console.error("Error loading athletes:", error);
      setError("Failed to load statistics. Please try again.");
      setAthletes([]);
    }
    setIsLoading(false);
  };

  const positionData = athletes.reduce((acc, athlete) => {
    const position = athlete.position || "Unknown";
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});

  const positionChartData = Object.entries(positionData).map(([position, count]) => ({
    name: position,
    value: count
  }));

  const recruitingData = athletes.reduce((acc, athlete) => {
    const status = athlete.recruiting_status || "Open";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const recruitingChartData = Object.entries(recruitingData).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const classData = athletes.reduce((acc, athlete) => {
    const year = athlete.class_year || "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const classChartData = Object.entries(classData).map(([year, count]) => ({
    name: year,
    value: count
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Calculate player averages from mock stats
  const playerStats = athletes.map(athlete => {
    const stats = mockSeasonStats[athlete.id];
    return {
      name: athlete.name,
      ppg: stats?.currentSeason?.ppg || 0,
      apg: stats?.currentSeason?.apg || 0,
      rpg: stats?.currentSeason?.rpg || 0,
      fg: stats?.currentSeason?.fg_percentage || 0
    };
  }).sort((a, b) => b.ppg - a.ppg);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <CardContent>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-700">Error Loading Statistics</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadAthletes}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-high-contrast">Team Statistics</h1>
        <p className="text-medium-contrast mt-1 text-sm md:text-base">Comprehensive overview of team composition and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Athletes</p>
                <p className="text-3xl font-bold text-gray-900">{athletes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open for Recruiting</p>
                <p className="text-3xl font-bold text-green-600">{recruitingData.Open || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Committed</p>
                <p className="text-3xl font-bold text-blue-600">{recruitingData.Committed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average GPA</p>
                <p className="text-3xl font-bold text-purple-600">
                  {athletes.length > 0 ? 
                    (athletes.reduce((sum, a) => sum + (a.gpa || 0), 0) / athletes.length).toFixed(1) : 
                    "0.0"
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {athletes.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
            <p className="text-gray-600">Add some athletes to see team statistics.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Players by Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={positionChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruiting Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={recruitingChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {recruitingChartData.map((entry, index) => (
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

          {/* Class Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Class Year Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance Section */}
          <div className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-high-contrast mb-6">Team Performance</h2>
            
            {/* Team Record Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="card-readable">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-medium-contrast">Season Record</p>
                      <p className="text-2xl md:text-3xl font-bold text-high-contrast">
                        {mockTeamStats.teamRecord.wins}-{mockTeamStats.teamRecord.losses}
                      </p>
                      <p className="text-xs text-medium-contrast mt-1">
                        Win Rate: {((mockTeamStats.teamRecord.wins / (mockTeamStats.teamRecord.wins + mockTeamStats.teamRecord.losses)) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-readable">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-medium-contrast">Conference</p>
                      <p className="text-2xl md:text-3xl font-bold text-high-contrast">
                        {mockTeamStats.conference.wins}-{mockTeamStats.conference.losses}
                      </p>
                      <p className="text-xs text-medium-contrast mt-1">1st in Conference</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-readable">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-medium-contrast">Rankings</p>
                      <p className="text-2xl md:text-3xl font-bold text-high-contrast">
                        #{mockTeamStats.rankings.state}
                      </p>
                      <p className="text-xs text-medium-contrast mt-1">State Ranking</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-readable">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-medium-contrast">Current Streak</p>
                      <p className="text-2xl md:text-3xl font-bold text-green-600">
                        {mockTeamStats.streaks.current}
                      </p>
                      <p className="text-xs text-medium-contrast mt-1">Best: {mockTeamStats.streaks.best}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Stats and Player Leaders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Averages */}
              <Card className="card-readable">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-high-contrast">Team Averages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-medium-contrast">Points Per Game</span>
                      <span className="font-bold text-high-contrast text-lg">{mockTeamStats.teamAverages.ppg}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-medium-contrast">Points Allowed</span>
                      <span className="font-bold text-high-contrast text-lg">{mockTeamStats.teamAverages.papg}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-medium-contrast">Rebounds Per Game</span>
                      <span className="font-bold text-high-contrast text-lg">{mockTeamStats.teamAverages.rpg}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-medium-contrast">Assists Per Game</span>
                      <span className="font-bold text-high-contrast text-lg">{mockTeamStats.teamAverages.apg}</span>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-medium-contrast">FG%</p>
                          <p className="font-bold text-high-contrast">{mockTeamStats.teamAverages.fg_percentage}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-medium-contrast">3PT%</p>
                          <p className="font-bold text-high-contrast">{mockTeamStats.teamAverages.three_percentage}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-medium-contrast">FT%</p>
                          <p className="font-bold text-high-contrast">{mockTeamStats.teamAverages.ft_percentage}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Player Leaders */}
              <Card className="card-readable">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-high-contrast">Statistical Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  {playerStats.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={playerStats.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <XAxis 
                            dataKey="name" 
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
                          <Bar dataKey="ppg" name="PPG" fill="var(--team-primary)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="apg" name="APG" fill="var(--team-secondary)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="rpg" name="RPG" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-medium-contrast">
                      No player statistics available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
