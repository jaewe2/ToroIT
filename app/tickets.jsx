
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  useColorScheme,
  ScrollView,
  Animated,
  Vibration,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';

const STORAGE_KEY = 'USER_TICKETS';

export default function TicketsScreen() {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', category: '', description: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([
    { label: '🧑‍💻 Login Issue', value: 'Login Issue' },
    { label: '💾 Software Request', value: 'Software Request' },
    { label: '🖥️ Hardware Problem', value: 'Hardware Problem' },
    { label: '📶 Network Issue', value: 'Network Issue' },
    { label: '❓ Other', value: 'Other' },
  ]);

  const [successMessage, setSuccessMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const theme = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
  const router = useRouter();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTickets(JSON.parse(stored));
    } catch (err) {
      console.error('Error loading tickets:', err);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!newTicket.title.trim()) newErrors.title = 'Title is required';
    if (!newTicket.category) newErrors.category = 'Category is required';
    if (!newTicket.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTicket = async () => {
    if (!validate()) return;

    const newId = Date.now().toString();
    const entry = {
      ...newTicket,
      id: newId,
      status: 'Open',
      submittedAt: new Date().toLocaleString(),
      comments: [],
      history: [
        { id: Date.now(), change: 'Ticket created', date: new Date().toLocaleString() },
      ],
    };

    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const current = stored ? JSON.parse(stored) : [];
    const updated = [...current, entry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setTickets(updated);
    setNewTicket({ title: '', category: '', description: '' });
    setShowModal(false);
    setOpen(false);
    setErrors({});

    Vibration.vibrate(100);
    setSuccessMessage('Ticket submitted successfully!');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setSuccessMessage(''));
      }, 2000);
    });
  };

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
      <Text style={[styles.meta, { color: theme.textSecondary }]}> {item.category} • Submitted: {item.submittedAt} </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.primary }]}>My Tickets</Text>

      {successMessage ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={{ textAlign: 'center', color: '#4CAF50', marginBottom: 10 }}>{successMessage}</Text>
        </Animated.View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.buttonText}>+ Submit New Ticket</Text>
      </TouchableOpacity>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderTicket}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>No tickets yet. Submit one!</Text>
        }
      />

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.fullscreenModal}>
          <View style={[styles.modal, { backgroundColor: theme.card }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={[styles.modalTitle, { color: theme.primary }]}>New Ticket</Text>

              <TextInput
                placeholder="Title"
                value={newTicket.title}
                onChangeText={(text) => setNewTicket((prev) => ({ ...prev, title: text }))}
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, {
                  color: theme.text,
                  borderColor: errors.title ? '#C62828' : theme.inputBorder,
                  backgroundColor: theme.card,
                }]}
              />
              {errors.title && <Text style={styles.error}>{errors.title}</Text>}

              <View style={{ zIndex: 999 }}>
                <DropDownPicker
                  open={open}
                  value={newTicket.category}
                  items={categoryItems}
                  setOpen={setOpen}
                  setValue={(callback) =>
                    setNewTicket((prev) => ({ ...prev, category: callback(prev.category) }))
                  }
                  setItems={setCategoryItems}
                  placeholder="Select a Category"
                  style={{ backgroundColor: theme.card, borderColor: errors.category ? '#C62828' : theme.inputBorder, marginTop: 12 }}
                  dropDownContainerStyle={{ backgroundColor: theme.card, borderColor: theme.inputBorder }}
                  placeholderStyle={{ color: theme.textSecondary }}
                  textStyle={{ color: theme.text }}
                />
              </View>
              {errors.category && <Text style={styles.error}>{errors.category}</Text>}

              <TextInput
                placeholder="Description"
                value={newTicket.description}
                onChangeText={(text) => setNewTicket((prev) => ({ ...prev, description: text }))}
                placeholderTextColor={theme.textSecondary}
                multiline
                style={[styles.input, {
                  color: theme.text,
                  borderColor: errors.description ? '#C62828' : theme.inputBorder,
                  backgroundColor: theme.card,
                  minHeight: 80,
                }]}
              />
              {errors.description && <Text style={styles.error}>{errors.description}</Text>}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleCreateTicket}
              >
                <Text style={styles.buttonText}>Submit Ticket</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowModal(false)} style={{ marginTop: 16 }}>
                <Text style={{ color: theme.secondary, textAlign: 'center', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
                </View>
      </Modal>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
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
  fullscreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    gap: 14,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    color: '#C62828',
    fontSize: 13,
    marginTop: 4,
  },
});
