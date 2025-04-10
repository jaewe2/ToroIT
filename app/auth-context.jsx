import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
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
      Alert.alert('Success', `Logged in as ${username}`);
      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error?.response?.data || error.message);
      Alert.alert('Login Failed', error?.response?.data?.error || 'Invalid credentials');
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
      Alert.alert('Account Created', `Welcome! Your username is: ${username}`);
      router.replace('/home');
    } catch (error) {
      console.error('Registration error:', error?.response?.data || error.message);
      const errorMsg =
        error?.response?.data?.email ||
        error?.response?.data?.username ||
        error?.response?.data?.password ||
        'Registration failed.';
      Alert.alert('Registration Failed', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------
  // Logout
  // ------------------------------
  const logout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            router.replace('/index');
          } catch (err) {
            console.error('Logout error:', err);
          }
        },
      },
    ]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, register, logout }}>
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
