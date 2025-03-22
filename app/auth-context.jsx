// app/auth-context.jsx
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (values, { setSubmitting }) => {
    try {
      // Placeholder for blockchain login
      console.log('Blockchain login to be implemented:', values);
      Alert.alert('Success', `Logged in with ${values.email}`);
      setUser({ email: values.email, username: 'user' }); // Mock username for now
      setIsAuthenticated(true);
      router.replace('/home'); // Navigate after state updates
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to log in: ' + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (values, username, { setSubmitting }) => {
    try {
      const registrationData = {
        email: values.email,
        username,
        password: values.password,
      };
      console.log('Registration data:', registrationData);
      Alert.alert('Success', 'Registration successful! Redirecting to Home.');
      setUser({ email: values.email, username });
      setIsAuthenticated(true);
      router.replace('/home'); // Navigate after state updates
      return true;
    } catch (error) {
      Alert.alert('Error', 'Registration failed: ' + error.message);
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