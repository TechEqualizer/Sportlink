import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Game, GamePerformance, Athlete } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { calculateBadgesForPerformance, getBadgeColor, getBadgeLevelName } from "@/utils/badges";
import { Badge } from "@/components/ui/badge";

export default function GameEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== 'new';
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  
  // Game details
  const [gameData, setGameData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    opponent: '',
    location: 'Home',
    game_type: 'Regular Season',
    season: '2024',
    team_score: '',
    opponent_score: '',
    notes: ''
  });
  
  // Player performances
  const [performances, setPerformances] = useState({});

  useEffect(() => {
    loadAthletes();
    if (isEditMode) {
      loadGameData();
    }
  }, [id]);

  const loadAthletes = async () => {
    try {
      const athleteList = await Athlete.list();
      setAthletes(athleteList);
    } catch (error) {
      console.error("Error loading athletes:", error);
      toast.error("Failed to load athletes");
    }
  };

  const loadGameData = async () => {
    setIsLoading(true);
    try {
      const game = await Game.get(id);
      setGameData(game);
      
      // Load performances for this game
      const gamePerformances = await GamePerformance.getByGame(id);
      const perfMap = {};
      const selectedIds = [];
      
      gamePerformances.forEach(perf => {
        perfMap[perf.athlete_id] = perf;
        selectedIds.push(perf.athlete_id);
      });
      
      setPerformances(perfMap);
      setSelectedAthletes(selectedIds);
    } catch (error) {
      console.error("Error loading game data:", error);
      toast.error("Failed to load game data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAthleteToggle = (athleteId) => {
    setSelectedAthletes(prev => {
      if (prev.includes(athleteId)) {
        // Remove athlete and their stats
        const newPerformances = { ...performances };
        delete newPerformances[athleteId];
        setPerformances(newPerformances);
        return prev.filter(id => id !== athleteId);
      } else {
        // Add athlete with empty stats
        setPerformances(prev => ({
          ...prev,
          [athleteId]: {
            athlete_id: athleteId,
            minutes: 0,
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            field_goals_made: 0,
            field_goals_attempted: 0,
            three_pointers_made: 0,
            three_pointers_attempted: 0,
            free_throws_made: 0,
            free_throws_attempted: 0,
            fouls: 0
          }
        }));
        return [...prev, athleteId];
      }
    });
  };

  const handleStatChange = (athleteId, stat, value) => {
    setPerformances(prev => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        [stat]: parseInt(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!gameData.opponent) {
      toast.error("Please enter the opponent name");
      return;
    }
    
    if (!gameData.team_score || !gameData.opponent_score) {
      toast.error("Please enter both team scores");
      return;
    }
    
    if (selectedAthletes.length === 0) {
      toast.error("Please select at least one player");
      return;
    }

    setIsSaving(true);
    try {
      let gameId = id;
      
      if (isEditMode) {
        // Update existing game
        await Game.update(id, gameData);
        
        // Delete existing performances and create new ones
        const existingPerfs = await GamePerformance.getByGame(id);
        for (const perf of existingPerfs) {
          await GamePerformance.delete(perf.id);
        }
      } else {
        // Create new game
        const newGame = await Game.create(gameData);
        gameId = newGame.id;
      }
      
      // Create performances
      const performanceData = selectedAthletes.map(athleteId => ({
        ...performances[athleteId],
        game_id: gameId,
        athlete_id: athleteId
      }));
      
      await GamePerformance.createBatch(performanceData);
      
      // Calculate badges earned
      const allBadges = [];
      performanceData.forEach(perf => {
        const earnedBadges = calculateBadgesForPerformance(perf, gameData);
        if (earnedBadges.length > 0) {
          const athlete = athletes.find(a => a.id === perf.athlete_id);
          allBadges.push({
            athleteName: athlete?.name || 'Unknown',
            badges: earnedBadges
          });
        }
      });
      
      // Show success message with badges
      if (allBadges.length > 0) {
        let badgeMessage = "Badges earned:\n";
        allBadges.forEach(({ athleteName, badges }) => {
          badges.forEach(badge => {
            badgeMessage += `${badge.icon} ${athleteName} - ${badge.name} (${getBadgeLevelName(badge.level)})\n`;
          });
        });
        toast.success(isEditMode ? "Game updated successfully!" : "Game saved successfully!", {
          description: badgeMessage,
          duration: 5000
        });
      } else {
        toast.success(isEditMode ? "Game updated successfully" : "Game saved successfully");
      }
      
      navigate('/Games');
    } catch (error) {
      console.error("Error saving game:", error);
      toast.error("Failed to save game. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateTeamStats = () => {
    let totalPoints = 0;
    let totalRebounds = 0;
    let totalAssists = 0;
    
    selectedAthletes.forEach(athleteId => {
      const stats = performances[athleteId] || {};
      totalPoints += stats.points || 0;
      totalRebounds += stats.rebounds || 0;
      totalAssists += stats.assists || 0;
    });
    
    return { totalPoints, totalRebounds, totalAssists };
  };

  const teamStats = calculateTeamStats();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/Games')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Game' : 'New Game'}
          </h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-team-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Game'}
        </Button>
      </div>

      {/* Game Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Game Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={gameData.date}
                onChange={(e) => setGameData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="opponent">Opponent</Label>
              <Input
                id="opponent"
                placeholder="Enter opponent name"
                value={gameData.opponent}
                onChange={(e) => setGameData(prev => ({ ...prev, opponent: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={gameData.location}
                onValueChange={(value) => setGameData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Away">Away</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="game_type">Game Type</Label>
              <Select
                value={gameData.game_type}
                onValueChange={(value) => setGameData(prev => ({ ...prev, game_type: value }))}
              >
                <SelectTrigger id="game_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular Season">Regular Season</SelectItem>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                  <SelectItem value="Playoff">Playoff</SelectItem>
                  <SelectItem value="Exhibition">Exhibition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="team_score">Our Score</Label>
              <Input
                id="team_score"
                type="number"
                placeholder="0"
                value={gameData.team_score}
                onChange={(e) => setGameData(prev => ({ ...prev, team_score: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="opponent_score">Opponent Score</Label>
              <Input
                id="opponent_score"
                type="number"
                placeholder="0"
                value={gameData.opponent_score}
                onChange={(e) => setGameData(prev => ({ ...prev, opponent_score: e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Add any game notes..."
              value={gameData.notes}
              onChange={(e) => setGameData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Player Selection and Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Player Statistics</CardTitle>
          <p className="text-sm text-medium-contrast">
            Select players who participated and enter their stats
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roster" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="roster">Select Players</TabsTrigger>
              <TabsTrigger value="stats">Enter Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roster">
              <div className="space-y-2">
                {athletes.map(athlete => (
                  <div
                    key={athlete.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`athlete-${athlete.id}`}
                      checked={selectedAthletes.includes(athlete.id)}
                      onCheckedChange={() => handleAthleteToggle(athlete.id)}
                    />
                    <label
                      htmlFor={`athlete-${athlete.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{athlete.name}</div>
                      <div className="text-sm text-medium-contrast">
                        #{athlete.jersey_number} • {athlete.position}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              {selectedAthletes.length === 0 ? (
                <div className="text-center py-8 text-medium-contrast">
                  Please select players from the roster tab first
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quick Stats Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <div className="text-2xl font-bold text-team-primary">
                          {teamStats.totalPoints}
                        </div>
                        <div className="text-sm text-medium-contrast">Total Points</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-team-primary">
                          {teamStats.totalRebounds}
                        </div>
                        <div className="text-sm text-medium-contrast">Total Rebounds</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-team-primary">
                          {teamStats.totalAssists}
                        </div>
                        <div className="text-sm text-medium-contrast">Total Assists</div>
                      </div>
                    </div>
                    
                    {/* Badge Preview */}
                    {selectedAthletes.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-medium-contrast mb-2">Potential Badges:</h4>
                        <div className="space-y-2">
                          {selectedAthletes.map(athleteId => {
                            const athlete = athletes.find(a => a.id === athleteId);
                            const stats = performances[athleteId] || {};
                            const badges = calculateBadgesForPerformance(stats, gameData);
                            
                            if (badges.length === 0) return null;
                            
                            return (
                              <div key={athleteId} className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium">{athlete?.name}:</span>
                                {badges.map(badge => (
                                  <span
                                    key={`${badge.badgeId}-${badge.level}`}
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBadgeColor(badge.level)}`}
                                  >
                                    {badge.icon} {badge.name}
                                  </span>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Player Stats Grid */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Player</th>
                          <th className="text-center p-2 w-16">MIN</th>
                          <th className="text-center p-2 w-16">PTS</th>
                          <th className="text-center p-2 w-16">REB</th>
                          <th className="text-center p-2 w-16">AST</th>
                          <th className="text-center p-2 w-16">STL</th>
                          <th className="text-center p-2 w-16">BLK</th>
                          <th className="text-center p-2 w-16">TO</th>
                          <th className="text-center p-2 w-20">FGM-A</th>
                          <th className="text-center p-2 w-20">3PM-A</th>
                          <th className="text-center p-2 w-20">FTM-A</th>
                          <th className="text-center p-2 w-16">PF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAthletes.map(athleteId => {
                          const athlete = athletes.find(a => a.id === athleteId);
                          const stats = performances[athleteId] || {};
                          
                          return (
                            <tr key={athleteId} className="border-b">
                              <td className="p-2">
                                <div className="font-medium">{athlete?.name}</div>
                                <div className="text-xs text-medium-contrast">
                                  #{athlete?.jersey_number}
                                </div>
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.minutes || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'minutes', e.target.value)}
                                />
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.points || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'points', e.target.value)}
                                />
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.rebounds || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'rebounds', e.target.value)}
                                />
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.assists || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'assists', e.target.value)}
                                />
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.steals || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'steals', e.target.value)}
                                />
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.blocks || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'blocks', e.target.value)}
                                />
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.turnovers || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'turnovers', e.target.value)}
                                />
                              </td>
                              <td className="p-1">
                                <div className="flex gap-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-10 h-8 text-center text-xs"
                                    value={stats.field_goals_made || ''}
                                    onChange={(e) => handleStatChange(athleteId, 'field_goals_made', e.target.value)}
                                  />
                                  <span className="self-center">-</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-10 h-8 text-center text-xs"
                                    value={stats.field_goals_attempted || ''}
                                    onChange={(e) => handleStatChange(athleteId, 'field_goals_attempted', e.target.value)}
                                  />
                                </div>
                              </td>
                              <td className="p-1">
                                <div className="flex gap-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-10 h-8 text-center text-xs"
                                    value={stats.three_pointers_made || ''}
                                    onChange={(e) => handleStatChange(athleteId, 'three_pointers_made', e.target.value)}
                                  />
                                  <span className="self-center">-</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-10 h-8 text-center text-xs"
                                    value={stats.three_pointers_attempted || ''}
                                    onChange={(e) => handleStatChange(athleteId, 'three_pointers_attempted', e.target.value)}
                                  />
                                </div>
                              </td>
                              <td className="p-1">
                                <div className="flex gap-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-10 h-8 text-center text-xs"
                                    value={stats.free_throws_made || ''}
                                    onChange={(e) => handleStatChange(athleteId, 'free_throws_made', e.target.value)}
                                  />
                                  <span className="self-center">-</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-10 h-8 text-center text-xs"
                                    value={stats.free_throws_attempted || ''}
                                    onChange={(e) => handleStatChange(athleteId, 'free_throws_attempted', e.target.value)}
                                  />
                                </div>
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-14 h-8 text-center"
                                  value={stats.fouls || ''}
                                  onChange={(e) => handleStatChange(athleteId, 'fouls', e.target.value)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}