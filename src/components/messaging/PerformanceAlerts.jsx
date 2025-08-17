import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Trophy,
  Target,
  CheckCircle,
  Info,
  RefreshCw,
  User,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock performance alerts data
const MOCK_ALERTS = [
  {
    id: 'alert_1',
    playerId: '1',
    playerName: 'John Smith',
    alertType: 'benchmark_exceeded',
    severity: 'success',
    message: 'John Smith exceeded assists benchmark by 20% (9.2 APG vs 7.5 target)',
    metricName: 'assists',
    currentValue: 9.2,
    thresholdValue: 7.5,
    trend: 20,
    acknowledged: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    gameContext: 'vs West High Eagles'
  },
  {
    id: 'alert_2',
    playerId: '2',
    playerName: 'Sarah Johnson',
    alertType: 'shooting_hot_streak',
    severity: 'success',
    message: 'Sarah Johnson on fire from three-point range (58% over last 3 games)',
    metricName: 'three_point_percentage',
    currentValue: 58,
    thresholdValue: 40,
    trend: 18,
    acknowledged: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    gameContext: 'Last 3 games'
  },
  {
    id: 'alert_3',
    playerId: '3',
    playerName: 'Mike Williams',
    alertType: 'defensive_dominance',
    severity: 'info',
    message: 'Mike Williams averaging 4.2 blocks per game over last 5 games',
    metricName: 'blocks',
    currentValue: 4.2,
    thresholdValue: 2.5,
    trend: 68,
    acknowledged: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    gameContext: 'Last 5 games'
  },
  {
    id: 'alert_4',
    playerId: '1',
    playerName: 'John Smith',
    alertType: 'triple_double_watch',
    severity: 'info',
    message: 'John Smith close to triple-double (18 PTS, 10 REB, 8 AST in last game)',
    metricName: 'triple_double_potential',
    currentValue: 8,
    thresholdValue: 10,
    trend: 0,
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    gameContext: 'vs North Central'
  },
  {
    id: 'alert_5',
    playerId: '2',
    playerName: 'Sarah Johnson',
    alertType: 'scoring_milestone',
    severity: 'success',
    message: 'Sarah Johnson reached 1,000 career points milestone!',
    metricName: 'career_points',
    currentValue: 1000,
    thresholdValue: 1000,
    trend: 0,
    acknowledged: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    gameContext: 'Career milestone'
  },
  {
    id: 'alert_6',
    playerId: '3',
    playerName: 'Mike Williams',
    alertType: 'free_throw_concern',
    severity: 'warning',
    message: 'Mike Williams free throw percentage dropped to 58% (below 70% target)',
    metricName: 'free_throw_percentage',
    currentValue: 58,
    thresholdValue: 70,
    trend: -12,
    acknowledged: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    gameContext: 'Last 5 games'
  }
];

export default function PerformanceAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString() }
        : alert
    ));
    
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as reviewed"
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Alerts Refreshed",
        description: "Performance alerts have been updated"
      });
    }, 1000);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    if (filter === 'success') return alert.severity === 'success';
    if (filter === 'warning') return alert.severity === 'warning';
    return alert.alertType === filter;
  });

  // Group alerts by player
  const alertsByPlayer = filteredAlerts.reduce((acc, alert) => {
    if (!acc[alert.playerId]) {
      acc[alert.playerId] = {
        playerName: alert.playerName,
        alerts: []
      };
    }
    acc[alert.playerId].alerts.push(alert);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Summary Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Alerts Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {alerts.length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Positive Alerts</p>
              <p className="text-3xl font-bold text-green-600">
                {alerts.filter(a => a.severity === 'success').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Needs Attention</p>
              <p className="text-3xl font-bold text-orange-600">
                {alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Alerts */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Performance Alerts</h2>
        <div className="space-y-4">
          {Object.entries(alertsByPlayer).map(([playerId, playerData]) => (
            <div key={playerId} className="space-y-3">
              {playerData.alerts.map(alert => (
                <Alert 
                  key={alert.id}
                  className={cn(
                    "relative",
                    getAlertBgColor(alert.severity),
                    alert.acknowledged && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-team-primary text-white font-medium">
                        {alert.playerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">Player: {alert.playerName.split(' ')[0]}</p>
                          <p className="text-sm text-gray-600">Game: {alert.gameContext}</p>
                          <p className="text-sm text-blue-600">
                            Metric: {alert.metricName.replace('_', ' ')} ({alert.currentValue}
                            {alert.thresholdValue && ` vs. ${alert.thresholdValue}`} benchmark)
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        >
                          Send Feedback
                        </Button>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark as Reviewed
                        </Button>
                      )}
                      {alert.acknowledged && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Reviewed {formatTimeAgo(alert.acknowledgedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}

// Helper function to get alert severity color
function getSeverityColor(severity) {
  switch(severity) {
    case 'success': return 'default';
    case 'warning': return 'secondary';
    case 'info': return 'outline';
    default: return 'default';
  }
}

// Helper function to get alert background color
function getAlertBgColor(severity) {
  switch(severity) {
    case 'success': return 'bg-green-50 border-green-200';
    case 'warning': return 'bg-yellow-50 border-yellow-200';
    case 'info': return 'bg-blue-50 border-blue-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}

// Helper function to get alert text color
function getAlertTextColor(severity) {
  switch(severity) {
    case 'success': return 'text-green-800';
    case 'warning': return 'text-yellow-800';
    case 'info': return 'text-blue-800';
    default: return 'text-gray-800';
  }
}

// Helper function to get alert icon
function getAlertIcon(alertType) {
  switch(alertType) {
    case 'benchmark_exceeded':
    case 'shooting_hot_streak':
    case 'scoring_milestone':
      return <Trophy className="h-4 w-4" />;
    case 'defensive_dominance':
      return <Target className="h-4 w-4" />;
    case 'triple_double_watch':
      return <BarChart3 className="h-4 w-4" />;
    case 'free_throw_concern':
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
}