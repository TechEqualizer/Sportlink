import Message from '../models/Message.js';
import MessageRead from '../models/MessageRead.js';
import PerformanceAlert from '../models/PerformanceAlert.js';
import { v4 as uuidv4 } from 'uuid';

// Send a broadcast message to all players
export const sendBroadcast = async (req, res) => {
  try {
    const { content, priority = 'normal', expiresAt, metadata = {} } = req.body;
    const senderId = req.user?.id || 'coach_1'; // Get from auth context

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Message content too long (max 1000 characters)' });
    }

    const message = await Message.create({
      type: 'broadcast',
      senderId,
      recipientId: null,
      content: content.trim(),
      priority,
      metadata,
      expiresAt,
      status: 'sent'
    });

    // In production, trigger SSE/WebSocket event here
    broadcastToClients('new_message', message);

    res.status(201).json({
      success: true,
      message: message,
      recipientCount: await getActivePlayerCount()
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ error: 'Failed to send broadcast' });
  }
};

// Send direct message to specific player
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, priority = 'normal', metadata = {} } = req.body;
    const senderId = req.user?.id || 'coach_1';

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Message content too long (max 500 characters)' });
    }

    const message = await Message.create({
      type: 'direct',
      senderId,
      recipientId,
      content: content.trim(),
      priority,
      metadata,
      status: 'sent'
    });

    // Trigger real-time notification
    notifyUser(recipientId, 'new_message', message);

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Direct message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages with filters
export const getMessages = async (req, res) => {
  try {
    const {
      type,
      recipientId,
      senderId,
      since,
      until,
      status,
      priority,
      limit = 50,
      offset = 0
    } = req.query;

    const userId = req.user?.id || req.query.userId;
    const where = {};

    // Build filter conditions
    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // For broadcasts or messages involving the user
    if (type === 'broadcast') {
      where.type = 'broadcast';
    } else if (userId) {
      where[Op.or] = [
        { senderId: userId },
        { recipientId: userId },
        { recipientId: null } // Include broadcasts
      ];
    }

    if (senderId) where.senderId = senderId;
    if (recipientId) where.recipientId = recipientId;

    // Date range filters
    if (since || until) {
      where.createdAt = {};
      if (since) where.createdAt[Op.gte] = new Date(since);
      if (until) where.createdAt[Op.lte] = new Date(until);
    }

    const messages = await Message.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get read status for messages
    if (userId) {
      const messageIds = messages.map(m => m.id);
      const readStatuses = await MessageRead.findAll({
        where: {
          messageId: messageIds,
          userId
        }
      });

      const readMap = new Map(readStatuses.map(r => [r.messageId, r.readAt]));
      
      messages.forEach(message => {
        message.dataValues.isRead = readMap.has(message.id);
        message.dataValues.readAt = readMap.get(message.id) || null;
      });
    }

    res.json({
      success: true,
      messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: await Message.count({ where })
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Mark message as read
export const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId;
    const deviceInfo = req.body.deviceInfo || {};

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Create or update read record
    await MessageRead.upsert({
      messageId: id,
      userId,
      readAt: new Date(),
      deviceInfo
    });

    // Update message status if it's a direct message to this user
    if (message.type === 'direct' && message.recipientId === userId) {
      await message.update({ status: 'read' });
    }

    // Notify sender of read receipt
    if (message.senderId !== userId) {
      notifyUser(message.senderId, 'read_receipt', {
        messageId: id,
        readBy: userId,
        readAt: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    // Get all messages for user
    const allMessages = await Message.findAll({
      where: {
        [Op.or]: [
          { recipientId: userId },
          { recipientId: null, type: 'broadcast' }
        ]
      },
      attributes: ['id']
    });

    const messageIds = allMessages.map(m => m.id);

    // Get read messages
    const readMessages = await MessageRead.findAll({
      where: {
        messageId: messageIds,
        userId
      },
      attributes: ['messageId']
    });

    const readIds = new Set(readMessages.map(r => r.messageId));
    const unreadCount = messageIds.filter(id => !readIds.has(id)).length;

    res.json({
      success: true,
      unreadCount,
      totalMessages: messageIds.length
    });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

// Delete a message (soft delete)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'coach_1';

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender can delete
    if (message.senderId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await message.destroy();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

// Helper functions
async function getActivePlayerCount() {
  // In production, query actual player count from database
  return 15; // Mock value
}

function broadcastToClients(event, data) {
  // SSE implementation will go here
  console.log('Broadcasting:', event, data);
}

function notifyUser(userId, event, data) {
  // User-specific notification
  console.log('Notifying user:', userId, event, data);
}

export default {
  sendBroadcast,
  sendDirectMessage,
  getMessages,
  markMessageRead,
  getUnreadCount,
  deleteMessage
};