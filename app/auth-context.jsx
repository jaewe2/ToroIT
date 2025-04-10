import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';
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
  const login = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${API_URL}login/`, {
        identifier: values.identifier,
        password: values.password,
      });

      const { token, user_id, username, email, role } = response.data;
      const userInfo = { id: user_id, username, email, role };

      setToken(token);
      setUser(userInfo);
      setIsAuthenticated(true);

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));

      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome, ${username}!`,
        text1Style: { fontSize: 16, fontWeight: 'bold', color: '#800000' },
        text2Style: { fontSize: 14, color: '#333' },
      });

      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error?.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.error || 'Invalid credentials',
        text1Style: { fontSize: 16, fontWeight: 'bold', color: '#C62828' },
        text2Style: { fontSize: 14, color: '#444' },
      });
    } finally {
      setSubmitting(false);
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
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: `Welcome, ${username}!`,
        text1Style: { fontSize: 16, fontWeight: 'bold', color: '#800000' },
        text2Style: { fontSize: 14, color: '#333' },
      });

      router.replace('/home');
    } catch (error) {
      console.error('Registration error:', error?.response?.data || error.message);
      const errorMsg =
        error?.response?.data?.email ||
        error?.response?.data?.username ||
        error?.response?.data?.password ||
        'Registration failed.';
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMsg,
        text1Style: { fontSize: 16, fontWeight: 'bold', color: '#C62828' },
        text2Style: { fontSize: 14, color: '#444' },
      });
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

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you again soon!',
        position: 'top',
        visibilityTime: 2500,
        text1Style: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#800000', // Maroon
        },
        text2Style: {
          fontSize: 14,
          color: '#555',
        },
      });

      router.replace('/');
      console.log('Navigated to /');
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
