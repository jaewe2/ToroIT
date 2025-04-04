import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const STORAGE_KEY = 'USER_TICKETS';

export default function TicketsScreen() {
  const [tickets, setTickets] = useState([]);
  const router = useRouter();
  const theme = useColorScheme() === 'dark' ? Colors.dark : Colors.light;

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTickets(JSON.parse(stored));
      } catch (err) {
        console.error('Error loading tickets:', err);
      }
    };
    loadTickets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return theme.secondary;
      case 'In Progress': return '#FF8C00';
      case 'Resolved': return '#4CAF50';
      default: return theme.textSecondary;
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/ticket-details?id=${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
      <Text style={[styles.meta, { color: theme.textSecondary }]}>
        {item.category} • Submitted: {item.submittedAt}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.primary }]}>My Tickets</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/ticket-form')}
      >
        <Text style={styles.buttonText}>+ Submit New Ticket</Text>
      </TouchableOpacity>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderTicket}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            No tickets yet. Submit one!
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 13,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
