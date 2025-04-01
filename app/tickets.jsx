// Updated tickets.jsx with navigation to ticket-form
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

const mockTickets = [
  {
    id: 'TCK-001',
    title: 'Cannot access Canvas',
    status: 'Open',
    category: 'Login',
    submittedAt: '2025-03-25',
  },
  {
    id: 'TCK-002',
    title: 'Wi-Fi disconnects randomly',
    status: 'In Progress',
    category: 'Network',
    submittedAt: '2025-03-24',
  },
  {
    id: 'TCK-003',
    title: 'Projector not working in Library Room 202',
    status: 'Resolved',
    category: 'Hardware',
    submittedAt: '2025-03-23',
  },
];

export default function TicketsScreen() {
  const [tickets, setTickets] = useState(mockTickets);
  const router = useRouter();

  const goToTicket = (ticketId) => {
    router.push(`/ticket-details?id=${ticketId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return '#DAA520';
      case 'In Progress':
        return '#FFA500';
      case 'Resolved':
        return '#32CD32';
      default:
        return '#ccc';
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketItem}
      onPress={() => goToTicket(item.id)}
      accessibilityLabel={`Open ticket ${item.title}`}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}> {item.status} </Text>
      </View>
      <Text style={styles.meta}>
        {item.category} | Submitted: {item.submittedAt}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Tickets</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/ticket-form')}
        accessibilityLabel="Create a new support ticket"
      >
        <Text style={styles.createButtonText}>+ Submit New Ticket</Text>
      </TouchableOpacity>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderTicket}
        ListEmptyComponent={<Text style={styles.empty}>No tickets to display.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#800000',
  },
  createButton: {
    backgroundColor: '#800000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  ticketItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
    color: '#555',
  },
  empty: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
