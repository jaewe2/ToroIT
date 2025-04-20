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
import { useAuth } from './auth-context';

const API_URL = 'http://127.0.0.1:8000/api';

export default function AdminUserRoleScreen() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleUpdates, setRoleUpdates] = useState({});

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleRoleChange = (userId, newRole) => {
    setRoleUpdates((prev) => ({ ...prev, [userId]: newRole }));
  };

  const confirmUpdate = (userId) => {
    const newRole = roleUpdates[userId];
    Alert.alert(
      'Confirm Role Change',
      `Change this user's role to "${newRole}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => updateUserRole(userId) },
      ]
    );
  };

  const updateUserRole = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/update-role/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          role: roleUpdates[userId],
        }),
      });

      if (res.ok) {
        fetchUsers();
        Alert.alert('Success', 'User role updated.');
      } else {
        const error = await res.json();
        console.error('Update failed:', error);
        Alert.alert('Error', error?.detail || 'Role update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [fetchUsers]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(lowerQuery) ||
        (u.email && u.email.toLowerCase().includes(lowerQuery))
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (user?.role !== 'admin') {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Access Denied: Admins Only</Text>
      </View>
    );
  }

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
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
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
              onValueChange={(value) => handleRoleChange(item.id, value)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  role: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 8,
  },
  picker: {
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    height: 40,
  },
  updateButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  noUsersText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 30,
  },
});
