-- Create message types and enums
CREATE TYPE message_type AS ENUM ('broadcast', 'direct', 'alert');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE message_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'alert', 'critical');

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type message_type NOT NULL DEFAULT 'direct',
    content TEXT NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    recipient_id VARCHAR(50), -- NULL for broadcasts
    status message_status DEFAULT 'sent',
    priority message_priority DEFAULT 'normal',
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Message reads table (for tracking who read what)
CREATE TABLE IF NOT EXISTS message_reads (
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL,
    read_at TIMESTAMP DEFAULT NOW(),
    device_info JSONB DEFAULT '{}',
    PRIMARY KEY (message_id, user_id)
);

-- Performance alerts table
CREATE TABLE IF NOT EXISTS performance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(50) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    severity alert_severity DEFAULT 'info',
    message TEXT NOT NULL,
    metric_name VARCHAR(100),
    current_value DECIMAL,
    threshold_value DECIMAL,
    percentage_change DECIMAL,
    benchmark_data JSONB DEFAULT '{}',
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(50),
    acknowledged_at TIMESTAMP,
    triggered_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Alert rules table (for defining automatic alert conditions)
CREATE TABLE IF NOT EXISTS alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    metric_name VARCHAR(100) NOT NULL,
    threshold_value DECIMAL NOT NULL,
    comparison VARCHAR(20) NOT NULL CHECK (comparison IN ('below', 'above', 'equals', 'not_equals')),
    severity alert_severity DEFAULT 'warning',
    alert_message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_type ON messages(type);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_priority_created_at ON messages(priority, created_at);

CREATE INDEX idx_message_reads_user_id_read_at ON message_reads(user_id, read_at);

CREATE INDEX idx_performance_alerts_player_id ON performance_alerts(player_id);
CREATE INDEX idx_performance_alerts_alert_type ON performance_alerts(alert_type);
CREATE INDEX idx_performance_alerts_severity ON performance_alerts(severity);
CREATE INDEX idx_performance_alerts_acknowledged ON performance_alerts(acknowledged);
CREATE INDEX idx_performance_alerts_triggered_at ON performance_alerts(triggered_at);

CREATE INDEX idx_alert_rules_metric_name ON alert_rules(metric_name);
CREATE INDEX idx_alert_rules_is_active ON alert_rules(is_active);