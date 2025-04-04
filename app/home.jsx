import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';

export default function TicketsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const tickets = [
    { id: '1', title: 'Login Issue', status: 'Open' },
    { id: '2', title: 'Email Sync Error', status: 'Closed' },
    { id: '3', title: 'Canvas Access', status: 'Open' },
  ];

  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={[styles.ticketCard, { backgroundColor: theme.card }]}
      accessibilityLabel={`Ticket: ${item.title}, Status: ${item.status}`}
      onPress={() => {}}
    >
      <Text style={[styles.ticketTitle, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.ticketStatus, {
        color: item.status === 'Open' ? theme.primary : theme.secondary,
      }]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Support Tickets</Text>
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No tickets available.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ticketCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ticketStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
