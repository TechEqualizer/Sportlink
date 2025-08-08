import React, { useState, useEffect } from "react";
import { Game, GamePerformance, Athlete } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Upload, 
  Calendar,
  Trophy,
  Users,
  FileSpreadsheet,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { rateLimiter } from "@/components/utils/rateLimiter";

const ITEMS_PER_PAGE = 20;

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importMethod, setImportMethod] = useState(null);

  useEffect(() => {
    loadGames();
  }, [searchTerm, selectedSeason, currentPage]);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      const query = {
        season: selectedSeason
      };
      
      if (searchTerm) {
        query.opponent = { contains: searchTerm };
      }

      const { data, total } = await rateLimiter.executeWithRateLimit(() =>
        Game.filter(query, '-date', ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE)
      );
      
      setGames(data || []);
      setTotalGames(total || 0);
    } catch (error) {
      console.error("Error loading games:", error);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!confirm("Are you sure you want to delete this game and all associated player statistics?")) {
      return;
    }

    try {
      await Game.delete(gameId);
      loadGames(); // Reload the list
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Failed to delete game. Please try again.");
    }
  };

  const totalPages = Math.ceil(totalGames / ITEMS_PER_PAGE);

  const getGameResultBadge = (game) => {
    if (!game.team_score || !game.opponent_score) return null;
    
    const won = game.team_score > game.opponent_score;
    return (
      <Badge className={won ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {won ? "W" : "L"} {game.team_score}-{game.opponent_score}
      </Badge>
    );
  };

  if (isLoading && games.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-high-contrast">Games</h1>
          <p className="text-medium-contrast mt-1 text-sm md:text-base">
            Track game results and player performances
          </p>
        </div>
        <Button
          onClick={() => setShowImportDialog(true)}
          className="btn-team-primary mobile-full-width sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Add Game</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by opponent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 min-h-[44px]"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024 Season</SelectItem>
            <SelectItem value="2023">2023 Season</SelectItem>
            <SelectItem value="2022">2022 Season</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Games List */}
      {games.length === 0 ? (
        <Card className="card-readable p-6 md:p-12 text-center">
          <CardContent className="flex flex-col items-center p-0">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-high-contrast">
              No Games Recorded
            </h2>
            <p className="text-medium-contrast mb-4 text-sm md:text-base">
              Start tracking your team's performance by adding your first game.
            </p>
            <Button
              onClick={() => setShowImportDialog(true)}
              className="btn-team-primary"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Your First Game
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <Card key={game.id} className="card-readable hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-high-contrast">
                        vs {game.opponent}
                      </h3>
                      {getGameResultBadge(game)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-medium-contrast">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(game.date), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {game.location || "Home"}
                      </div>
                      {game.game_type && (
                        <Badge variant="outline">{game.game_type}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = `/game/${game.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGame(game.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-medium-contrast px-3">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Game</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-medium-contrast">
              Choose how you'd like to add game data:
            </p>
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => {
                  setImportMethod('manual');
                  setShowImportDialog(false);
                  window.location.href = '/game/new';
                }}
              >
                <Edit className="w-5 h-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Manual Entry</div>
                  <div className="text-sm text-medium-contrast">
                    Enter game details and player stats manually
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => {
                  setImportMethod('csv');
                  setShowImportDialog(false);
                  window.location.href = '/game/import';
                }}
              >
                <FileSpreadsheet className="w-5 h-5 mr-3 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Import from Spreadsheet</div>
                  <div className="text-sm text-medium-contrast">
                    Upload CSV or Excel file from Hudl, MaxPreps, etc.
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => {
                  setImportMethod('paste');
                  setShowImportDialog(false);
                  window.location.href = '/game/paste';
                }}
              >
                <Upload className="w-5 h-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Copy & Paste</div>
                  <div className="text-sm text-medium-contrast">
                    Paste data directly from your stat tracking tool
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}