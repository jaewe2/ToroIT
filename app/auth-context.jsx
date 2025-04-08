import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

// Base URL for Django backend
const API_URL = 'http://127.0.0.1:8000/api/'; // Adjust for production or physical device (e.g., http://192.168.x.x:8000/api/)

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (values, { setSubmitting }) => {
    try {
      console.log('Attempting login with:', {
        identifier: values.identifier,
        password: values.password,
      });
      const response = await axios.post(`${API_URL}login/`, {
        identifier: values.identifier, // Matches Login.js field
        password: values.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Login response:', response.data);
      // Assuming the backend returns { message: "Login successful", user_id: <id> }
      setUser({ id: response.data.user_id, username: values.identifier });
      setIsAuthenticated(true);
      Alert.alert('Success', `Logged in as ${values.identifier}`);
      router.replace('/home');
      return true;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert('Error', `Failed to log in: ${error.response?.data?.error || error.message}`);
      throw error; // Let Login.js handle further error logic (e.g., attempt counter)
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (values, username, { setSubmitting }) => {
    try {
      console.log('Attempting registration with:', {
        username,
        email: values.email,
        password: values.password,
      });
      const response = await axios.post(`${API_URL}register/`, {
        username: username,
        email: values.email,
        password: values.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Registration response:', response.data);
      // Assuming the backend returns { id, username, email }
      setUser({ id: response.data.id, username: response.data.username, email: response.data.email });
      setIsAuthenticated(true);
      Alert.alert('Success', 'Registration successful! Redirecting to Home.');
      router.replace('/home');
      return true;
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert('Error', `Registration failed: ${error.response?.data?.email || error.response?.data?.non_field_errors || error.message}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setUser(null);
            setIsAuthenticated(false);
            router.replace('/index');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
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