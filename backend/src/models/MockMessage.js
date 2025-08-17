import { v4 as uuidv4 } from 'uuid';
import Player from './Player.js';

// Mock Message model for development
class MockMessage {
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

    const message = {
      id: uuidv4(),
      type,
      content,
      senderId,
      recipientId,
      status,
      priority,
      expiresAt,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Initialize mock messages if not exists
    if (!global.mockMessages) {
      global.mockMessages = [];
    }
    global.mockMessages.push(message);

    return message;
  }

  static async findAll(filters = {}) {
    // Initialize mock messages if not exists
    if (!global.mockMessages) {
      global.mockMessages = [
        // Some sample broadcast messages
        {
          id: uuidv4(),
          type: 'broadcast',
          content: 'Great practice today everyone! Keep up the hard work.',
          senderId: 'coach_1',
          recipientId: null,
          status: 'sent',
          priority: 'normal',
          expiresAt: null,
          metadata: {},
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        // Sample direct messages with different players
        {
          id: uuidv4(),
          type: 'direct',
          content: 'Hey coach, I have a question about the play we practiced.',
          senderId: '1', // John Smith
          recipientId: 'coach_1',
          status: 'sent',
          priority: 'normal',
          expiresAt: null,
          metadata: {},
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          updatedAt: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: uuidv4(),
          type: 'direct',
          content: 'Good question! Let\'s discuss it after practice tomorrow.',
          senderId: 'coach_1',
          recipientId: '1', // John Smith
          status: 'sent',
          priority: 'normal',
          expiresAt: null,
          metadata: {},
          createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
          updatedAt: new Date(Date.now() - 25 * 60 * 1000)
        },
        {
          id: uuidv4(),
          type: 'direct',
          content: 'Will I be starting in tomorrow\'s game?',
          senderId: '2', // Sarah Johnson
          recipientId: 'coach_1',
          status: 'sent',
          priority: 'normal',
          expiresAt: null,
          metadata: {},
          createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          updatedAt: new Date(Date.now() - 45 * 60 * 1000)
        },
        {
          id: uuidv4(),
          type: 'direct',
          content: 'Yes, you\'ve earned it with your performance this week!',
          senderId: 'coach_1',
          recipientId: '2', // Sarah Johnson
          status: 'read',
          priority: 'normal',
          expiresAt: null,
          metadata: {},
          createdAt: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
          updatedAt: new Date(Date.now() - 40 * 60 * 1000)
        }
      ];
    }

    let messages = [...global.mockMessages];

    // Apply filters
    if (filters.type) {
      messages = messages.filter(msg => msg.type === filters.type);
    }
    if (filters.senderId) {
      messages = messages.filter(msg => msg.senderId === filters.senderId);
    }
    if (filters.recipientId) {
      messages = messages.filter(msg => msg.recipientId === filters.recipientId);
    }
    if (filters.status) {
      messages = messages.filter(msg => msg.status === filters.status);
    }
    if (filters.priority) {
      messages = messages.filter(msg => msg.priority === filters.priority);
    }

    // For user-specific queries (get all messages involving a user)
    if (filters.userId) {
      messages = messages.filter(msg => 
        msg.senderId === filters.userId || 
        msg.recipientId === filters.userId ||
        (msg.type === 'broadcast' && msg.recipientId === null)
      );
    }

    // Sort by creation date (newest first)
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply limit
    if (filters.limit) {
      messages = messages.slice(0, filters.limit);
    }

    return messages;
  }

  static async findById(id) {
    if (!global.mockMessages) {
      await this.findAll(); // Initialize mock data
    }

    return global.mockMessages.find(msg => msg.id === id) || null;
  }

  static async updateStatus(id, status) {
    if (!global.mockMessages) {
      return null;
    }

    const messageIndex = global.mockMessages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return null;
    }

    global.mockMessages[messageIndex] = {
      ...global.mockMessages[messageIndex],
      status,
      updatedAt: new Date()
    };

    return global.mockMessages[messageIndex];
  }

  static async delete(id) {
    if (!global.mockMessages) {
      return null;
    }

    const messageIndex = global.mockMessages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return null;
    }

    const deletedMessage = global.mockMessages[messageIndex];
    global.mockMessages.splice(messageIndex, 1);
    return deletedMessage;
  }

  // Enhanced method to get messages with player names
  static async findAllWithPlayerNames(filters = {}) {
    const messages = await this.findAll(filters);
    
    // Get all unique player IDs from the messages
    const playerIds = new Set();
    messages.forEach(msg => {
      if (msg.senderId && msg.senderId !== 'coach_1') {
        playerIds.add(msg.senderId);
      }
      if (msg.recipientId && msg.recipientId !== 'coach_1') {
        playerIds.add(msg.recipientId);
      }
    });

    // Get player names
    const playerNames = await Player.getPlayerNames([...playerIds]);

    // Add player names to messages
    const messagesWithNames = messages.map(msg => ({
      ...msg,
      senderName: msg.senderId === 'coach_1' ? 'Coach' : (playerNames[msg.senderId] || `Player ${msg.senderId}`),
      recipientName: msg.recipientId === 'coach_1' ? 'Coach' : (playerNames[msg.recipientId] || `Player ${msg.recipientId}`)
    }));

    return messagesWithNames;
  }

  // Method to organize messages by conversation (for direct messages)
  static async getDirectMessageConversations(userId = 'coach_1') {
    const messages = await this.findAllWithPlayerNames({
      type: 'direct',
      userId: userId
    });

    const conversations = {};
    
    messages.forEach(msg => {
      // Determine the other participant in the conversation
      const otherUserId = msg.senderId === userId ? msg.recipientId : msg.senderId;
      const otherUserName = msg.senderId === userId ? msg.recipientName : msg.senderName;

      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          participantId: otherUserId,
          participantName: otherUserName,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        };
      }

      conversations[otherUserId].messages.push(msg);
      
      // Update last message
      if (!conversations[otherUserId].lastMessage || 
          new Date(msg.createdAt) > new Date(conversations[otherUserId].lastMessage.createdAt)) {
        conversations[otherUserId].lastMessage = msg;
      }

      // Count unread messages (messages sent to the user that haven't been read)
      if (msg.recipientId === userId && msg.status !== 'read') {
        conversations[otherUserId].unreadCount++;
      }
    });

    // Sort conversations by last message time
    Object.values(conversations).forEach(conv => {
      conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    return conversations;
  }

  static async markAsRead(messageId, userId = 'coach_1') {
    const message = await this.findById(messageId);
    if (!message) return null;

    // Only mark as read if the user is the recipient
    if (message.recipientId === userId) {
      return await this.updateStatus(messageId, 'read');
    }

    return message;
  }
}

export default MockMessage;