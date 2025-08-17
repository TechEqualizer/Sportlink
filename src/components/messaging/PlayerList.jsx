import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockSeasonStats } from "@/api/mockData";

export default function PlayerList({ onSelectPlayer, unreadCounts, selectedPlayer }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/messages/players');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setPlayers(data.players);
        } else {
          throw new Error(data.error || 'Failed to fetch players');
        }
      } catch (error) {
        console.warn('Error fetching players - using fallback data:', error);
        // Fallback to mock data if API fails
        setPlayers([
          { 
            id: "1", 
            name: "John Smith", 
            position: "PG", 
            status: "active",
            avatar: null
          },
          { 
            id: "2", 
            name: "Sarah Johnson", 
            position: "SG", 
            status: "active",
            avatar: null
          },
          { 
            id: "3", 
            name: "Mike Williams", 
            position: "SF", 
            status: "active",
            avatar: null
          },
          { 
            id: "4", 
            name: "Emily Davis", 
            position: "PF", 
            status: "active",
            avatar: null
          },
          { 
            id: "5", 
            name: "Alex Thompson", 
            position: "C", 
            status: "active",
            avatar: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const getRecentMetrics = (playerId) => {
    const stats = mockSeasonStats[playerId];
    if (!stats || !stats.currentSeason) {
      return "No recent stats";
    }
    
    const { ppg, apg, rpg } = stats.currentSeason;
    return `${ppg || 0} PTS, ${apg || 0} AST, ${rpg || 0} REB`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {players.map(player => (
        <Button
          key={player.id}
          variant="ghost"
          className={`w-full justify-start p-3 h-auto ${
            selectedPlayer === player.id ? "bg-blue-50 border border-blue-200" : ""
          }`}
          onClick={() => onSelectPlayer(player)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-team-primary text-white font-medium">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-medium text-gray-900">{player.name}</div>
                <div className="text-sm text-blue-600">
                  Recent Metrics: {getRecentMetrics(player.id)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCounts[player.id] > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCounts[player.id]}
                </Badge>
              )}
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedPlayer === player.id 
                  ? "border-blue-500 bg-blue-500" 
                  : "border-gray-300"
              }`}>
                {selectedPlayer === player.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}