import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo
} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './auth-context';

const API_BASE = __DEV__
  ? 'http://127.0.0.1:8000/api'
  : 'https://your-production-api.com/api';

const TicketRow = memo(({ ticket, onPress }) => (
  <TouchableOpacity style={styles.ticketItem} onPress={() => onPress(ticket.id)}>
    <Text style={styles.ticketTitle}>{ticket.title}</Text>
    <Text style={styles.ticketMeta}>
      Status: {ticket.status} | Category: {ticket.category} | Date:{' '}
      {new Date(ticket.submitted_at).toLocaleDateString()}
    </Text>
  </TouchableOpacity>
));

export default function AdminTickets() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = [];
      if (statusFilter !== 'all') params.push(`status=${statusFilter}`);
      if (categoryFilter !== 'all') params.push(`category=${categoryFilter}`);
      if (searchQuery.trim() !== '') params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      const query = params.length ? `?${params.join('&')}` : '';

      const res = await fetch(`${API_BASE}/tickets/${query}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();

      const list = Array.isArray(json)
        ? json
        : Array.isArray(json.results)
        ? json.results
        : [];

      setTickets(list);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching tickets',
        text2: err.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchQuery, token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, [fetchTickets]);

  const categoryOptions = useMemo(
    () => ['all', ...new Set(tickets.map(t => t.category).filter(Boolean))],
    [tickets]
  );

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.accessDeniedText}>Access denied. Admins only.</Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search tickets..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 🧰 Filters */}
      <View style={styles.filterRow}>
        <Picker
          selectedValue={statusFilter}
          onValueChange={setStatusFilter}
          style={[styles.picker, styles.pickerLeft]}
        >
          <Picker.Item label="All Statuses" value="all" />
          <Picker.Item label="Open" value="open" />
          <Picker.Item label="In Progress" value="in_progress" />
          <Picker.Item label="Resolved" value="resolved" />
        </Picker>
        <Picker
          selectedValue={categoryFilter}
          onValueChange={setCategoryFilter}
          style={[styles.picker, styles.pickerRight]}
        >
          <Picker.Item label="All Categories" value="all" />
          {categoryOptions.map(cat => (
            <Picker.Item
              key={cat}
              label={cat[0].toUpperCase() + cat.slice(1)}
              value={cat}
            />
          ))}
        </Picker>
      </View>

      {/* 📋 Ticket List */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TicketRow ticket={item} onPress={id => router.push(`/ticket-detail/${id}`)} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tickets found.</Text>
          }
        />
      )}

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  filterRow: { flexDirection: 'row', marginBottom: 12 },
  picker: { flex: 1, height: 40 },
  pickerLeft: { marginRight: 8 },
  pickerRight: { marginLeft: 8 },
  ticketItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  ticketTitle: { fontSize: 16, fontWeight: '600' },
  ticketMeta: { marginTop: 4, fontSize: 14, color: '#555' },
  accessDeniedText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'crimson',
  },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#777' },
});
