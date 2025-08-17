import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Message Context
const MessageContext = createContext();

// Action types
const MESSAGE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  REMOVE_MESSAGE: 'REMOVE_MESSAGE',
  MARK_AS_READ: 'MARK_AS_READ',
  SET_ALERTS: 'SET_ALERTS',
  ADD_ALERT: 'ADD_ALERT',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
  SET_SELECTED_PLAYER: 'SET_SELECTED_PLAYER',
  SET_ONLINE_USERS: 'SET_ONLINE_USERS',
};

// Initial state
const initialState = {
  messages: {
    broadcasts: [],
    direct: {},  // playerId -> messages array
    alerts: []
  },
  unreadCounts: {},  // playerId -> count
  selectedPlayer: null,
  onlineUsers: new Set(),
  loading: false,
  error: null,
  sseConnected: false
};

// Reducer
function messageReducer(state, action) {
  switch (action.type) {
    case MESSAGE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case MESSAGE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case MESSAGE_ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: { ...state.messages, ...action.payload },
        loading: false,
        error: null
      };

    case MESSAGE_ACTIONS.ADD_MESSAGE:
      const { type, message } = action.payload;
      
      if (type === 'broadcast') {
        return {
          ...state,
          messages: {
            ...state.messages,
            broadcasts: [message, ...state.messages.broadcasts]
          }
        };
      } else if (type === 'direct') {
        const playerId = message.senderId === 'coach' ? message.recipientId : message.senderId;
        return {
          ...state,
          messages: {
            ...state.messages,
            direct: {
              ...state.messages.direct,
              [playerId]: [...(state.messages.direct[playerId] || []), message]
            }
          }
        };
      } else if (type === 'alert') {
        return {
          ...state,
          messages: {
            ...state.messages,
            alerts: [message, ...state.messages.alerts]
          }
        };
      }
      return state;

    case MESSAGE_ACTIONS.UPDATE_MESSAGE:
      // Update a message (for optimistic updates)
      const { messageId, updates } = action.payload;
      
      // Update in broadcasts
      const updatedBroadcasts = state.messages.broadcasts.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );
      
      // Update in direct messages
      const updatedDirect = {};
      Object.keys(state.messages.direct).forEach(playerId => {
        updatedDirect[playerId] = state.messages.direct[playerId].map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
      });
      
      return {
        ...state,
        messages: {
          ...state.messages,
          broadcasts: updatedBroadcasts,
          direct: updatedDirect
        }
      };

    case MESSAGE_ACTIONS.REMOVE_MESSAGE:
      // Remove a message (for failed optimistic updates)
      const { messageId: removeId } = action.payload;
      
      const filteredBroadcasts = state.messages.broadcasts.filter(msg => msg.id !== removeId);
      const filteredDirect = {};
      Object.keys(state.messages.direct).forEach(playerId => {
        filteredDirect[playerId] = state.messages.direct[playerId].filter(msg => msg.id !== removeId);
      });
      
      return {
        ...state,
        messages: {
          ...state.messages,
          broadcasts: filteredBroadcasts,
          direct: filteredDirect
        }
      };

    case MESSAGE_ACTIONS.MARK_AS_READ:
      const { messageId: readId } = action.payload;
      
      // Update read status for all message types
      const readBroadcasts = state.messages.broadcasts.map(msg =>
        msg.id === readId ? { ...msg, status: 'read' } : msg
      );
      
      const readDirect = {};
      Object.keys(state.messages.direct).forEach(playerId => {
        readDirect[playerId] = state.messages.direct[playerId].map(msg =>
          msg.id === readId ? { ...msg, status: 'read' } : msg
        );
      });
      
      return {
        ...state,
        messages: {
          ...state.messages,
          broadcasts: readBroadcasts,
          direct: readDirect
        }
      };

    case MESSAGE_ACTIONS.SET_ALERTS:
      return {
        ...state,
        messages: {
          ...state.messages,
          alerts: action.payload
        }
      };

    case MESSAGE_ACTIONS.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          ...action.payload
        }
      };

    case MESSAGE_ACTIONS.SET_SELECTED_PLAYER:
      return {
        ...state,
        selectedPlayer: action.payload
      };

    case MESSAGE_ACTIONS.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: new Set(action.payload)
      };

    default:
      return state;
  }
}

// Message Provider Component
export function MessageProvider({ children }) {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();

  // API Base URL
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api';

  // Helper function for API calls
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }, [API_BASE]);

  // Send broadcast message
  const sendBroadcast = useCallback(async (content, priority = 'normal', metadata = {}) => {
    // Optimistic update
    const tempMessage = {
      id: `temp_${Date.now()}`,
      type: 'broadcast',
      content,
      priority,
      metadata,
      senderId: user?.id || 'coach',
      status: 'sending',
      createdAt: new Date().toISOString()
    };

    dispatch({
      type: MESSAGE_ACTIONS.ADD_MESSAGE,
      payload: { type: 'broadcast', message: tempMessage }
    });

    try {
      const realMessage = await apiCall('/messages/broadcast', {
        method: 'POST',
        body: JSON.stringify({ content, priority, metadata })
      });

      // Replace temp message with real one
      dispatch({
        type: MESSAGE_ACTIONS.UPDATE_MESSAGE,
        payload: { messageId: tempMessage.id, updates: { ...realMessage, id: realMessage.id } }
      });

      toast({
        title: "Broadcast sent",
        description: "Your message has been sent to all players.",
      });

      return realMessage;
    } catch (error) {
      // Remove temp message on error
      dispatch({
        type: MESSAGE_ACTIONS.REMOVE_MESSAGE,
        payload: { messageId: tempMessage.id }
      });

      dispatch({
        type: MESSAGE_ACTIONS.SET_ERROR,
        payload: error.message
      });

      toast({
        title: "Failed to send broadcast",
        description: error.message,
        variant: "destructive",
      });

      throw error;
    }
  }, [user, apiCall, toast]);

  // Send direct message
  const sendDirectMessage = useCallback(async (recipientId, content, metadata = {}) => {
    // Optimistic update
    const tempMessage = {
      id: `temp_${Date.now()}`,
      type: 'direct',
      content,
      metadata,
      senderId: user?.id || 'coach',
      recipientId,
      status: 'sending',
      createdAt: new Date().toISOString()
    };

    dispatch({
      type: MESSAGE_ACTIONS.ADD_MESSAGE,
      payload: { type: 'direct', message: tempMessage }
    });

    try {
      const realMessage = await apiCall('/messages/direct', {
        method: 'POST',
        body: JSON.stringify({ recipientId, content, metadata })
      });

      // Replace temp message with real one
      dispatch({
        type: MESSAGE_ACTIONS.UPDATE_MESSAGE,
        payload: { messageId: tempMessage.id, updates: { ...realMessage, id: realMessage.id } }
      });

      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      });

      return realMessage;
    } catch (error) {
      // Remove temp message on error
      dispatch({
        type: MESSAGE_ACTIONS.REMOVE_MESSAGE,
        payload: { messageId: tempMessage.id }
      });

      dispatch({
        type: MESSAGE_ACTIONS.SET_ERROR,
        payload: error.message
      });

      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });

      throw error;
    }
  }, [user, apiCall, toast]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId) => {
    // Optimistic update
    dispatch({
      type: MESSAGE_ACTIONS.MARK_AS_READ,
      payload: { messageId }
    });

    try {
      await apiCall(`/messages/${messageId}/read`, {
        method: 'PATCH'
      });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      // Note: We don't revert the optimistic update for read status
      // as it's not critical and the user experience is better this way
    }
  }, [apiCall]);

  // Load messages
  const loadMessages = useCallback(async (type = 'all', playerId = null, limit = 50) => {
    dispatch({ type: MESSAGE_ACTIONS.SET_LOADING, payload: true });

    try {
      const params = new URLSearchParams({ type, limit });
      if (playerId) params.append('playerId', playerId);

      const messages = await apiCall(`/messages?${params}`);
      
      dispatch({
        type: MESSAGE_ACTIONS.SET_MESSAGES,
        payload: messages
      });

      return messages;
    } catch (error) {
      console.warn('Failed to load messages - using fallback data:', error);
      
      // Provide fallback mock data when backend is not available
      const fallbackMessages = {
        broadcasts: [
          {
            id: 'mock_1',
            type: 'broadcast',
            content: 'Great practice today team! Keep up the hard work.',
            priority: 'normal',
            senderId: 'coach',
            status: 'sent',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'mock_2',
            type: 'broadcast',
            content: 'Game tomorrow at 7 PM. Be there 30 minutes early!',
            priority: 'high',
            senderId: 'coach',
            status: 'sent',
            createdAt: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        direct: {},
        alerts: [
          {
            id: 'alert_1',
            type: 'performance',
            message: 'John Smith has improved shooting percentage by 15% this week',
            severity: 'info',
            playerId: '1',
            createdAt: new Date(Date.now() - 1800000).toISOString()
          }
        ]
      };
      
      dispatch({
        type: MESSAGE_ACTIONS.SET_MESSAGES,
        payload: fallbackMessages
      });
      
      return fallbackMessages;
    }
  }, [apiCall]);

  // Load performance alerts
  const loadAlerts = useCallback(async () => {
    try {
      const alerts = await apiCall('/messages/alerts');
      dispatch({
        type: MESSAGE_ACTIONS.SET_ALERTS,
        payload: alerts
      });
      return alerts;
    } catch (error) {
      console.warn('Failed to load alerts - using fallback data:', error);
      
      // Provide fallback alert data
      const fallbackAlerts = [
        {
          id: 'alert_1',
          type: 'performance',
          message: 'Sarah Johnson achieved 90% free throw accuracy this week',
          severity: 'success',
          playerId: '2',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'alert_2',
          type: 'performance',
          message: 'Mike Williams needs improvement in defensive rebounds',
          severity: 'warning',
          playerId: '3',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      
      dispatch({
        type: MESSAGE_ACTIONS.SET_ALERTS,
        payload: fallbackAlerts
      });
      
      return fallbackAlerts;
    }
  }, [apiCall]);

  // Set up Server-Sent Events for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    let eventSource;
    
    try {
      eventSource = new EventSource(`${API_BASE}/messages/stream?userId=${user.id}`);
    } catch (error) {
      console.warn('SSE not available:', error);
      return;
    }

    eventSource.onopen = () => {
      console.log('SSE connected');
      dispatch({ type: MESSAGE_ACTIONS.SET_ERROR, payload: null });
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'new_message':
            dispatch({
              type: MESSAGE_ACTIONS.ADD_MESSAGE,
              payload: { type: data.messageType, message: data.message }
            });
            break;
            
          case 'message_read':
            dispatch({
              type: MESSAGE_ACTIONS.MARK_AS_READ,
              payload: { messageId: data.messageId }
            });
            break;
            
          case 'new_alert':
            dispatch({
              type: MESSAGE_ACTIONS.ADD_ALERT,
              payload: data.alert
            });
            break;
            
          case 'online_users':
            dispatch({
              type: MESSAGE_ACTIONS.SET_ONLINE_USERS,
              payload: data.users
            });
            break;
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = () => {
      console.warn('SSE connection error - backend may not be running');
      // Don't show error to user if backend is simply not running
    };

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [user?.id, API_BASE]);

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    sendBroadcast,
    sendDirectMessage,
    markAsRead,
    loadMessages,
    loadAlerts,
    
    // UI helpers
    selectPlayer: (playerId) => dispatch({
      type: MESSAGE_ACTIONS.SET_SELECTED_PLAYER,
      payload: playerId
    }),
    
    clearError: () => dispatch({
      type: MESSAGE_ACTIONS.SET_ERROR,
      payload: null
    })
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

// Hook to use message context
export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}

export default MessageContext;