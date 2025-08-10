import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadSampleGameData, clearGameData } from "@/api/sampleGameData";
import { calculateBadgesForPerformance } from "@/utils/badges";
import { Trophy, RefreshCw, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SampleDataLoader({ onDataLoaded }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleLoadSampleData = async () => {
    setIsLoading(true);
    try {
      const result = loadSampleGameData();
      toast.success(`Demo data loaded successfully!`, {
        description: `Added ${result.games} games and ${result.performances} player performances`,
        duration: 4000
      });
      
      if (onDataLoaded) {
        onDataLoaded();
      }
    } catch (error) {
      console.error("Error loading sample data:", error);
      toast.error("Failed to load demo data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      clearGameData();
      toast.success("All game data cleared");
      
      if (onDataLoaded) {
        onDataLoaded();
      }
    } catch (error) {
      console.error("Error clearing data:", error);
      toast.error("Failed to clear data");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Sparkles className="w-5 h-5" />
          Demo Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-700">
          Load sample games to see the performance tracking and badge system in action!
          After loading, check the <strong>Performance</strong> tab for detailed analytics.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">📊 What you'll get:</h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• 5 realistic games with varied outcomes</li>
              <li>• Player stats for John, Sarah & Mike</li>
              <li>• Multiple badge achievements</li>
              <li>• Performance trends over time</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">🏆 Sample badges earned:</h4>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                🎯 Laser Shooter
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800">
                👑 Double-Double
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                🎪 Playmaker
              </Badge>
              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                🔥 Scoring Machine
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleLoadSampleData}
            disabled={isLoading || isClearing}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Trophy className="w-4 h-4 mr-2" />
            {isLoading ? "Loading..." : "Load Demo Games"}
          </Button>
          
          <Button
            onClick={handleClearData}
            disabled={isLoading || isClearing}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}