// app/account.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './auth-context';
import { Colors } from '@/constants/Colors';

export default function Account() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      {user ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{user.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.info}>{user.username}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutContainer}
            onPress={logout}
            accessibilityLabel="Log out"
          >
            <Text style={styles.logoutText}>Logout</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>Not logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.light.primary,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginTop: 5,
    color: '#333',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    backgroundColor: '#fef6f6',
    marginTop: 30,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.light.primary,
  },
});