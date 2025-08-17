import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useMessages } from "@/contexts/MessageContext";
import { 
  Send, 
  User, 
  Clock,
  Check,
  CheckCheck,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DirectMessagePanel({ onBack }) {
  const { toast } = useToast();
  const { 
    messages, 
    selectedPlayer, 
    sendDirectMessage, 
    markAsRead, 
    loading 
  } = useMessages();
  
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Player data state
  const [player, setPlayer] = useState(null);
  const [loadingPlayer, setLoadingPlayer] = useState(false);

  // Fetch player data when selectedPlayer changes
  useEffect(() => {
    if (!selectedPlayer) {
      setPlayer(null);
      return;
    }

    const fetchPlayerData = async () => {
      setLoadingPlayer(true);
      try {
        const response = await fetch('/api/messages/players');
        const data = await response.json();
        if (data.success) {
          const foundPlayer = data.players.find(p => p.id === selectedPlayer);
          setPlayer(foundPlayer || {
            id: selectedPlayer,
            name: `Player ${selectedPlayer}`,
            position: "Unknown",
            status: "active"
          });
        }
      } catch (error) {
        console.error('Failed to fetch player data:', error);
        // Fallback to basic player info
        setPlayer({
          id: selectedPlayer,
          name: `Player ${selectedPlayer}`,
          position: "Unknown",
          status: "active"
        });
      } finally {
        setLoadingPlayer(false);
      }
    };

    fetchPlayerData();
  }, [selectedPlayer]);

  // Get messages for selected player
  const playerMessages = selectedPlayer ? (messages.direct?.[selectedPlayer] || []) : [];

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [playerMessages]);

  // Mark unread messages as read
  useEffect(() => {
    if (selectedPlayer && playerMessages.length > 0) {
      playerMessages.forEach(msg => {
        if (msg.recipientId === 'coach' && msg.status !== 'read') {
          markAsRead(msg.id);
        }
      });
    }
  }, [selectedPlayer, playerMessages, markAsRead]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPlayer) return;

    setIsSending(true);
    setNewMessage('');

    try {
      await sendDirectMessage(selectedPlayer, newMessage.trim());
    } catch (error) {
      // Error handling is done in the context
      console.error('Send message error:', error);
    }
    
    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageStatus = (msg) => {
    if (msg.status === 'sending') return <Clock className="h-3 w-3" />;
    if (msg.status === 'sent') return <Check className="h-3 w-3" />;
    if (msg.status === 'read') return <CheckCheck className="h-3 w-3 text-blue-500" />;
    return null;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    
    if (isToday) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!player) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3" />
            <p>Select a player to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Direct</CardTitle>
              <p className="text-sm text-gray-500">{player.position}</p>
            </div>
          </div>
          <Badge variant={player.status === 'active' ? 'success' : 'secondary'}>
            {player.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages Area */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : playerMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <User className="h-8 w-8 mb-2" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {playerMessages.map((msg, idx) => {
                const isCoach = msg.senderId === 'coach' || msg.senderId?.startsWith('coach');
                const showDate = idx === 0 || 
                  new Date(playerMessages[idx - 1].createdAt).toDateString() !== 
                  new Date(msg.createdAt).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {new Date(msg.createdAt).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    <div className={cn(
                      "flex",
                      isCoach ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2",
                        isCoach 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-100 text-gray-900"
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={cn(
                          "flex items-center gap-1 mt-1",
                          isCoach ? "justify-end" : "justify-start"
                        )}>
                          <span className={cn(
                            "text-xs",
                            isCoach ? "text-blue-100" : "text-gray-500"
                          )}>
                            {formatTime(msg.createdAt)}
                          </span>
                          {isCoach && getMessageStatus(msg)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim() || isSending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}