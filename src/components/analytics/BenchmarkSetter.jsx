import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Minus, Save, Trash2 } from "lucide-react";
import { Benchmark, Athlete } from "@/api/entities";
import { suggestBenchmark } from "@/api/sampleBenchmarks";
import { toast } from "sonner";

const STAT_TYPES = [
  { value: "points", label: "Points", suffix: "PPG" },
  { value: "assists", label: "Assists", suffix: "APG" },
  { value: "rebounds", label: "Rebounds", suffix: "RPG" },
  { value: "three_pointers_made", label: "Three-Pointers", suffix: "3PM" },
  { value: "steals", label: "Steals", suffix: "SPG" },
  { value: "blocks", label: "Blocks", suffix: "BPG" }
];

export default function BenchmarkSetter({ selectedPlayerId, onBenchmarkUpdate }) {
  const [athletes, setAthletes] = useState([]);
  const [playerBenchmarks, setPlayerBenchmarks] = useState([]);
  const [newBenchmark, setNewBenchmark] = useState({
    stat_type: "points",
    target_value: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAthletes();
  }, []);

  useEffect(() => {
    if (selectedPlayerId) {
      loadPlayerBenchmarks();
    }
  }, [selectedPlayerId]);

  const loadAthletes = async () => {
    try {
      const athleteData = await Athlete.list();
      setAthletes(athleteData);
    } catch (error) {
      console.error("Error loading athletes:", error);
    }
  };

  const loadPlayerBenchmarks = async () => {
    setIsLoading(true);
    try {
      const benchmarks = await Benchmark.getByPlayer(selectedPlayerId);
      setPlayerBenchmarks(benchmarks);
    } catch (error) {
      console.error("Error loading benchmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlayer = athletes.find(a => a.id === selectedPlayerId);

  const handleSuggestBenchmark = () => {
    if (!selectedPlayer) return;
    
    const suggested = suggestBenchmark(selectedPlayer, newBenchmark.stat_type);
    setNewBenchmark(prev => ({
      ...prev,
      target_value: suggested.toString()
    }));
  };

  const adjustValue = (amount) => {
    const current = parseFloat(newBenchmark.target_value) || 0;
    const newValue = Math.max(0, current + amount);
    setNewBenchmark(prev => ({
      ...prev,
      target_value: newValue.toFixed(1)
    }));
  };

  const handleSaveBenchmark = async () => {
    if (!selectedPlayerId || !newBenchmark.target_value || parseFloat(newBenchmark.target_value) <= 0) {
      toast.error("Please enter a valid benchmark value");
      return;
    }

    setIsSaving(true);
    try {
      // Check if benchmark for this stat already exists
      const existingBenchmark = playerBenchmarks.find(b => b.stat_type === newBenchmark.stat_type);
      
      if (existingBenchmark) {
        // Update existing
        await Benchmark.update(existingBenchmark.id, {
          target_value: parseFloat(newBenchmark.target_value)
        });
        toast.success("Benchmark updated successfully");
      } else {
        // Create new
        await Benchmark.create({
          player_id: selectedPlayerId,
          stat_type: newBenchmark.stat_type,
          target_value: parseFloat(newBenchmark.target_value),
          opponent_id: null,
          active: true
        });
        toast.success("Benchmark created successfully");
      }
      
      // Reset form and reload
      setNewBenchmark({ stat_type: "points", target_value: "" });
      await loadPlayerBenchmarks();
      
      if (onBenchmarkUpdate) {
        onBenchmarkUpdate();
      }
    } catch (error) {
      console.error("Error saving benchmark:", error);
      toast.error("Failed to save benchmark");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBenchmark = async (benchmarkId) => {
    try {
      await Benchmark.delete(benchmarkId);
      toast.success("Benchmark removed");
      await loadPlayerBenchmarks();
      
      if (onBenchmarkUpdate) {
        onBenchmarkUpdate();
      }
    } catch (error) {
      console.error("Error deleting benchmark:", error);
      toast.error("Failed to remove benchmark");
    }
  };

  const getStatLabel = (statType) => {
    const stat = STAT_TYPES.find(s => s.value === statType);
    return stat ? stat.label : statType;
  };

  const getStatSuffix = (statType) => {
    const stat = STAT_TYPES.find(s => s.value === statType);
    return stat ? stat.suffix : "";
  };

  if (!selectedPlayerId) {
    return (
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardContent className="p-6 text-center">
          <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-300">Select a player to set benchmarks</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Benchmarks */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-yellow-400" />
            {selectedPlayer?.name} Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-slate-300">Loading benchmarks...</div>
          ) : playerBenchmarks.length > 0 ? (
            playerBenchmarks.map(benchmark => (
              <div key={benchmark.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">
                    {getStatLabel(benchmark.stat_type)}
                  </div>
                  <div className="text-sm text-slate-300">
                    Target: <span className="text-yellow-400 font-bold">
                      {benchmark.target_value} {getStatSuffix(benchmark.stat_type)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteBenchmark(benchmark.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-slate-300 text-center py-4">
              No benchmarks set yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Benchmark */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-white">Set New Benchmark</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-200">Statistic</Label>
            <Select 
              value={newBenchmark.stat_type} 
              onValueChange={(value) => setNewBenchmark(prev => ({ ...prev, stat_type: value }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {STAT_TYPES.map(stat => (
                  <SelectItem 
                    key={stat.value} 
                    value={stat.value}
                    className="text-white hover:bg-slate-600"
                  >
                    {stat.label} ({stat.suffix})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-200">Target Value</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSuggestBenchmark}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 text-xs"
              >
                Suggest
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustValue(-0.5)}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 p-2"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                step="0.5"
                min="0"
                value={newBenchmark.target_value}
                onChange={(e) => setNewBenchmark(prev => ({ ...prev, target_value: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white text-center font-bold text-lg"
                placeholder="0.0"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustValue(0.5)}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 p-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {newBenchmark.target_value && (
              <div className="text-center">
                <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-400/30">
                  {newBenchmark.target_value} {getStatSuffix(newBenchmark.stat_type)}
                </Badge>
              </div>
            )}
          </div>

          <Button
            onClick={handleSaveBenchmark}
            disabled={isSaving || !newBenchmark.target_value}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Benchmark"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}