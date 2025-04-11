import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from './auth-context';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://127.0.0.1:8000/api';

export default function AdminUserRoleScreen() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleUpdates, setRoleUpdates] = useState({});
  const [updating, setUpdating] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId) => {
    const selectedRole = roleUpdates[userId];
    if (!selectedRole) return;

    setUpdating((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await fetch(`${API_URL}/users/update-role/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, role: selectedRole }),
      });

      const result = await res.json();

      if (res.ok) {
        Toast.show({
          type: 'success',
          text1: 'Role Updated',
          text2: `User role changed to ${selectedRole}`,
          text1Style: { color: '#800000' },
        });
        fetchUsers();
      } else {
        throw result;
      }
    } catch (err) {
      console.error('Update error:', err);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err?.error || 'Unable to update role.',
      });
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, []);

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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage User Roles</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.role}>Current Role: {item.role}</Text>
            <Picker
              selectedValue={roleUpdates[item.id] || item.role}
              style={styles.picker}
              onValueChange={(value) =>
                setRoleUpdates((prev) => ({ ...prev, [item.id]: value }))
              }
            >
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Support" value="support" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
            {updating[item.id] ? (
              <ActivityIndicator size="small" />
            ) : (
              <Button title="Update Role" onPress={() => updateUserRole(item.id)} />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontSize: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  role: { marginBottom: 8 },
  picker: { height: 40, width: 180 },
});
