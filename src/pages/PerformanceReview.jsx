import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";
import { 
  TrendingUp, TrendingDown, Minus, AlertCircle, ChevronUp, ChevronDown,
  Activity, Target, Users, Calendar, Filter, Download, Share2
} from "lucide-react";
import { Game, GamePerformance, Athlete } from "@/api/entities";
import { format } from "date-fns";
import { calculateBadgesForPerformance } from "@/utils/badges";

// Helper to calculate trends
const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

const TrendIndicator = ({ current, previous, suffix = "" }) => {
  const trend = calculateTrend(current, previous);
  const isPositive = trend > 0;
  const isNeutral = trend == 0;
  
  return (
    <div className="flex items-center gap-1">
      <span className="font-semibold">{current}{suffix}</span>
      {!isNeutral && (
        <span className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
};

export default function PerformanceReview() {
  const [athletes, setAthletes] = useState([]);
  const [games, setGames] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("last5");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareAthletes, setCompareAthletes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load all data
      const [athleteData, gameData, perfData] = await Promise.all([
        Athlete.list(),
        Game.list('-date'),
        GamePerformance.list()
      ]);

      setAthletes(athleteData);
      setGames(gameData);
      setPerformances(perfData);
      
      // Auto-select first athlete
      if (athleteData.length > 0) {
        setSelectedAthlete(athleteData[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter performances based on selected period
  const getFilteredGames = () => {
    let filtered = [...games];
    
    if (selectedPeriod === "last5") {
      filtered = filtered.slice(0, 5);
    } else if (selectedPeriod === "last10") {
      filtered = filtered.slice(0, 10);
    } else if (selectedPeriod === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(g => new Date(g.date) >= oneMonthAgo);
    }
    
    return filtered;
  };

  // Get performance data for an athlete
  const getAthletePerformances = (athleteId) => {
    const filteredGames = getFilteredGames();
    const gameIds = filteredGames.map(g => g.id);
    
    return performances
      .filter(p => p.athlete_id === athleteId && gameIds.includes(p.game_id))
      .map(perf => {
        const game = games.find(g => g.id === perf.game_id);
        return {
          ...perf,
          game,
          date: game?.date,
          opponent: game?.opponent,
          result: game ? (game.team_score > game.opponent_score ? 'W' : 'L') : ''
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Calculate detailed statistics
  const calculateDetailedStats = (perfs) => {
    if (perfs.length === 0) return null;

    const stats = {
      // Basic averages
      ppg: (perfs.reduce((sum, p) => sum + p.points, 0) / perfs.length).toFixed(1),
      rpg: (perfs.reduce((sum, p) => sum + p.rebounds, 0) / perfs.length).toFixed(1),
      apg: (perfs.reduce((sum, p) => sum + p.assists, 0) / perfs.length).toFixed(1),
      spg: (perfs.reduce((sum, p) => sum + p.steals, 0) / perfs.length).toFixed(1),
      bpg: (perfs.reduce((sum, p) => sum + p.blocks, 0) / perfs.length).toFixed(1),
      mpg: (perfs.reduce((sum, p) => sum + p.minutes, 0) / perfs.length).toFixed(1),
      
      // Shooting percentages
      fg_percentage: 0,
      three_percentage: 0,
      ft_percentage: 0,
      
      // Advanced metrics
      efficiency: 0,
      consistency: 0,
      impact: 0,
      
      // Trends (last 3 games vs previous)
      recentTrend: {
        points: 0,
        assists: 0,
        rebounds: 0
      }
    };

    // Calculate shooting percentages
    const totalFGM = perfs.reduce((sum, p) => sum + p.field_goals_made, 0);
    const totalFGA = perfs.reduce((sum, p) => sum + p.field_goals_attempted, 0);
    const total3PM = perfs.reduce((sum, p) => sum + p.three_pointers_made, 0);
    const total3PA = perfs.reduce((sum, p) => sum + p.three_pointers_attempted, 0);
    const totalFTM = perfs.reduce((sum, p) => sum + p.free_throws_made, 0);
    const totalFTA = perfs.reduce((sum, p) => sum + p.free_throws_attempted, 0);

    stats.fg_percentage = totalFGA > 0 ? ((totalFGM / totalFGA) * 100).toFixed(1) : 0;
    stats.three_percentage = total3PA > 0 ? ((total3PM / total3PA) * 100).toFixed(1) : 0;
    stats.ft_percentage = totalFTA > 0 ? ((totalFTM / totalFTA) * 100).toFixed(1) : 0;

    // Calculate efficiency rating
    const totalPoints = perfs.reduce((sum, p) => sum + p.points, 0);
    const totalRebounds = perfs.reduce((sum, p) => sum + p.rebounds, 0);
    const totalAssists = perfs.reduce((sum, p) => sum + p.assists, 0);
    const totalSteals = perfs.reduce((sum, p) => sum + p.steals, 0);
    const totalBlocks = perfs.reduce((sum, p) => sum + p.blocks, 0);
    const totalTurnovers = perfs.reduce((sum, p) => sum + p.turnovers || 0, 0);
    
    stats.efficiency = (
      (totalPoints + totalRebounds + totalAssists + totalSteals + totalBlocks - 
      (totalFGA - totalFGM) - (totalFTA - totalFTM) - totalTurnovers) / perfs.length
    ).toFixed(1);

    // Calculate consistency (standard deviation of points)
    const avgPoints = totalPoints / perfs.length;
    const variance = perfs.reduce((sum, p) => sum + Math.pow(p.points - avgPoints, 2), 0) / perfs.length;
    stats.consistency = (100 - Math.sqrt(variance)).toFixed(1);

    // Calculate recent trends
    if (perfs.length >= 3) {
      const recent = perfs.slice(-3);
      const previous = perfs.slice(0, -3);
      
      if (previous.length > 0) {
        const recentPPG = recent.reduce((sum, p) => sum + p.points, 0) / recent.length;
        const prevPPG = previous.reduce((sum, p) => sum + p.points, 0) / previous.length;
        stats.recentTrend.points = calculateTrend(recentPPG, prevPPG);

        const recentAPG = recent.reduce((sum, p) => sum + p.assists, 0) / recent.length;
        const prevAPG = previous.reduce((sum, p) => sum + p.assists, 0) / previous.length;
        stats.recentTrend.assists = calculateTrend(recentAPG, prevAPG);

        const recentRPG = recent.reduce((sum, p) => sum + p.rebounds, 0) / recent.length;
        const prevRPG = previous.reduce((sum, p) => sum + p.rebounds, 0) / previous.length;
        stats.recentTrend.rebounds = calculateTrend(recentRPG, prevRPG);
      }
    }

    return stats;
  };

  const selectedAthleteData = athletes.find(a => a.id === selectedAthlete);
  const athletePerformances = selectedAthlete ? getAthletePerformances(selectedAthlete) : [];
  const athleteStats = calculateDetailedStats(athletePerformances);

  // Prepare chart data
  const performanceTrendData = athletePerformances.map(perf => ({
    date: format(new Date(perf.date), 'MM/dd'),
    opponent: perf.opponent,
    points: perf.points,
    assists: perf.assists,
    rebounds: perf.rebounds,
    efficiency: (
      perf.points + perf.rebounds + perf.assists + perf.steals + perf.blocks -
      (perf.field_goals_attempted - perf.field_goals_made) -
      (perf.free_throws_attempted - perf.free_throws_made) -
      (perf.turnovers || 0)
    ),
    minutes: perf.minutes
  }));

  const shootingData = athletePerformances.map(perf => ({
    date: format(new Date(perf.date), 'MM/dd'),
    fg: perf.field_goals_attempted > 0 
      ? ((perf.field_goals_made / perf.field_goals_attempted) * 100).toFixed(1) 
      : 0,
    three: perf.three_pointers_attempted > 0
      ? ((perf.three_pointers_made / perf.three_pointers_attempted) * 100).toFixed(1)
      : 0,
    ft: perf.free_throws_attempted > 0
      ? ((perf.free_throws_made / perf.free_throws_attempted) * 100).toFixed(1)
      : 0
  }));

  // Radar chart data for player profile
  const radarData = selectedAthleteData && athleteStats ? [
    {
      category: 'Scoring',
      value: Math.min((parseFloat(athleteStats.ppg) / 30) * 100, 100),
      fullMark: 100
    },
    {
      category: 'Playmaking',
      value: Math.min((parseFloat(athleteStats.apg) / 10) * 100, 100),
      fullMark: 100
    },
    {
      category: 'Rebounding',
      value: Math.min((parseFloat(athleteStats.rpg) / 15) * 100, 100),
      fullMark: 100
    },
    {
      category: 'Defense',
      value: Math.min(((parseFloat(athleteStats.spg) + parseFloat(athleteStats.bpg)) / 5) * 100, 100),
      fullMark: 100
    },
    {
      category: 'Efficiency',
      value: Math.min((parseFloat(athleteStats.efficiency) / 30) * 100, 100),
      fullMark: 100
    },
    {
      category: 'Consistency',
      value: parseFloat(athleteStats.consistency) || 0,
      fullMark: 100
    }
  ] : [];

  // Decision insights
  const getDecisionInsights = () => {
    if (!athleteStats || athletePerformances.length < 3) return [];

    const insights = [];
    
    // Performance trends
    if (parseFloat(athleteStats.recentTrend.points) > 10) {
      insights.push({
        type: 'positive',
        title: 'Scoring Surge',
        message: `Points up ${athleteStats.recentTrend.points}% in last 3 games`,
        action: 'Consider increased offensive role'
      });
    } else if (parseFloat(athleteStats.recentTrend.points) < -10) {
      insights.push({
        type: 'warning',
        title: 'Scoring Slump',
        message: `Points down ${Math.abs(athleteStats.recentTrend.points)}% recently`,
        action: 'Review shot selection and create easier looks'
      });
    }

    // Efficiency analysis
    if (parseFloat(athleteStats.efficiency) > 20) {
      insights.push({
        type: 'positive',
        title: 'High Efficiency',
        message: `${athleteStats.efficiency} efficiency rating (excellent)`,
        action: 'Maintain current role and minutes'
      });
    }

    // Shooting analysis
    if (parseFloat(athleteStats.three_percentage) > 38) {
      insights.push({
        type: 'positive',
        title: 'Elite Shooting',
        message: `${athleteStats.three_percentage}% from three-point range`,
        action: 'Run more plays for three-point opportunities'
      });
    }

    // Consistency check
    if (parseFloat(athleteStats.consistency) < 70) {
      insights.push({
        type: 'warning',
        title: 'Inconsistent Performance',
        message: 'High variance in game-to-game production',
        action: 'Focus on routine and mental preparation'
      });
    }

    // Minutes and fatigue
    if (parseFloat(athleteStats.mpg) > 35) {
      insights.push({
        type: 'caution',
        title: 'Heavy Minutes Load',
        message: `Averaging ${athleteStats.mpg} minutes per game`,
        action: 'Monitor fatigue and consider strategic rest'
      });
    }

    return insights;
  };

  const insights = getDecisionInsights();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading performance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Performance Review Dashboard</h1>
          <p className="text-medium-contrast">Analyze player performance trends and make data-driven decisions</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last5">Last 5 Games</SelectItem>
              <SelectItem value="last10">Last 10 Games</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="season">Full Season</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Athlete Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Select Player:</Label>
            <Select value={selectedAthlete} onValueChange={setSelectedAthlete}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose a player" />
              </SelectTrigger>
              <SelectContent>
                {athletes.map(athlete => (
                  <SelectItem key={athlete.id} value={athlete.id}>
                    {athlete.name} - #{athlete.jersey_number} {athlete.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComparisonMode(!comparisonMode)}
              className="ml-auto"
            >
              {comparisonMode ? 'Exit Comparison' : 'Compare Players'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedAthleteData && athleteStats && (
        <>
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-medium-contrast mb-1">Points</div>
                <TrendIndicator 
                  current={athleteStats.ppg} 
                  previous={athletePerformances[athletePerformances.length - 2]?.points}
                  suffix=" PPG"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-medium-contrast mb-1">Assists</div>
                <TrendIndicator 
                  current={athleteStats.apg} 
                  previous={athletePerformances[athletePerformances.length - 2]?.assists}
                  suffix=" APG"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-medium-contrast mb-1">Rebounds</div>
                <TrendIndicator 
                  current={athleteStats.rpg} 
                  previous={athletePerformances[athletePerformances.length - 2]?.rebounds}
                  suffix=" RPG"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-medium-contrast mb-1">FG%</div>
                <div className="font-semibold">{athleteStats.fg_percentage}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-medium-contrast mb-1">Efficiency</div>
                <div className="font-semibold">{athleteStats.efficiency}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-medium-contrast mb-1">Minutes</div>
                <div className="font-semibold">{athleteStats.mpg} MPG</div>
              </CardContent>
            </Card>
          </div>

          {/* Decision Insights */}
          {insights.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Coaching Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {insights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                      insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="font-medium text-sm mb-1">{insight.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{insight.message}</div>
                      <div className="text-xs font-medium text-gray-700">
                        → {insight.action}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Charts */}
          <Tabs defaultValue="trends" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Performance Trends</TabsTrigger>
              <TabsTrigger value="shooting">Shooting Analysis</TabsTrigger>
              <TabsTrigger value="profile">Player Profile</TabsTrigger>
              <TabsTrigger value="games">Game Log</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={2} name="Points" />
                        <Line type="monotone" dataKey="assists" stroke="#10b981" strokeWidth={2} name="Assists" />
                        <Line type="monotone" dataKey="rebounds" stroke="#f59e0b" strokeWidth={2} name="Rebounds" />
                        <Line type="monotone" dataKey="efficiency" stroke="#8b5cf6" strokeWidth={2} name="Efficiency" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Minutes & Workload Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="minutes" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Minutes" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shooting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shooting Percentage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shootingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Bar dataKey="fg" fill="#3b82f6" name="FG%" />
                        <Bar dataKey="three" fill="#10b981" name="3PT%" />
                        <Bar dataKey="ft" fill="#f59e0b" name="FT%" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Field Goal Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Overall FG%</span>
                        <span className="font-bold">{athleteStats.fg_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3PT%</span>
                        <span className="font-bold">{athleteStats.three_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FT%</span>
                        <span className="font-bold">{athleteStats.ft_percentage}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shot Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>FGA/Game</span>
                        <span className="font-bold">
                          {(athletePerformances.reduce((sum, p) => sum + p.field_goals_attempted, 0) / athletePerformances.length).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>3PA/Game</span>
                        <span className="font-bold">
                          {(athletePerformances.reduce((sum, p) => sum + p.three_pointers_attempted, 0) / athletePerformances.length).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>FTA/Game</span>
                        <span className="font-bold">
                          {(athletePerformances.reduce((sum, p) => sum + p.free_throws_attempted, 0) / athletePerformances.length).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shooting Zones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Points in Paint</span>
                        <span className="font-bold">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mid-Range</span>
                        <span className="font-bold">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beyond Arc</span>
                        <span className="font-bold">35%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Player Performance Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name={selectedAthleteData.name} dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Efficiency Rating</span>
                          <span className="text-sm font-bold">{athleteStats.efficiency}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((athleteStats.efficiency / 30) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Consistency Score</span>
                          <span className="text-sm font-bold">{athleteStats.consistency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${athleteStats.consistency}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Strengths</h4>
                        <div className="flex flex-wrap gap-1">
                          {parseFloat(athleteStats.ppg) > 15 && <Badge variant="outline" className="text-xs">Scorer</Badge>}
                          {parseFloat(athleteStats.apg) > 5 && <Badge variant="outline" className="text-xs">Playmaker</Badge>}
                          {parseFloat(athleteStats.rpg) > 7 && <Badge variant="outline" className="text-xs">Rebounder</Badge>}
                          {parseFloat(athleteStats.three_percentage) > 35 && <Badge variant="outline" className="text-xs">Shooter</Badge>}
                          {parseFloat(athleteStats.efficiency) > 20 && <Badge variant="outline" className="text-xs">Efficient</Badge>}
                        </div>
                      </div>

                      <div className="pt-2">
                        <h4 className="font-medium mb-2">Areas for Development</h4>
                        <div className="flex flex-wrap gap-1">
                          {parseFloat(athleteStats.ft_percentage) < 70 && <Badge variant="outline" className="text-xs text-orange-600">Free Throws</Badge>}
                          {parseFloat(athleteStats.consistency) < 75 && <Badge variant="outline" className="text-xs text-orange-600">Consistency</Badge>}
                          {athletePerformances.length > 0 && athletePerformances[0].turnovers > 3 && <Badge variant="outline" className="text-xs text-orange-600">Ball Security</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="games">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Game Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Opponent</th>
                          <th className="text-center p-2">Result</th>
                          <th className="text-center p-2">MIN</th>
                          <th className="text-center p-2">PTS</th>
                          <th className="text-center p-2">REB</th>
                          <th className="text-center p-2">AST</th>
                          <th className="text-center p-2">FG</th>
                          <th className="text-center p-2">3PT</th>
                          <th className="text-center p-2">FT</th>
                          <th className="text-center p-2">+/-</th>
                          <th className="text-center p-2">Badges</th>
                        </tr>
                      </thead>
                      <tbody>
                        {athletePerformances.map((perf, index) => {
                          const badges = calculateBadgesForPerformance(perf, perf.game);
                          return (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2">{format(new Date(perf.date), 'MM/dd')}</td>
                              <td className="p-2">{perf.opponent}</td>
                              <td className="p-2 text-center">
                                <Badge className={perf.result === 'W' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {perf.result}
                                </Badge>
                              </td>
                              <td className="p-2 text-center">{perf.minutes}</td>
                              <td className="p-2 text-center font-bold">{perf.points}</td>
                              <td className="p-2 text-center">{perf.rebounds}</td>
                              <td className="p-2 text-center">{perf.assists}</td>
                              <td className="p-2 text-center text-xs">
                                {perf.field_goals_made}-{perf.field_goals_attempted}
                              </td>
                              <td className="p-2 text-center text-xs">
                                {perf.three_pointers_made}-{perf.three_pointers_attempted}
                              </td>
                              <td className="p-2 text-center text-xs">
                                {perf.free_throws_made}-{perf.free_throws_attempted}
                              </td>
                              <td className="p-2 text-center">
                                {perf.plus_minus || '--'}
                              </td>
                              <td className="p-2 text-center">
                                {badges.length > 0 && (
                                  <div className="flex gap-1 justify-center">
                                    {badges.slice(0, 2).map((badge, i) => (
                                      <span key={i} className="text-lg" title={badge.name}>
                                        {badge.icon}
                                      </span>
                                    ))}
                                    {badges.length > 2 && (
                                      <span className="text-xs text-gray-500">+{badges.length - 2}</span>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}