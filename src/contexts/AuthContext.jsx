import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Test user credentials for development
const TEST_USERS = [
  {
    id: 1,
    email: 'coach@hoops.dev',
    password: 'demo123',
    name: 'Coach Johnson',
    role: 'coach'
  },
  {
    id: 2,
    email: 'admin@hoops.dev', 
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setIsLoading(true);
    try {
      const savedUser = localStorage.getItem('hoops_user');
      const savedToken = localStorage.getItem('hoops_token');
      
      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('hoops_user');
      localStorage.removeItem('hoops_token');
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    console.log('Login attempt:', { email, password });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find test user
      const testUser = TEST_USERS.find(u => u.email === email && u.password === password);
      console.log('Found test user:', testUser);
      
      if (!testUser) {
        throw new Error('Invalid email or password');
      }

      // Create user session
      const userSession = {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        role: testUser.role
      };

      // Generate fake token
      const token = `dev_token_${Date.now()}_${testUser.id}`;

      // Save to localStorage
      localStorage.setItem('hoops_user', JSON.stringify(userSession));
      localStorage.setItem('hoops_token', token);

      console.log('Setting user session:', userSession);
      setUser(userSession);
      setIsAuthenticated(true);
      
      console.log('Login successful, returning:', { success: true, user: userSession });
      return { success: true, user: userSession };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUser = TEST_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Create new user (in real app, this would be saved to database)
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'coach'
      };

      // Generate fake token
      const token = `dev_token_${Date.now()}_${newUser.id}`;

      // Save to localStorage
      localStorage.setItem('hoops_user', JSON.stringify(newUser));
      localStorage.setItem('hoops_token', token);

      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('hoops_user');
    localStorage.removeItem('hoops_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    // Test credentials for easy reference
    testCredentials: {
      coach: { email: 'coach@hoops.dev', password: 'demo123' },
      admin: { email: 'admin@hoops.dev', password: 'admin123' }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};