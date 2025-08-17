// Server-Sent Events service for real-time updates
class SSEService {
  constructor() {
    this.clients = new Map(); // userId -> response object
  }

  // Add a new SSE client
  addClient(userId, res) {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`);

    // Store client
    this.clients.set(userId, res);

    // Remove client on disconnect
    res.on('close', () => {
      this.clients.delete(userId);
      console.log(`SSE client ${userId} disconnected`);
    });

    // Keep connection alive
    const keepAlive = setInterval(() => {
      if (this.clients.has(userId)) {
        res.write(':ping\n\n');
      } else {
        clearInterval(keepAlive);
      }
    }, 30000); // Ping every 30 seconds

    console.log(`SSE client ${userId} connected`);
  }

  // Send event to specific user
  sendToUser(userId, eventType, data) {
    const client = this.clients.get(userId);
    if (client) {
      const message = JSON.stringify({
        type: eventType,
        data,
        timestamp: new Date()
      });
      client.write(`data: ${message}\n\n`);
      return true;
    }
    return false;
  }

  // Broadcast to all connected clients
  broadcast(eventType, data) {
    const message = JSON.stringify({
      type: eventType,
      data,
      timestamp: new Date()
    });

    let sentCount = 0;
    this.clients.forEach((client, userId) => {
      try {
        client.write(`data: ${message}\n\n`);
        sentCount++;
      } catch (error) {
        console.error(`Failed to send to client ${userId}:`, error);
        this.clients.delete(userId);
      }
    });

    return sentCount;
  }

  // Send to multiple specific users
  sendToUsers(userIds, eventType, data) {
    const message = JSON.stringify({
      type: eventType,
      data,
      timestamp: new Date()
    });

    let sentCount = 0;
    userIds.forEach(userId => {
      const client = this.clients.get(userId);
      if (client) {
        try {
          client.write(`data: ${message}\n\n`);
          sentCount++;
        } catch (error) {
          console.error(`Failed to send to client ${userId}:`, error);
          this.clients.delete(userId);
        }
      }
    });

    return sentCount;
  }

  // Get list of connected users
  getConnectedUsers() {
    return Array.from(this.clients.keys());
  }

  // Check if user is connected
  isUserConnected(userId) {
    return this.clients.has(userId);
  }

  // Disconnect a user
  disconnectUser(userId) {
    const client = this.clients.get(userId);
    if (client) {
      client.end();
      this.clients.delete(userId);
      return true;
    }
    return false;
  }
}

// Create singleton instance
const sseService = new SSEService();

export default sseService;