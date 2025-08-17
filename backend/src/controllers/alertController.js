import PerformanceAlert from '../models/PerformanceAlert.js';
import AlertRule from '../models/AlertRule.js';
import Message from '../models/Message.js';
import { Op } from 'sequelize';

// Get performance alerts for coach dashboard
export const getAlerts = async (req, res) => {
  try {
    const {
      playerId,
      alertType,
      severity,
      acknowledged,
      since,
      until,
      limit = 20,
      offset = 0
    } = req.query;

    const where = {};

    if (playerId) where.playerId = playerId;
    if (alertType) where.alertType = alertType;
    if (severity) where.severity = severity;
    if (acknowledged !== undefined) where.acknowledged = acknowledged === 'true';

    if (since || until) {
      where.createdAt = {};
      if (since) where.createdAt[Op.gte] = new Date(since);
      if (until) where.createdAt[Op.lte] = new Date(until);
    }

    const alerts = await PerformanceAlert.findAll({
      where,
      order: [
        ['acknowledged', 'ASC'],
        ['severity', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

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
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: await PerformanceAlert.count({ where })
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to retrieve alerts' });
  }
};

// Get alert summary for quick dashboard view
export const getAlertSummary = async (req, res) => {
  try {
    const summary = {
      total: 0,
      unacknowledged: 0,
      bySeverity: {},
      byType: {},
      recentCritical: [],
      atRiskPlayers: []
    };

    // Get counts by severity
    const severityCounts = await PerformanceAlert.findAll({
      attributes: [
        'severity',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { acknowledged: false },
      group: ['severity']
    });

    severityCounts.forEach(row => {
      summary.bySeverity[row.severity] = parseInt(row.dataValues.count);
      summary.unacknowledged += parseInt(row.dataValues.count);
    });

    // Get counts by type
    const typeCounts = await PerformanceAlert.findAll({
      attributes: [
        'alertType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { acknowledged: false },
      group: ['alertType']
    });

    typeCounts.forEach(row => {
      summary.byType[row.alertType] = parseInt(row.dataValues.count);
    });

    // Get recent critical alerts
    summary.recentCritical = await PerformanceAlert.findAll({
      where: {
        severity: 'critical',
        acknowledged: false
      },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get at-risk players (players with multiple unacknowledged alerts)
    const atRiskData = await PerformanceAlert.findAll({
      attributes: [
        'playerId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'alertCount'],
        [sequelize.fn('MAX', sequelize.col('severity')), 'maxSeverity']
      ],
      where: { acknowledged: false },
      group: ['playerId'],
      having: sequelize.where(sequelize.fn('COUNT', sequelize.col('id')), '>=', 2),
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    summary.atRiskPlayers = atRiskData.map(row => ({
      playerId: row.playerId,
      alertCount: parseInt(row.dataValues.alertCount),
      maxSeverity: row.dataValues.maxSeverity
    }));

    summary.total = await PerformanceAlert.count();

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Get alert summary error:', error);
    res.status(500).json({ error: 'Failed to retrieve alert summary' });
  }
};

// Acknowledge an alert
export const acknowledgeAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'coach_1';

    const alert = await PerformanceAlert.findByPk(id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await alert.update({
      acknowledged: true,
      acknowledgedBy: userId,
      acknowledgedAt: new Date()
    });

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
};

// Create manual alert
export const createAlert = async (req, res) => {
  try {
    const {
      playerId,
      alertType,
      severity = 'info',
      metric,
      currentValue,
      thresholdValue,
      message,
      actionRequired = false
    } = req.body;

    if (!playerId || !alertType || !metric || !message) {
      return res.status(400).json({ 
        error: 'Required fields: playerId, alertType, metric, message' 
      });
    }

    const alert = await PerformanceAlert.create({
      playerId,
      alertType,
      severity,
      metric,
      currentValue,
      thresholdValue,
      message,
      actionRequired
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
          metric
        }
      });
    }

    res.status(201).json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

// Get alert rules
export const getAlertRules = async (req, res) => {
  try {
    const rules = await AlertRule.findAll({
      where: { isActive: true },
      order: [['severity', 'DESC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      rules
    });
  } catch (error) {
    console.error('Get alert rules error:', error);
    res.status(500).json({ error: 'Failed to retrieve alert rules' });
  }
};

// Create or update alert rule
export const upsertAlertRule = async (req, res) => {
  try {
    const {
      name,
      description,
      metricName,
      comparison,
      thresholdValue,
      secondaryThreshold,
      timeWindow = 7,
      alertType,
      severity = 'warning',
      alertMessage,
      checkFrequency = 'daily',
      appliesTo = 'all',
      specificPlayers = []
    } = req.body;

    if (!name || !metricName || !comparison || !thresholdValue || !alertType || !alertMessage) {
      return res.status(400).json({
        error: 'Required fields: name, metricName, comparison, thresholdValue, alertType, alertMessage'
      });
    }

    const [rule, created] = await AlertRule.upsert({
      name,
      description,
      metricName,
      comparison,
      thresholdValue,
      secondaryThreshold,
      timeWindow,
      alertType,
      severity,
      alertMessage,
      checkFrequency,
      appliesTo,
      specificPlayers,
      isActive: true
    }, {
      returning: true
    });

    res.json({
      success: true,
      rule,
      created
    });
  } catch (error) {
    console.error('Upsert alert rule error:', error);
    res.status(500).json({ error: 'Failed to save alert rule' });
  }
};

// Run alert checks (called by cron job or manually)
export const runAlertChecks = async (req, res) => {
  try {
    const activeRules = await AlertRule.findAll({
      where: { isActive: true }
    });

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
            metric: rule.metricName,
            currentValue: metricValue,
            thresholdValue: rule.thresholdValue,
            message: formatAlertMessage(rule.alertMessage, player, metricValue),
            actionRequired: rule.severity === 'critical'
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
    res.status(500).json({ error: 'Failed to run alert checks' });
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