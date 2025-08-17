export const up = async (queryInterface, Sequelize) => {
  // Create messages table
  await queryInterface.createTable('messages', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    type: {
      type: Sequelize.ENUM('broadcast', 'direct', 'alert'),
      allowNull: false
    },
    sender_id: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    recipient_id: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    priority: {
      type: Sequelize.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal'
    },
    metadata: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    status: {
      type: Sequelize.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent'
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  // Create message_reads table
  await queryInterface.createTable('message_reads', {
    message_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      references: {
        model: 'messages',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: Sequelize.STRING(50),
      primaryKey: true
    },
    read_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    device_info: {
      type: Sequelize.JSON,
      defaultValue: {}
    }
  });

  // Create performance_alerts table
  await queryInterface.createTable('performance_alerts', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    player_id: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    alert_type: {
      type: Sequelize.ENUM(
        'benchmark_low',
        'negative_trend',
        'missed_games',
        'academic_decline',
        'improvement',
        'milestone_reached'
      ),
      allowNull: false
    },
    severity: {
      type: Sequelize.ENUM('info', 'warning', 'alert', 'critical'),
      defaultValue: 'info'
    },
    metric: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    current_value: {
      type: Sequelize.DECIMAL(10, 2)
    },
    threshold_value: {
      type: Sequelize.DECIMAL(10, 2)
    },
    trend: {
      type: Sequelize.DECIMAL(5, 2)
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    action_required: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    acknowledged: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    acknowledged_by: {
      type: Sequelize.STRING(50)
    },
    acknowledged_at: {
      type: Sequelize.DATE
    },
    resolved_at: {
      type: Sequelize.DATE
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  // Create alert_rules table
  await queryInterface.createTable('alert_rules', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(200),
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT
    },
    metric_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    comparison: {
      type: Sequelize.ENUM('below', 'above', 'equals', 'between'),
      allowNull: false
    },
    threshold_value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    secondary_threshold: {
      type: Sequelize.DECIMAL(10, 2)
    },
    time_window: {
      type: Sequelize.INTEGER,
      defaultValue: 7
    },
    alert_type: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    severity: {
      type: Sequelize.ENUM('info', 'warning', 'alert', 'critical'),
      defaultValue: 'warning'
    },
    alert_message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    check_frequency: {
      type: Sequelize.ENUM('realtime', 'hourly', 'daily', 'weekly'),
      defaultValue: 'daily'
    },
    applies_to: {
      type: Sequelize.ENUM('all', 'starters', 'bench', 'specific'),
      defaultValue: 'all'
    },
    specific_players: {
      type: Sequelize.JSON,
      defaultValue: []
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  // Add indexes
  await queryInterface.addIndex('messages', ['type']);
  await queryInterface.addIndex('messages', ['sender_id']);
  await queryInterface.addIndex('messages', ['recipient_id']);
  await queryInterface.addIndex('messages', ['status']);
  await queryInterface.addIndex('messages', ['created_at']);
  await queryInterface.addIndex('messages', ['priority', 'created_at']);

  await queryInterface.addIndex('message_reads', ['user_id', 'read_at']);

  await queryInterface.addIndex('performance_alerts', ['player_id']);
  await queryInterface.addIndex('performance_alerts', ['alert_type']);
  await queryInterface.addIndex('performance_alerts', ['severity']);
  await queryInterface.addIndex('performance_alerts', ['acknowledged']);
  await queryInterface.addIndex('performance_alerts', ['created_at']);
  await queryInterface.addIndex('performance_alerts', ['acknowledged', 'severity', 'created_at'], {
    name: 'idx_active_alerts'
  });

  await queryInterface.addIndex('alert_rules', ['is_active']);
  await queryInterface.addIndex('alert_rules', ['metric_name']);
  await queryInterface.addIndex('alert_rules', ['check_frequency']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('message_reads');
  await queryInterface.dropTable('performance_alerts');
  await queryInterface.dropTable('alert_rules');
  await queryInterface.dropTable('messages');
};