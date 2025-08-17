import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// PerformanceAlert model - using mock data with realistic functionality
class PerformanceAlert {
  static async create(alertData) {
    const {
      playerId,
      alertType,
      severity = 'warning',
      message,
      metricName,
      currentValue,
      thresholdValue,
      metadata = {}
    } = alertData;

    const alert = {
      id: uuidv4(),
      playerId: playerId || 'player_1',
      alertType: alertType || 'performance_drop',
      severity,
      message: message || 'Performance alert triggered',
      metricName,
      currentValue,
      thresholdValue,
      metadata,
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null,
      triggeredAt: new Date(),
      createdAt: new Date()
    };

    // In production, this would save to database
    // For now, we store in memory (this will reset on server restart)
    if (!global.mockAlerts) {
      global.mockAlerts = [];
    }
    global.mockAlerts.push(alert);

    return alert;
  }

  static async findAll(filters = {}) {
    // Initialize mock data if not exists
    if (!global.mockAlerts) {
      global.mockAlerts = [
        {
          id: uuidv4(),
          playerId: '1',
          playerName: 'John Smith',
          alertType: 'benchmark_low',
          severity: 'warning',
          message: 'John Smith is below 50% benchmark hit rate (Current: 35%)',
          metricName: 'benchmark_hit_rate',
          currentValue: 35,
          thresholdValue: 50,
          acknowledged: false,
          acknowledgedBy: null,
          acknowledgedAt: null,
          triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: uuidv4(),
          playerId: '2',
          playerName: 'Sarah Johnson',
          alertType: 'negative_trend',
          severity: 'alert',
          message: 'Sarah Johnson showing -15% performance trend over last 7 days',
          metricName: 'performance_trend',
          currentValue: -15,
          thresholdValue: -10,
          acknowledged: false,
          acknowledgedBy: null,
          acknowledgedAt: null,
          triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          id: uuidv4(),
          playerId: '3',
          playerName: 'Mike Williams',
          alertType: 'shooting_drop',
          severity: 'critical',
          message: 'Mike Williams shooting percentage dropped to 28% (below 40% threshold)',
          metricName: 'shooting_percentage',
          currentValue: 28,
          thresholdValue: 40,
          acknowledged: true,
          acknowledgedBy: 'coach_1',
          acknowledgedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          triggeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ];
    }

    let alerts = [...global.mockAlerts];

    // Apply filters
    if (filters.playerId) {
      alerts = alerts.filter(alert => alert.playerId === filters.playerId);
    }
    if (filters.alertType) {
      alerts = alerts.filter(alert => alert.alertType === filters.alertType);
    }
    if (filters.severity) {
      alerts = alerts.filter(alert => alert.severity === filters.severity);
    }
    if (filters.acknowledged !== undefined) {
      alerts = alerts.filter(alert => alert.acknowledged === filters.acknowledged);
    }

    // Sort by severity (critical first) then by time (newest first)
    alerts.sort((a, b) => {
      const severityOrder = { critical: 3, warning: 2, info: 1 };
      const severityDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      if (severityDiff !== 0) return severityDiff;
      
      return new Date(b.triggeredAt) - new Date(a.triggeredAt);
    });

    // Apply limit
    if (filters.limit) {
      alerts = alerts.slice(0, filters.limit);
    }

    return alerts;
  }

  static async acknowledge(id, acknowledgedBy) {
    if (!global.mockAlerts) {
      return null;
    }

    const alertIndex = global.mockAlerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) {
      return null;
    }

    global.mockAlerts[alertIndex] = {
      ...global.mockAlerts[alertIndex],
      acknowledged: true,
      acknowledgedBy,
      acknowledgedAt: new Date()
    };

    return global.mockAlerts[alertIndex];
  }

  static async findById(id) {
    if (!global.mockAlerts) {
      return null;
    }

    return global.mockAlerts.find(alert => alert.id === id) || null;
  }
}

export default PerformanceAlert;