import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://127.0.0.1:8000/api/'; // Change for production

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ------------------------------
  // Load token & user on app start
  // ------------------------------
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
        }
      } catch (err) {
        console.error('Error loading session:', err);
      }
    };
    loadSession();
  }, []);

  // ------------------------------
  // Login
  // ------------------------------
  const login = async ({ identifier, password }) => {
    try {
      const response = await axios.post(`${API_URL}login/`, {
        identifier,
        password,
      });

      const { token, user_id, username, email, role } = response.data;
      const userInfo = { id: user_id, username, email, role };

      setToken(token);
      setUser(userInfo);
      setIsAuthenticated(true);

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));

      axios.defaults.headers.common['Authorization'] = `Token ${token}`;

      return userInfo;
    } catch (error) {
      console.error('Login error:', error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || 'Invalid credentials');
    }
  };

  // ------------------------------
  // Register
  // ------------------------------
  const register = async (values, suggestedUsername, { setSubmitting }) => {
    try {
      const response = await axios.post(`${API_URL}register/`, {
        username: suggestedUsername,
        email: values.email,
        password: values.password,
      });

      const { id, username, email, role, token } = response.data;
      const userInfo = { id, username, email, role };

      setToken(token);
      setUser(userInfo);
      setIsAuthenticated(true);

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));

      axios.defaults.headers.common['Authorization'] = `Token ${token}`;

      return userInfo;
    } catch (error) {
      console.error('Registration error:', error?.response?.data || error.message);
      const errorMsg =
        error?.response?.data?.email ||
        error?.response?.data?.username ||
        error?.response?.data?.password ||
        'Registration failed.';
      throw new Error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------
  // Logout (Styled with Toro Toast)
  // ------------------------------
  const logout = async () => {
    console.log('Logout started');
    try {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];

      console.log('Auth cleared');
      router.replace('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
