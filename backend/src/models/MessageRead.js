import { query } from '../config/database.js';

// MessageRead model using raw SQL
class MessageRead {
  static async create(messageId, userId, deviceInfo = {}) {
    const now = new Date();
    const sql = `
      INSERT INTO message_reads (message_id, user_id, read_at, device_info)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (message_id, user_id) 
      DO UPDATE SET read_at = $3, device_info = $4
      RETURNING *
    `;
    
    const result = await query(sql, [messageId, userId, now, JSON.stringify(deviceInfo)]);
    return result.rows[0];
  }

  static async findByMessageId(messageId) {
    const sql = 'SELECT * FROM message_reads WHERE message_id = $1';
    const result = await query(sql, [messageId]);
    return result.rows;
  }

  static async findByUserId(userId) {
    const sql = 'SELECT * FROM message_reads WHERE user_id = $1 ORDER BY read_at DESC';
    const result = await query(sql, [userId]);
    return result.rows;
  }

  static async getUnreadCount(userId) {
    const sql = `
      SELECT COUNT(*) as unread_count
      FROM messages m
      LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = $1
      WHERE (m.recipient_id = $1 OR m.type = 'broadcast') 
        AND mr.message_id IS NULL
        AND (m.expires_at IS NULL OR m.expires_at > NOW())
    `;
    
    const result = await query(sql, [userId]);
    return parseInt(result.rows[0].unread_count);
  }

  static async getUnreadCountByPlayer(coachId) {
    const sql = `
      SELECT m.recipient_id as player_id, COUNT(*) as unread_count
      FROM messages m
      LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = m.recipient_id
      WHERE m.sender_id = $1 
        AND m.type = 'direct'
        AND mr.message_id IS NULL
        AND (m.expires_at IS NULL OR m.expires_at > NOW())
      GROUP BY m.recipient_id
    `;
    
    const result = await query(sql, [coachId]);
    const unreadCounts = {};
    result.rows.forEach(row => {
      unreadCounts[row.player_id] = parseInt(row.unread_count);
    });
    return unreadCounts;
  }
}

export default MessageRead;