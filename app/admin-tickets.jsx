// app/admin-tickets.jsx

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
  TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './auth-context';

const API_BASE = __DEV__
  ? 'http://127.0.0.1:8000/api'
  : 'https://your-production-api.com/api';

const statusColors = {
  open:        '#7C0034',
  closed:      '#FFB300',
  in_progress: '#007AFF'
};

const TicketRow = memo(({
  ticket,
  onPress,
  suggestion,
  onFetchSuggestion,
  onStatusChange
}) => {
  const [expanded, setExpanded] = useState(false);

  // build the style array
  const cardStyle = [
    styles.ticketItem,
    expanded
      ? styles.ticketItemExpanded
      : styles.ticketItemCollapsed
  ];

  return (
    <View style={cardStyle}>
      <TouchableOpacity onPress={() => setExpanded(prev => !prev)}>
        <Text style={styles.ticketTitle}>{ticket.title}</Text>
        <Text
          style={[
            styles.statusLine,
            { color: statusColors[ticket.status] || statusColors.open }
          ]}
        >
          Status: {ticket.status.replace('_', ' ')}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <Text style={styles.ticketDescription}>
            {ticket.description}
          </Text>

          <Text style={styles.ticketMeta}>Update Status:</Text>
          <Picker
            selectedValue={ticket.status}
            onValueChange={(newStatus) =>
              onStatusChange(ticket.id, newStatus)
            }
            style={styles.inlinePicker}
          >
            <Picker.Item label="Open" value="open" />
            <Picker.Item label="In Progress" value="in_progress" />
            <Picker.Item label="Resolved" value="resolved" />
            <Picker.Item label="Closed" value="closed" />
          </Picker>

          {suggestion ? (
            <Text style={styles.aiSuggestion}>
              💡 {suggestion}
            </Text>
          ) : (
            <TouchableOpacity onPress={() => onFetchSuggestion(ticket)}>
              <Text style={styles.suggestionButton}>
                Get AI Suggestion
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => onPress(ticket.id)}>
            <Text style={styles.viewButton}>View Ticket</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
});

export default function AdminTickets() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({});

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = [];
      if (statusFilter !== 'all') params.push(`status=${statusFilter}`);
      if (categoryFilter !== 'all') params.push(`category=${categoryFilter}`);
      if (searchQuery.trim()) params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      const query = params.length ? `?${params.join('&')}` : '';

      const res = await fetch(`${API_BASE}/tickets/${query}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.results || [];
      setTickets(list);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error fetching tickets', text2: err.message });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchQuery, token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, [fetchTickets]);

  const fetchAISuggestion = async (ticket) => {
    try {
      const res = await fetch(`${API_BASE}/ai-suggest/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: ticket.title,
          category: ticket.category,
          description: ticket.description
        })
      });
      const data = await res.json();
      setAiSuggestions(prev => ({
        ...prev,
        [ticket.id]: data.suggestion || 'No suggestion available.'
      }));
    } catch {
      setAiSuggestions(prev => ({
        ...prev,
        [ticket.id]: 'Failed to fetch suggestion.'
      }));
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const updatedData = {
        title: ticket.title,
        category: ticket.category,
        description: ticket.description,
        status: newStatus
      };

      const res = await fetch(`${API_BASE}/tickets/${ticketId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to update. ${res.status}: ${errText}`);
      }

      setTickets(prev =>
        prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t)
      );
      Toast.show({ type: 'success', text1: 'Status updated' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to update status', text2: err.message });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const categoryOptions = useMemo(
    () => ['all', ...new Set(tickets.map(t => t.category).filter(Boolean))],
    [tickets]
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (user.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.accessDeniedText}>
          Access denied. Admins only.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/admin-dashboard')}
      >
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search tickets..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

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
          <Picker.Item label="Closed" value="closed" />
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

      <TouchableOpacity onPress={clearFilters} style={{ marginBottom: 10 }}>
        <Text style={{ color: 'blue', textAlign: 'right' }}>
          Clear Filters
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TicketRow
              ticket={item}
              onPress={id => router.push(`/ticket-details?id=${id}`)}
              suggestion={aiSuggestions[item.id]}
              onFetchSuggestion={fetchAISuggestion}
              onStatusChange={updateTicketStatus}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  backButton: {
    marginBottom: 12
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF'
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9'
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  picker: {
    flex: 1,
    height: 40
  },
  pickerLeft: {
    marginRight: 8
  },
  pickerRight: {
    marginLeft: 8
  },
  ticketItem: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 6
  },
  ticketItemCollapsed: {
    backgroundColor: '#F2F2F2',
    borderWidth: 0
  },
  ticketItemExpanded: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF'
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111'
  },
  statusLine: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500'
  },
  ticketDescription: {
    marginTop: 12,
    fontSize: 14,
    color: '#333'
  },
  ticketMeta: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500'
  },
  inlinePicker: {
    height: 40,
    width: '100%'
  },
  aiSuggestion: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#4B8DF8'
  },
  suggestionButton: {
    marginTop: 8,
    color: '#007AFF',
    fontWeight: '500'
  },
  viewButton: {
    marginTop: 8,
    color: 'green',
    fontWeight: '600'
  },
  accessDeniedText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'crimson'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777'
  }
});
