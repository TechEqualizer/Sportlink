import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  ChevronRight,
  Menu,
  Plus,
  Megaphone
} from "lucide-react";
import BroadcastComposer from "@/components/messaging/BroadcastComposer";
import DirectMessagePanel from "@/components/messaging/DirectMessagePanel";
import PerformanceAlerts from "@/components/messaging/PerformanceAlerts";
import PlayerList from "@/components/messaging/PlayerList";
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
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
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
    setShowMobileSidebar(false);
  };

  const navigationItems = [
    { 
      id: "broadcast", 
      label: "Broadcast", 
      icon: Megaphone, 
      count: null 
    },
    { 
      id: "direct", 
      label: "Direct", 
      icon: MessageSquare, 
      count: Object.values(unreadCounts).reduce((sum, count) => sum + count, 0) || null 
    },
    { 
      id: "alerts", 
      label: "Alerts", 
      icon: AlertCircle, 
      count: messages.alerts?.length || null 
    },
    { 
      id: "insights", 
      label: "Insights", 
      icon: BarChart3, 
      count: null 
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Coaches Huddle</h1>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <div 
            className={cn(
              "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity",
              showMobileSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform",
            showMobileSidebar ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Coach {user?.name?.split(' ')[0] || 'Alex'}</h2>
            </div>
            <div className="p-4 space-y-2">
              {navigationItems.map(item => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start h-12"
                  onClick={() => {
                    if (item.id === "broadcast") {
                      setShowBroadcastDialog(true);
                    } else {
                      setActiveTab(item.id);
                    }
                    setShowMobileSidebar(false);
                  }}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">
                    {item.id === "broadcast" ? "Team Broadcast" : 
                     item.id === "direct" ? "Direct Messages" :
                     item.id === "alerts" ? "Performance Alerts" :
                     "Team Insights"}
                  </span>
                  {item.count > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <div className="w-80 bg-white border-r">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Coach {user?.name?.split(' ')[0] || 'Alex'}</h2>
          </div>
          <div className="p-4 space-y-2">
            {navigationItems.map(item => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start h-12"
                onClick={() => {
                  if (item.id === "broadcast") {
                    setShowBroadcastDialog(true);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left">
                  {item.id === "broadcast" ? "Team Broadcast" : 
                   item.id === "direct" ? "Direct Messages" :
                   item.id === "alerts" ? "Performance Alerts" :
                   "Team Insights"}
                </span>
                {item.count > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto pb-16 lg:pb-0">
            <TabsContent value="broadcast" className="p-6 m-0">
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

            <TabsContent value="direct" className="m-0 flex-1 flex">
              <div className="flex-1 flex">
                {/* Player List for Direct Messages */}
                <div className="w-80 bg-white border-r hidden lg:block">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Direct</h3>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          All ▼
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Players ▼
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Groups ▼
                        </Button>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="p-4">
                      <PlayerList 
                        onSelectPlayer={handlePlayerSelect}
                        unreadCounts={unreadCounts}
                        selectedPlayer={selectedPlayer}
                      />
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Message Panel */}
                <div className="flex-1">
                  {selectedPlayer ? (
                    <DirectMessagePanel />
                  ) : (
                    <Card className="h-full">
                      <CardContent className="flex flex-col items-center justify-center h-full">
                        <User className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-600">Select a player to start messaging</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="p-6 m-0">
              <PerformanceAlerts />
            </TabsContent>

            <TabsContent value="insights" className="p-6 m-0">
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
          <div className="grid grid-cols-4 h-16">
            {navigationItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "h-full rounded-none flex flex-col gap-1 relative",
                  activeTab === item.id && "text-blue-600 bg-blue-50"
                )}
                onClick={() => {
                  if (item.id === "broadcast") {
                    setShowBroadcastDialog(true);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
                {item.count > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button for Broadcast (Desktop) */}
      {!isMobile && (
        <Button
          onClick={() => setShowBroadcastDialog(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-30"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      {/* Broadcast Dialog */}
      <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Team Broadcast</DialogTitle>
          </DialogHeader>
          <BroadcastComposer onClose={() => setShowBroadcastDialog(false)} />
        </DialogContent>
      </Dialog>
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