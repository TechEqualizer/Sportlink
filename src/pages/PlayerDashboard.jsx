import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, User, TrendingUp, Settings2, BarChart3 } from "lucide-react";
import { Athlete, Benchmark } from "@/api/entities";
import { loadSampleBenchmarks } from "@/api/sampleBenchmarks";
import BenchmarkSetter from "@/components/analytics/BenchmarkSetter";
import PlayerBenchmarkBar from "@/components/analytics/PlayerBenchmarkBar";
import QuickFilters from "@/components/analytics/QuickFilters";

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Player Performance Dashboard</h1>
                <p className="text-slate-400">Target-based performance tracking and analytics</p>
              </div>
            </div>
            
            {selectedPlayer && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{selectedPlayer.name}</div>
                  <div className="text-sm text-slate-400">
                    {selectedPlayer.position} • Class of {selectedPlayer.class_year}
                  </div>
                </div>
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Player Selection */}
        <div className="mb-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Player & Stats Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Player</label>
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select a player..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {athletes.map(athlete => (
                        <SelectItem 
                          key={athlete.id} 
                          value={athlete.id}
                          className="text-white hover:bg-slate-700"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{athlete.name}</span>
                            <span className="text-slate-400 ml-2">{athlete.position}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Statistic</label>
                  <Select 
                    value={selectedStatType} 
                    onValueChange={setSelectedStatType}
                    disabled={!hasActiveBenchmarks}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select stat type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {STAT_TYPES.map(stat => (
                        <SelectItem 
                          key={stat.value} 
                          value={stat.value}
                          disabled={!availableStats.includes(stat.value)}
                          className="text-white hover:bg-slate-700 disabled:text-slate-500"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{stat.label}</span>
                            <span className="text-slate-400 ml-2">{stat.suffix}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!hasActiveBenchmarks && (
                    <p className="text-xs text-slate-400">Set benchmarks first to enable stat selection</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="benchmarks" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Benchmark Settings
            </TabsTrigger>
          </TabsList>

          {/* Performance Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {!selectedPlayerId ? (
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">Select a player to view performance dashboard</p>
                </CardContent>
              </Card>
            ) : !hasActiveBenchmarks ? (
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg mb-2">No benchmarks set for {selectedPlayer?.name}</p>
                  <p className="text-slate-400 mb-4">Create benchmarks in the settings tab to start tracking performance</p>
                  <Button 
                    onClick={() => document.querySelector('[data-state="inactive"]').click()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
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
                  <Card className="bg-slate-900 border-slate-700 mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm">Active Benchmarks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {playerBenchmarks.map(benchmark => (
                        <div 
                          key={benchmark.id}
                          className={`p-2 rounded cursor-pointer transition-colors ${
                            selectedStatType === benchmark.stat_type 
                              ? 'bg-yellow-900/30 border border-yellow-400/30' 
                              : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                          onClick={() => setSelectedStatType(benchmark.stat_type)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm">
                              {STAT_TYPES.find(s => s.value === benchmark.stat_type)?.label}
                            </span>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
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