import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Vite environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On mount, check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true, data: response.data };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true, data: response.data };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  // Check user role
  const hasRole = (role) => user?.role === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        hasRole,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
