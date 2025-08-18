import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  FileText,
  ChevronRight,
  MoreHorizontal,
  Star,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeamTheme } from "@/contexts/TeamThemeContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function Home() {
  const { user } = useAuth();
  const { team } = useTeamTheme();
  const navigate = useNavigate();

  // Mock data for upcoming events and recent activity
  const upcomingEvent = {
    title: "Game vs. Eagles",
    date: "Saturday, 2:00 PM",
    location: "City Stadium",
    type: "game"
  };

  const recentActivity = [
    {
      id: 1,
      type: "message",
      title: "New Message from Liam",
      subtitle: "2 hours ago",
      icon: MessageCircle,
      hasNotification: true
    },
    {
      id: 2,
      type: "performance",
      title: "Player Performance Feedback",
      subtitle: "Yesterday",
      icon: Star,
      hasNotification: false
    }
  ];

  const quickActions = [
    {
      title: "Message Team",
      icon: MessageSquare,
      action: () => navigate("/CoachesHuddle"),
      color: "bg-blue-500"
    },
    {
      title: "View Events",
      icon: Calendar,
      action: () => navigate("/Games"),
      color: "bg-green-500"
    },
    {
      title: "Game Stats",
      icon: BarChart3,
      action: () => navigate("/performance-review"),
      color: "bg-purple-500"
    },
    {
      title: "Player Report",
      icon: FileText,
      action: () => navigate("/Athletes"),
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with single profile */}

      <div className="px-4 py-6 space-y-6">
        {/* Coach Profile Section */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-team-primary text-white font-bold text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'CA'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Coach {user?.name?.split(' ')[0] || 'Alex'}
                </h2>
                <p className="text-gray-600">
                  Team: {team?.name || 'Sharks'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
                onClick={action.action}
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {action.title}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Upcoming Event */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Event</h3>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {upcomingEvent.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {upcomingEvent.date}
                    </p>
                    <p className="text-xs text-gray-500">
                      {upcomingEvent.location}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <Card key={activity.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <activity.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      {activity.hasNotification && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}