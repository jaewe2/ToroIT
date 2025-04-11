import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './auth-context';  // adjust import path as needed

export default function AdminTickets() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Fetch tickets on component mount (only if user is admin)
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchTickets();
    }
  }, [user]);

  // Fetch all tickets from API with authorization
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tickets/', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching tickets',
        text2: error.message || 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to tickets whenever tickets or filter values change
  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || ticket.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  // Handler for tapping on a ticket item
  const handleTicketPress = (ticketId) => {
    router.push(`/ticket-detail/${ticketId}`);
  };

  // If the user is not an admin, show an access denied message
  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.accessDeniedText}>Access denied. Admins only.</Text>
      </SafeAreaView>
    );
  }

  // Unique category options for the Category picker (including an "All" option)
  const categoryOptions = ['all', ...new Set(tickets.map(t => t.category).filter(Boolean))];

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter dropdowns */}
      <View style={styles.filterRow}>
        <Picker
          selectedValue={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
          style={[styles.picker, styles.pickerLeft]}
        >
          <Picker.Item label="All Statuses" value="all" />
          <Picker.Item label="Open" value="open" />
          <Picker.Item label="In Progress" value="in_progress" />
          <Picker.Item label="Resolved" value="resolved" />
        </Picker>

        <Picker
          selectedValue={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
          style={[styles.picker, styles.pickerRight]}
        >
          <Picker.Item label="All Categories" value="all" />
          {categoryOptions.map((cat) => (
            <Picker.Item 
              key={cat} 
              label={cat.charAt(0).toUpperCase() + cat.slice(1)} 
              value={cat} 
            />
          ))}
        </Picker>
      </View>

      {/* Ticket list or loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.ticketItem} onPress={() => handleTicketPress(item.id)}>
              <Text style={styles.ticketTitle}>{item.title}</Text>
              <Text style={styles.ticketMeta}>
                Status: {item.status} | Category: {item.category} | Date: { new Date(item.created_at).toLocaleDateString() }
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Toast component for global messages */}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  pickerLeft: {
    marginRight: 8,
  },
  pickerRight: {
    marginLeft: 8,
  },
  ticketItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  ticketMeta: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  accessDeniedText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'crimson',
  },
});
