import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useMessages } from "@/contexts/MessageContext";
import { 
  AlertTriangle,
  TrendingDown,
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  Filter,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PerformanceAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // API Base URL - same configuration as MessageContext
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api';

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/messages/alerts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAlerts(data.alerts || []);
      } else {
        console.error('Failed to fetch alerts:', data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to load performance alerts",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: `Failed to load performance alerts: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      const response = await fetch(`${API_BASE}/messages/alerts/${alertId}/acknowledge`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true, acknowledgedAt: new Date() }
            : alert
        ));
        toast({
          title: "Alert Acknowledged",
          description: "The alert has been marked as reviewed"
        });
      } else {
        throw new Error(data.error || 'Failed to acknowledge alert');
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      toast({
        title: "Error",
        description: `Failed to acknowledge alert: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'benchmark_low': return <Target className="h-4 w-4" />;
      case 'negative_trend': return <TrendingDown className="h-4 w-4" />;
      case 'improvement': return <Trophy className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'destructive';
      case 'alert': return 'warning';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    if (filter === 'critical') return alert.severity === 'critical';
    return alert.alertType === filter;
  });

  // Group alerts by player
  const alertsByPlayer = filteredAlerts.reduce((acc, alert) => {
    if (!acc[alert.playerId]) {
      acc[alert.playerId] = {
        playerName: alert.playerName || `Player ${alert.playerId}`,
        alerts: []
      };
    }
    acc[alert.playerId].alerts.push(alert);
    return acc;
  }, {});

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
              onClick={fetchAlerts}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{alerts.filter(a => a.severity === 'critical').length}</p>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{alerts.filter(a => a.severity === 'alert').length}</p>
              <p className="text-sm text-gray-600">Alerts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{alerts.filter(a => !a.acknowledged).length}</p>
              <p className="text-sm text-gray-600">Unreviewed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-500">{Object.keys(alertsByPlayer).length}</p>
              <p className="text-sm text-gray-600">Players Affected</p>
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
          variant={filter === 'critical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('critical')}
        >
          Critical ({alerts.filter(a => a.severity === 'critical').length})
        </Button>
        <Button
          variant={filter === 'benchmark_low' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('benchmark_low')}
        >
          Below Benchmark
        </Button>
        <Button
          variant={filter === 'negative_trend' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('negative_trend')}
        >
          Negative Trends
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
                    <h3 className="font-semibold">{playerData.playerName}</h3>
                    <Badge variant="secondary">
                      {playerData.alerts.length} alert{playerData.alerts.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {playerData.alerts.map(alert => (
                    <Alert 
                      key={alert.id}
                      className={cn(
                        "relative",
                        alert.acknowledged && "opacity-60"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          alert.severity === 'critical' ? 'bg-red-100' :
                          alert.severity === 'alert' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        )}>
                          {getAlertIcon(alert.alertType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <AlertDescription>
                            <p className="font-medium">{alert.message}</p>
                            {alert.metric && (
                              <p className="text-sm text-gray-600 mt-1">
                                {alert.metric}: {alert.currentValue} 
                                {alert.thresholdValue && ` (threshold: ${alert.thresholdValue})`}
                                {alert.trend && (
                                  <span className={cn(
                                    "ml-2",
                                    alert.trend > 0 ? "text-green-600" : "text-red-600"
                                  )}>
                                    {alert.trend > 0 ? '+' : ''}{alert.trend}%
                                  </span>
                                )}
                              </p>
                            )}
                          </AlertDescription>
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              Mark as Reviewed
                            </Button>
                          )}
                          {alert.acknowledged && (
                            <p className="text-xs text-gray-500 mt-2">
                              Reviewed on {new Date(alert.acknowledgedAt).toLocaleDateString()}
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