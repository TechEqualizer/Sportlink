import MockMessage from '../models/MockMessage.js';
import Player from '../models/Player.js';
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

    const message = await MockMessage.create({
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

    const message = await MockMessage.create({
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
      status,
      priority,
      limit = 50
    } = req.query;

    const userId = req.user?.id || req.query.userId || 'coach_1';
    const filters = {};

    // Build filter conditions
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (senderId) filters.senderId = senderId;
    if (recipientId) filters.recipientId = recipientId;
    if (limit) filters.limit = parseInt(limit);
    
    // Include user in filter to get relevant messages
    filters.userId = userId;

    const messages = await MockMessage.findAllWithPlayerNames(filters);

    // Organize messages by type for easier frontend consumption
    const organizedMessages = {
      broadcasts: messages.filter(m => m.type === 'broadcast'),
      direct: {},
      alerts: [] // Will be populated from alerts endpoint
    };

    // Group direct messages by conversation partner
    const directMessages = messages.filter(m => m.type === 'direct');
    directMessages.forEach(msg => {
      const partnerId = msg.senderId === userId ? msg.recipientId : msg.senderId;
      if (!organizedMessages.direct[partnerId]) {
        organizedMessages.direct[partnerId] = [];
      }
      organizedMessages.direct[partnerId].push(msg);
    });

    res.json({
      success: true,
      ...organizedMessages,
      total: messages.length
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve messages',
      message: error.message 
    });
  }
};

// Mark message as read
export const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId || 'coach_1';

    const message = await MockMessage.markAsRead(id, userId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message not found' 
      });
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
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark message as read',
      message: error.message 
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || 'coach_1';

    // Get all messages for user
    const allMessages = await MockMessage.findAll({ userId });
    
    // Count unread messages (those sent to the user that haven't been read)
    const unreadCount = allMessages.filter(msg => 
      msg.recipientId === userId && msg.status !== 'read'
    ).length;

    res.json({
      success: true,
      unreadCount,
      totalMessages: allMessages.length
    });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get unread count',
      message: error.message 
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'coach_1';

    const message = await MockMessage.findById(id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message not found' 
      });
    }

    // Only sender can delete
    if (message.senderId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to delete this message' 
      });
    }

    await MockMessage.delete(id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete message',
      message: error.message 
    });
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