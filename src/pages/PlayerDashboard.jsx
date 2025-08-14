import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, User, TrendingUp, Settings2, BarChart3, Trophy } from "lucide-react";
import { Users } from "lucide-react";
import { Athlete, Benchmark } from "@/api/entities";
import { loadSampleBenchmarks } from "@/api/sampleBenchmarks";
import { loadMockPerformanceData } from "@/api/mockPerformanceData";
import BenchmarkSetter from "@/components/analytics/BenchmarkSetter";
import PlayerBenchmarkBar from "@/components/analytics/PlayerBenchmarkBar";
import QuickFilters from "@/components/analytics/QuickFilters";
import BadgeShowcase from "@/components/analytics/BadgeShowcase";
import PlayerBadgeStats from "@/components/analytics/PlayerBadgeStats";
import PerformanceInsights from "@/components/analytics/PerformanceInsights";
import TeamPerformanceOverview from "@/components/analytics/TeamPerformanceOverview";

const STAT_TYPES = [
  { value: "points", label: "Points", suffix: "PPG" },
  { value: "assists", label: "Assists", suffix: "APG" },
  { value: "rebounds", label: "Rebounds", suffix: "RPG" },
  { value: "three_pointers_made", label: "Three-Pointers", suffix: "3PM" },
  { value: "steals", label: "Steals", suffix: "SPG" },
  { value: "blocks", label: "Blocks", suffix: "BPG" }
];

export default function PlayerDashboard() {
  const [athletes, setAthletes] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [selectedStatType, setSelectedStatType] = useState("points");
  const [filters, setFilters] = useState({
    period: "all",
    location: "all",
    result: "all"
  });
  const [playerBenchmarks, setPlayerBenchmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (selectedPlayerId) {
      loadPlayerBenchmarks();
    }
  }, [selectedPlayerId]);

  const initializePage = async () => {
    try {
      // Load sample benchmarks into localStorage if not present
      loadSampleBenchmarks();
      
      // Load mock performance data
      loadMockPerformanceData();
      
      // Load athletes
      const athleteData = await Athlete.list();
      setAthletes(athleteData);
      
      // Auto-select first athlete if available
      if (athleteData.length > 0) {
        setSelectedPlayerId(athleteData[0].id);
      }
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlayerBenchmarks = async () => {
    try {
      const benchmarks = await Benchmark.getByPlayer(selectedPlayerId);
      setPlayerBenchmarks(benchmarks);
      
      // Auto-select first benchmark stat type if available
      if (benchmarks.length > 0) {
        setSelectedStatType(benchmarks[0].stat_type);
      }
    } catch (error) {
      console.error("Error loading player benchmarks:", error);
    }
  };

  const handleBenchmarkUpdate = () => {
    loadPlayerBenchmarks();
  };

  const selectedPlayer = athletes.find(a => a.id === selectedPlayerId);
  const availableStats = playerBenchmarks.map(b => b.stat_type);
  const hasActiveBenchmarks = playerBenchmarks.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-800 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 bg-slate-800 rounded"></div>
              <div className="lg:col-span-2 h-96 bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Player Performance Dashboard</h1>
                <p className="text-gray-600">Target-based performance tracking and analytics</p>
              </div>
            </div>
            
            {selectedPlayer && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{selectedPlayer.name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedPlayer.position} • Class of {selectedPlayer.class_year}
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Player Selection */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Player & Stats Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Player</label>
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a player..." />
                    </SelectTrigger>
                    <SelectContent>
                      {athletes.map(athlete => (
                        <SelectItem 
                          key={athlete.id} 
                          value={athlete.id}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{athlete.name}</span>
                            <span className="text-gray-500 ml-2">{athlete.position}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Statistic</label>
                  <Select 
                    value={selectedStatType} 
                    onValueChange={setSelectedStatType}
                    disabled={!hasActiveBenchmarks}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stat type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {STAT_TYPES.map(stat => (
                        <SelectItem 
                          key={stat.value} 
                          value={stat.value}
                          disabled={!availableStats.includes(stat.value)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{stat.label}</span>
                            <span className="text-gray-500 ml-2">{stat.suffix}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!hasActiveBenchmarks && (
                    <p className="text-xs text-gray-500">Set benchmarks first to enable stat selection</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Dashboard
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="insights">
              <TrendingUp className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="w-4 h-4 mr-2" />
              Team Overview
            </TabsTrigger>
            <TabsTrigger value="benchmarks">
              <Settings2 className="w-4 h-4 mr-2" />
              Benchmark Settings
            </TabsTrigger>
          </TabsList>

          {/* Performance Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {!selectedPlayerId ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 text-lg">Select a player to view performance dashboard</p>
                </CardContent>
              </Card>
            ) : !hasActiveBenchmarks ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 text-lg mb-2">No benchmarks set for {selectedPlayer?.name}</p>
                  <p className="text-gray-500 mb-4">Create benchmarks in the settings tab to start tracking performance</p>
                  <Button 
                    onClick={() => document.querySelector('[data-state="inactive"]').click()}
                  >
                    Set Benchmarks
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="xl:col-span-1">
                  <QuickFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                  
                  {/* Player Stats Summary */}
                  <Card className="mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Active Benchmarks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {playerBenchmarks.map(benchmark => (
                        <div 
                          key={benchmark.id}
                          className={`p-2 rounded cursor-pointer transition-colors ${
                            selectedStatType === benchmark.stat_type 
                              ? 'bg-blue-100 border border-blue-300' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedStatType(benchmark.stat_type)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 text-sm">
                              {STAT_TYPES.find(s => s.value === benchmark.stat_type)?.label}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {benchmark.target_value}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Main Dashboard */}
                <div className="xl:col-span-3">
                  <PlayerBenchmarkBar 
                    playerId={selectedPlayerId}
                    statType={selectedStatType}
                    filters={filters}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {!selectedPlayerId ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 text-lg">Select a player to view their achievements</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Badge Statistics */}
                <PlayerBadgeStats playerId={selectedPlayerId} />
                
                {/* Badge Showcase */}
                <BadgeShowcase 
                  playerId={selectedPlayerId} 
                  onBadgeClick={(badge) => {
                    // Could open a modal with badge details
                    console.log('Badge clicked:', badge);
                  }} 
                />
              </div>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {!selectedPlayerId ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 text-lg">Select a player to view performance insights</p>
                </CardContent>
              </Card>
            ) : (
              <PerformanceInsights playerId={selectedPlayerId} />
            )}
          </TabsContent>

          {/* Team Overview Tab */}
          <TabsContent value="team" className="space-y-6">
            <TeamPerformanceOverview />
          </TabsContent>

          {/* Benchmark Settings Tab */}
          <TabsContent value="benchmarks">
            <BenchmarkSetter 
              selectedPlayerId={selectedPlayerId}
              onBenchmarkUpdate={handleBenchmarkUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}