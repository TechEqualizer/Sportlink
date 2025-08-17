import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// PerformanceAlert model using raw SQL - simplified for now
class PerformanceAlert {
  static async create(alertData) {
    // For now, just return mock data since we don't have the table created
    return {
      id: uuidv4(),
      playerId: alertData.playerId || 'player_1',
      alertType: alertData.alertType || 'performance_drop',
      severity: alertData.severity || 'warning',
      message: alertData.message || 'Performance alert triggered',
      triggeredAt: new Date(),
      acknowledged: false
    };
  }

  static async findAll(filters = {}) {
    // Return mock data for now
    return [
      {
        id: uuidv4(),
        playerId: 'player_1',
        alertType: 'benchmark_low',
        severity: 'warning',
        message: 'Player is below 50% benchmark hit rate',
        triggeredAt: new Date(),
        acknowledged: false
      }
    ];
  }

  static async acknowledge(id, acknowledgedBy) {
    // Mock implementation
    return {
      id,
      acknowledged: true,
      acknowledgedBy,
      acknowledgedAt: new Date()
    };
  }
}

export default PerformanceAlert;