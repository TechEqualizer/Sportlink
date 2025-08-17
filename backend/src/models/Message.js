import pool, { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Message model using raw SQL
class Message {
  static async create(messageData) {
    const {
      type = 'direct',
      content,
      senderId,
      recipientId = null,
      status = 'sent',
      priority = 'normal',
      expiresAt = null,
      metadata = {}
    } = messageData;

    const id = uuidv4();
    const now = new Date();

    const sql = `
      INSERT INTO messages (
        id, type, content, sender_id, recipient_id, 
        status, priority, expires_at, metadata, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      id, type, content, senderId, recipientId,
      status, priority, expiresAt, JSON.stringify(metadata), now, now
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async findById(id) {
    const sql = 'SELECT * FROM messages WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM messages WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.type) {
      sql += ` AND type = $${paramCount}`;
      values.push(filters.type);
      paramCount++;
    }

    if (filters.senderId) {
      sql += ` AND sender_id = $${paramCount}`;
      values.push(filters.senderId);
      paramCount++;
    }

    if (filters.recipientId) {
      sql += ` AND recipient_id = $${paramCount}`;
      values.push(filters.recipientId);
      paramCount++;
    }

    if (filters.status) {
      sql += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      sql += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
    }

    const result = await query(sql, values);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const sql = `
      UPDATE messages 
      SET status = $1, updated_at = $2 
      WHERE id = $3 
      RETURNING *
    `;
    const result = await query(sql, [status, new Date(), id]);
    return result.rows[0];
  }

  static async delete(id) {
    const sql = 'DELETE FROM messages WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async markAsRead(messageId, userId) {
    // First, insert or update the read record
    const readSql = `
      INSERT INTO message_reads (message_id, user_id, read_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (message_id, user_id) 
      DO UPDATE SET read_at = $3
    `;
    await query(readSql, [messageId, userId, new Date()]);

    // Then update the message status if it's a direct message
    const updateSql = `
      UPDATE messages 
      SET status = 'read', updated_at = $1 
      WHERE id = $2 AND type = 'direct'
      RETURNING *
    `;
    const result = await query(updateSql, [new Date(), messageId]);
    return result.rows[0];
  }
}

export default Message;