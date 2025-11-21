import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Detect API URL based on environment
const getApiUrl = () => {
  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production (Docker), use relative URL to leverage nginx proxy
  if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
    // Use relative URL which will be proxied by nginx to backend
    return '/api';
  }
  
  // In development, detect the current host and use same host for API
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const port = window.location.port;
    
    // If accessing via network IP, use same IP for backend
    if (host !== 'localhost' && host !== '127.0.0.1') {
      // Backend port is typically frontend port - 2000 (3002 -> 5002, 3000 -> 5000)
      const backendPort = port ? parseInt(port) - 2000 : 5000;
      return `http://${host}:${backendPort}/api`;
    }
    
    // For localhost in development
    return 'http://localhost:5000/api';
  }
  
  // Default fallback
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data.user);
      setToken(token);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => user?.role === 'admin';
  const isTechnician = () => user?.role === 'technician';

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isTechnician
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

