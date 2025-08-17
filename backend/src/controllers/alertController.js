import PerformanceAlert from '../models/PerformanceAlert.js';
import AlertRule from '../models/AlertRule.js';
import Message from '../models/Message.js';

// Get performance alerts for coach dashboard
export const getAlerts = async (req, res) => {
  try {
    const {
      playerId,
      alertType,
      severity,
      acknowledged,
      limit = 20
    } = req.query;

    // Build filters object for our raw SQL model
    const filters = {};
    if (playerId) filters.playerId = playerId;
    if (alertType) filters.alertType = alertType;
    if (severity) filters.severity = severity;
    if (acknowledged !== undefined) filters.acknowledged = acknowledged === 'true';
    if (limit) filters.limit = parseInt(limit);

    const alerts = await PerformanceAlert.findAll(filters);

    // Group alerts by player for easier consumption
    const alertsByPlayer = {};
    alerts.forEach(alert => {
      if (!alertsByPlayer[alert.playerId]) {
        alertsByPlayer[alert.playerId] = [];
      }
      alertsByPlayer[alert.playerId].push(alert);
    });

    res.json({
      success: true,
      alerts,
      alertsByPlayer,
      total: alerts.length
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve alerts',
      message: error.message 
    });
  }
};

// Get alert summary for quick dashboard view
export const getAlertSummary = async (req, res) => {
  try {
    // Get all alerts for summary calculation
    const allAlerts = await PerformanceAlert.findAll();
    
    const summary = {
      total: allAlerts.length,
      unacknowledged: allAlerts.filter(a => !a.acknowledged).length,
      bySeverity: {
        critical: allAlerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
        warning: allAlerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
        info: allAlerts.filter(a => a.severity === 'info' && !a.acknowledged).length
      },
      byType: {},
      recentCritical: allAlerts.filter(a => a.severity === 'critical' && !a.acknowledged).slice(0, 5),
      atRiskPlayers: []
    };

    // Count by alert type
    const typeCounts = {};
    allAlerts.forEach(alert => {
      if (!alert.acknowledged) {
        typeCounts[alert.alertType] = (typeCounts[alert.alertType] || 0) + 1;
      }
    });
    summary.byType = typeCounts;

    // Find at-risk players (multiple alerts)
    const playerAlertCounts = {};
    allAlerts.forEach(alert => {
      if (!alert.acknowledged) {
        if (!playerAlertCounts[alert.playerId]) {
          playerAlertCounts[alert.playerId] = { count: 0, maxSeverity: 'info' };
        }
        playerAlertCounts[alert.playerId].count++;
        if (alert.severity === 'critical') {
          playerAlertCounts[alert.playerId].maxSeverity = 'critical';
        } else if (alert.severity === 'warning' && playerAlertCounts[alert.playerId].maxSeverity !== 'critical') {
          playerAlertCounts[alert.playerId].maxSeverity = 'warning';
        }
      }
    });

    summary.atRiskPlayers = Object.entries(playerAlertCounts)
      .filter(([_, data]) => data.count >= 2)
      .map(([playerId, data]) => ({
        playerId,
        alertCount: data.count,
        maxSeverity: data.maxSeverity
      }));

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Get alert summary error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve alert summary',
      message: error.message 
    });
  }
};

// Acknowledge an alert
export const acknowledgeAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'coach_1';

    const alert = await PerformanceAlert.acknowledge(id, userId);
    if (!alert) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alert not found' 
      });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to acknowledge alert',
      message: error.message 
    });
  }
};

// Create manual alert
export const createAlert = async (req, res) => {
  try {
    const {
      playerId,
      alertType,
      severity = 'info',
      metricName,
      currentValue,
      thresholdValue,
      message,
      actionRequired = false
    } = req.body;

    if (!playerId || !alertType || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Required fields: playerId, alertType, message' 
      });
    }

    const alert = await PerformanceAlert.create({
      playerId,
      alertType,
      severity,
      message,
      metricName,
      currentValue,
      thresholdValue
    });

    // Also create a message for the player if it's actionRequired
    if (actionRequired) {
      await Message.create({
        type: 'alert',
        senderId: 'system',
        recipientId: playerId,
        content: message,
        priority: severity === 'critical' ? 'urgent' : 'high',
        metadata: {
          alertId: alert.id,
          alertType,
          metricName
        }
      });
    }

    res.status(201).json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create alert',
      message: error.message 
    });
  }
};

// Get alert rules
export const getAlertRules = async (req, res) => {
  try {
    const rules = await AlertRule.findAll({ isActive: true });

    res.json({
      success: true,
      rules
    });
  } catch (error) {
    console.error('Get alert rules error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve alert rules',
      message: error.message 
    });
  }
};

// Create or update alert rule
export const upsertAlertRule = async (req, res) => {
  try {
    const {
      name,
      metricName,
      comparison,
      thresholdValue,
      alertType,
      severity = 'warning',
      alertMessage
    } = req.body;

    if (!name || !metricName || !comparison || !thresholdValue || !alertType || !alertMessage) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: name, metricName, comparison, thresholdValue, alertType, alertMessage'
      });
    }

    const rule = await AlertRule.create({
      name,
      metricName,
      comparison,
      thresholdValue,
      alertType,
      severity,
      alertMessage
    });

    res.json({
      success: true,
      rule,
      created: true
    });
  } catch (error) {
    console.error('Upsert alert rule error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save alert rule',
      message: error.message 
    });
  }
};

// Run alert checks (called by cron job or manually)
export const runAlertChecks = async (req, res) => {
  try {
    const activeRules = await AlertRule.findAll({ isActive: true });
    const alertsGenerated = [];

    for (const rule of activeRules) {
      // This would connect to your actual player stats
      const playersToCheck = await getPlayersForRule(rule);
      
      for (const player of playersToCheck) {
        const metricValue = await getPlayerMetric(player.id, rule.metricName);
        
        if (shouldTriggerAlert(metricValue, rule)) {
          const alert = await PerformanceAlert.create({
            playerId: player.id,
            alertType: rule.alertType,
            severity: rule.severity,
            metricName: rule.metricName,
            currentValue: metricValue,
            thresholdValue: rule.thresholdValue,
            message: formatAlertMessage(rule.alertMessage, player, metricValue)
          });
          
          alertsGenerated.push(alert);
        }
      }
    }

    res.json({
      success: true,
      alertsGenerated: alertsGenerated.length,
      alerts: alertsGenerated
    });
  } catch (error) {
    console.error('Run alert checks error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to run alert checks',
      message: error.message 
    });
  }
};

// Helper functions
async function getPlayersForRule(rule) {
  // Mock implementation - replace with actual player query
  return [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Mike Williams' }
  ];
}

async function getPlayerMetric(playerId, metricName) {
  // Mock implementation - replace with actual stats query
  const mockMetrics = {
    ppg: Math.random() * 30,
    benchmark_hit_rate: Math.random() * 100,
    shooting_percentage: Math.random() * 60
  };
  return mockMetrics[metricName] || 0;
}

function shouldTriggerAlert(value, rule) {
  switch (rule.comparison) {
    case 'below':
      return value < rule.thresholdValue;
    case 'above':
      return value > rule.thresholdValue;
    case 'equals':
      return value === rule.thresholdValue;
    case 'between':
      return value >= rule.thresholdValue && value <= rule.secondaryThreshold;
    default:
      return false;
  }
}

function formatAlertMessage(template, player, value) {
  return template
    .replace('{player_name}', player.name)
    .replace('{value}', value.toFixed(2));
}

export default {
  getAlerts,
  getAlertSummary,
  acknowledgeAlert,
  createAlert,
  getAlertRules,
  upsertAlertRule,
  runAlertChecks
};