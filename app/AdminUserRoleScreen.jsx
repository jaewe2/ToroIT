// app/admin-user-role.jsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { useAuth } from './auth-context';

const API_URL = 'http://127.0.0.1:8000/api';

export default function AdminUserRoleScreen() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleUpdates, setRoleUpdates] = useState({});

  // Fetch the list of users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load users.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial load (admins only)
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [fetchUsers, user]);

  // Filter users as the search query changes
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    setFilteredUsers(
      users.filter(
        u =>
          u.username.toLowerCase().includes(lower) ||
          u.email?.toLowerCase().includes(lower)
      )
    );
  }, [searchQuery, users]);

  // Track selection of a new role per user
  const handleRoleChange = (userId, newRole) => {
    setRoleUpdates(prev => ({ ...prev, [userId]: newRole }));
  };

  // Show confirmation before sending the PATCH
  const confirmUpdate = userId => {
    const newRole = roleUpdates[userId];
    const currentRole = users.find(u => u.id === userId)?.role;
    if (!newRole || newRole === currentRole) {
      return Toast.show({
        type: 'info',
        text1: 'No change',
        text2: 'Please select a different role first.',
      });
    }
    Alert.alert(
      'Confirm Role Change',
      `Change role for user #${userId} to "${newRole}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => updateUserRole(userId) },
      ]
    );
  };

  // Send PATCH to /api/users/<userId>/
  const updateUserRole = async userId => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: roleUpdates[userId] }),
      });

      if (res.ok) {
        await fetchUsers();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Role updated to "${roleUpdates[userId]}"`,
        });
        // clear selection so Picker resets
        setRoleUpdates(prev => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
      } else {
        const error = await res.json();
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.detail || 'Role update failed.',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unexpected error occurred.',
      });
    }
  };

  // Block non-admins
  if (user?.role !== 'admin') {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Access Denied: Admins Only</Text>
      </View>
    );
  }

  // Show loading spinner
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛠 Manage User Roles</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by username or email"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.noUsersText}>No users found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.role}>Current Role: {item.role}</Text>

            <Picker
              selectedValue={roleUpdates[item.id] || item.role}
              onValueChange={value => handleRoleChange(item.id, value)}
              style={styles.picker}
              dropdownIconColor="#333"
            >
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Support" value="support" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => confirmUpdate(item.id)}
            >
              <Text style={styles.updateButtonText}>Update Role</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Toast fallback */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginBottom: 12,
    color: '#111',
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    backgroundColor: '#F2F2F2',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  role: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  updateButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  noUsersText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});

