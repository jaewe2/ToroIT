import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../auth-context';
import Toast from 'react-native-toast-message';

const API_URL = 'http://127.0.0.1:8000/api';

export default function TicketDetail() {
  const { id } = useLocalSearchParams();
  const { user, token } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchTicket = async () => {
    try {
      const res = await fetch(`${API_URL}/tickets/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setTicket(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/tickets/${id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...ticket, status: selectedStatus }),
      });

      if (res.ok) {
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `New status: ${selectedStatus}`,
          text1Style: { color: '#800000' },
        });
        fetchTicket(); // Refresh data
      } else {
        const err = await res.json();
        throw err;
      }
    } catch (err) {
      console.error('Update error:', err);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err?.error || 'Could not update status.',
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (id) fetchTicket();
  }, [id]);

  if (loading || !ticket) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ticket.title}</Text>
      <Text style={styles.meta}>Category: {ticket.category}</Text>
      <Text style={styles.meta}>Status: {ticket.status}</Text>
      <Text style={styles.meta}>Description: {ticket.description}</Text>

      {user?.role === 'admin' && (
        <View style={styles.adminSection}>
          <Text style={styles.subheader}>Update Ticket Status:</Text>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val)}
            style={styles.picker}
          >
            <Picker.Item label="Open" value="open" />
            <Picker.Item label="In Progress" value="in_progress" />
            <Picker.Item label="Resolved" value="resolved" />
          </Picker>

          <Button
            title={updating ? 'Updating...' : 'Update Status'}
            onPress={updateStatus}
            disabled={updating}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  meta: { fontSize: 14, marginBottom: 6 },
  adminSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  subheader: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  picker: { height: 50, width: '100%', marginBottom: 10 },
});
