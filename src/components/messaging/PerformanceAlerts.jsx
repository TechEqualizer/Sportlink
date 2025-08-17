import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  const getAlertIcon = (alertType) => {
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
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'default';
    }
  };

  const getAlertBgColor = (severity) => {
    switch(severity) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getAlertTextColor = (severity) => {
    switch(severity) {
      case 'success': return 'text-green-800';
      case 'warning': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-gray-800';
    }
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

  const formatTimeAgo = (dateString) => {
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
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Alerts</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {alerts.filter(a => a.severity === 'success').length}
              </p>
              <p className="text-sm text-gray-600">Positive</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {alerts.filter(a => a.severity === 'warning').length}
              </p>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {alerts.filter(a => !a.acknowledged).length}
              </p>
              <p className="text-sm text-gray-600">Unreviewed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-500">
                {Object.keys(alertsByPlayer).length}
              </p>
              <p className="text-sm text-gray-600">Players</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({alerts.length})
        </Button>
        <Button
          variant={filter === 'unacknowledged' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unacknowledged')}
        >
          Unreviewed ({alerts.filter(a => !a.acknowledged).length})
        </Button>
        <Button
          variant={filter === 'success' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('success')}
        >
          Positive ({alerts.filter(a => a.severity === 'success').length})
        </Button>
        <Button
          variant={filter === 'warning' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('warning')}
        >
          Warnings ({alerts.filter(a => a.severity === 'warning').length})
        </Button>
      </div>

      {/* Alerts List */}
      <ScrollArea className="h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-gray-600">No alerts to review</p>
              <p className="text-sm text-gray-500">All players are performing well!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(alertsByPlayer).map(([playerId, playerData]) => (
              <Card key={playerId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold">{playerData.playerName}</h3>
                    </div>
                    <Badge variant="secondary">
                      {playerData.alerts.length} alert{playerData.alerts.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
                        <div className={cn(
                          "p-2 rounded-lg",
                          alert.severity === 'success' ? 'bg-green-100' :
                          alert.severity === 'warning' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        )}>
                          {getAlertIcon(alert.alertType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(alert.createdAt)}
                            </span>
                            {alert.gameContext && (
                              <span className="text-xs text-gray-500">
                                • {alert.gameContext}
                              </span>
                            )}
                          </div>
                          <AlertDescription>
                            <p className={cn("font-medium", getAlertTextColor(alert.severity))}>
                              {alert.message}
                            </p>
                            {alert.metricName && alert.currentValue && (
                              <div className="mt-2 flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-600">Current:</span>
                                  <span className="font-bold">{alert.currentValue}</span>
                                </div>
                                {alert.thresholdValue && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-600">Target:</span>
                                    <span className="font-bold">{alert.thresholdValue}</span>
                                  </div>
                                )}
                                {alert.trend !== 0 && (
                                  <div className="flex items-center gap-1">
                                    {alert.trend > 0 ? (
                                      <TrendingUp className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3 text-red-600" />
                                    )}
                                    <span className={cn(
                                      "font-bold text-xs",
                                      alert.trend > 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                      {alert.trend > 0 ? '+' : ''}{alert.trend}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </AlertDescription>
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3"
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}