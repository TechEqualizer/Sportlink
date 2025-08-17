import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useMessages } from "@/contexts/MessageContext";
import { 
  Send, 
  Users, 
  AlertCircle, 
  Calendar,
  Clock,
  Megaphone
} from "lucide-react";

export default function BroadcastComposer({ onClose }) {
  const { toast } = useToast();
  const { sendBroadcast, loading } = useMessages();
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [isSending, setIsSending] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 1000;

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handleSend = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      await sendBroadcast(
        content.trim(),
        priority,
        { sentFrom: 'coaches_huddle' }
      );
      
      // Clear form on success
      setContent('');
      setCharCount(0);
      setPriority('normal');
      
      // Close dialog if callback provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      // Error handling is done in the context
      console.error('Broadcast error:', error);
    }
    setIsSending(false);
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'normal': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const quickTemplates = [
    { label: "Practice Reminder", text: "Don't forget about practice tomorrow at 3:30 PM. Please arrive 15 minutes early for warm-ups." },
    { label: "Game Day", text: "Game day! Bus leaves at 5:00 PM sharp. Bring your A-game and positive energy!" },
    { label: "Schedule Change", text: "Important: Practice time has been changed. Please check the updated schedule." },
    { label: "Great Job", text: "Excellent work at practice today team! Keep up the intensity and focus." }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            <CardTitle>Team Broadcast</CardTitle>
          </div>
          <Badge variant={getPriorityColor(priority)}>
            {priority.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Templates */}
        <div>
          <Label className="text-sm text-gray-600 mb-2">Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((template, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  setContent(template.text);
                  setCharCount(template.text.length);
                }}
              >
                {template.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message to the team..."
            value={content}
            onChange={handleContentChange}
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              This will be sent to all active players
            </span>
            <span className={`text-xs ${charCount > 900 ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    Low - General information
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Normal - Regular updates
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    High - Important notices
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Urgent - Immediate action required
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Will reach all team members instantly</span>
          </div>
          <div className="flex gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleSend}
              disabled={!content.trim() || isSending}
              className="min-w-[120px]"
            >
              {isSending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Broadcast
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}