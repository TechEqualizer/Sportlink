import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// AlertRule model using raw SQL - simplified for now
class AlertRule {
  static async create(ruleData) {
    // Mock implementation for now
    return {
      id: uuidv4(),
      name: ruleData.name || 'Default Rule',
      metricName: ruleData.metricName || 'benchmark_hit_rate',
      thresholdValue: ruleData.thresholdValue || 50,
      comparison: ruleData.comparison || 'below',
      severity: ruleData.severity || 'warning',
      alertMessage: ruleData.alertMessage || 'Performance threshold exceeded',
      isActive: true,
      createdAt: new Date()
    };
  }

  static async findAll(filters = {}) {
    // Return mock data
    return [
      {
        id: uuidv4(),
        name: 'Benchmark Performance Rule',
        metricName: 'benchmark_hit_rate',
        thresholdValue: 50,
        comparison: 'below',
        severity: 'warning',
        alertMessage: 'Player is below 50% benchmark hit rate',
        isActive: true,
        createdAt: new Date()
      }
    ];
  }

  static async findById(id) {
    // Mock implementation
    return {
      id,
      name: 'Sample Rule',
      metricName: 'benchmark_hit_rate',
      thresholdValue: 50,
      comparison: 'below',
      severity: 'warning',
      alertMessage: 'Performance alert',
      isActive: true,
      createdAt: new Date()
    };
  }

  static async update(id, updates) {
    // Mock implementation
    return {
      id,
      ...updates,
      updatedAt: new Date()
    };
  }
}

export default AlertRule;