import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Users, 
  User, 
  AlertCircle, 
  TrendingDown,
  Bell,
  MessageSquare,
  BarChart3,
  Filter,
  Search,
  ChevronRight
} from "lucide-react";
import BroadcastComposer from "@/components/messaging/BroadcastComposer";
import DirectMessagePanel from "@/components/messaging/DirectMessagePanel";
import PerformanceAlerts from "@/components/messaging/PerformanceAlerts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MessageProvider, useMessages } from "@/contexts/MessageContext";

// Inner component that uses the message context
function CoachesHuddleContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use message context instead of local state
  const {
    messages,
    unreadCounts,
    selectedPlayer,
    loading,
    error,
    selectPlayer,
    loadMessages,
    loadAlerts
  } = useMessages();
  
  // Local UI state
  const [activeTab, setActiveTab] = useState("broadcast");

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load initial data
  useEffect(() => {
    loadMessages();
    loadAlerts();
  }, [loadMessages, loadAlerts]);

  const handlePlayerSelect = (player) => {
    selectPlayer(player.id);
    setActiveTab("direct");
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <h1 className="text-xl font-bold">Coaches Huddle</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Users className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Sidebar - Player List & Alerts */}
      <div className={cn(
        "bg-white border-r transition-all duration-300",
        isMobile ? "fixed inset-y-0 left-0 z-50 w-80" : "w-80",
        showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <Button 
              className="w-full justify-start"
              variant={activeTab === "broadcast" ? "default" : "ghost"}
              onClick={() => setActiveTab("broadcast")}
            >
              <Users className="h-4 w-4 mr-2" />
              Team Broadcast
            </Button>
            <Button 
              className="w-full justify-start"
              variant={activeTab === "alerts" ? "default" : "ghost"}
              onClick={() => setActiveTab("alerts")}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Performance Alerts
              {messages.alerts?.length > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {messages.alerts.length}
                </Badge>
              )}
            </Button>
            <Button 
              className="w-full justify-start"
              variant={activeTab === "insights" ? "default" : "ghost"}
              onClick={() => setActiveTab("insights")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Team Insights
            </Button>
          </div>
        </div>

        {/* Player List */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Players</h3>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <PlayerList 
              onSelectPlayer={handlePlayerSelect}
              unreadCounts={unreadCounts}
              selectedPlayer={selectedPlayer}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="bg-white border-b px-6 py-3">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
              <TabsTrigger value="direct">Direct</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="broadcast" className="p-6">
              <BroadcastComposer />
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Broadcasts</h3>
                <div className="space-y-4">
                  {messages.broadcasts?.map(message => (
                    <Card key={message.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={message.priority === 'high' ? 'destructive' : 'secondary'}>
                            {message.priority}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-800">{message.content}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-500">
                            Status: {message.status || 'sent'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="direct" className="p-6">
              {selectedPlayer ? (
                <DirectMessagePanel />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <User className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600">Select a player to start messaging</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="p-6">
              <PerformanceAlerts />
            </TabsContent>

            <TabsContent value="insights" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {messages.broadcasts?.length || 0}
                      </div>
                      <p className="text-gray-600">Broadcasts Sent</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Object.keys(messages.direct || {}).length}
                      </div>
                      <p className="text-gray-600">Direct Conversations</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {messages.alerts?.length || 0}
                      </div>
                      <p className="text-gray-600">Active Alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}

// Main export component wrapped with MessageProvider
export default function CoachesHuddle() {
  return (
    <MessageProvider>
      <CoachesHuddleContent />
    </MessageProvider>
  );
}

// Player List Component
function PlayerList({ onSelectPlayer, unreadCounts, selectedPlayer }) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {players.map(player => (
        <Button
          key={player.id}
          variant={selectedPlayer === player.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectPlayer(player)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-2" 
                style={{ backgroundColor: player.status === 'active' ? '#10b981' : '#6b7280' }}
              />
              <div className="text-left">
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-gray-500">{player.position}</div>
              </div>
            </div>
            {unreadCounts[player.id] > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCounts[player.id]}
              </Badge>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}