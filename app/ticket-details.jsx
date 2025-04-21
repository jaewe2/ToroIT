import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, useColorScheme,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from './auth-context';
import DropDownPicker from 'react-native-dropdown-picker';

export default function TicketDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [formState, setFormState] = useState({ title: '', category: '', description: '' });
  const [aiSuggestion, setAiSuggestion] = useState(null); // 🧠 New AI suggestion state
  const theme = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
  const { token } = useAuth();

  const [open, setOpen] = useState(false);
  const categoryOptions = [
    { label: '🧑‍💻 Login Issue', value: 'Login Issue' },
    { label: '💻 Software Bug', value: 'Software Bug' },
    { label: '📶 Network Problem', value: 'Network Problem' },
    { label: '🔐 Access Request', value: 'Access Request' },
    { label: '🖨️ Printer Issue', value: 'Printer Issue' },
  ];

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setTicket(data);
      setFormState({
        title: data.title || '',
        category: data.category || '',
        description: data.description || '',
      });

      fetchAISuggestion(data); // ⬅️ AI suggestion fetch
    } catch (err) {
      console.error('Failed to load ticket:', err);
    }
  };

  const fetchAISuggestion = async (ticketData) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/ai-suggest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: ticketData.title,
          category: ticketData.category,
          description: ticketData.description,
        }),
      });
      const data = await res.json();
      if (data.suggestion) {
        setAiSuggestion(data.suggestion);
      }
    } catch (err) {
      console.error('Failed to fetch AI suggestion:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ text: newComment, author: 'You' }),
      });
      if (res.ok) {
        setNewComment('');
        fetchTicket();
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleSaveEdits = async () => {
    const { title, category, description } = formState;

    if (!title.trim() || !category.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ title, category, description }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Ticket updated!');
        setEditMode(false);
        fetchTicket();
      } else {
        const body = await res.text();
        console.error('Update failed:', body);
        Alert.alert('Update failed', body);
      }
    } catch (err) {
      console.error('Failed to update ticket:', err);
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const body = await res.text();
      if (res.status === 204) {
        alert('Ticket deleted successfully');
        router.replace('/tickets');
      } else {
        alert(`Failed to delete. Status: ${res.status}\n${body}`);
      }
    } catch (err) {
      console.error('Error deleting ticket:', err);
      alert('Error deleting ticket: ' + err.message);
    }
  };

  if (!ticket) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Loading or ticket not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {!editMode && aiSuggestion && (
            <View style={[styles.suggestionCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionHeader, { color: theme.primary }]}>💡 Suggested Resolution</Text>
              <Text style={[styles.suggestionText, { color: theme.text }]}>{aiSuggestion}</Text>
            </View>
          )}

          {editMode ? (
            <>
              <Text style={[styles.sectionHeader, { color: theme.text }]}>Title</Text>
              <TextInput
                value={formState.title}
                onChangeText={(text) => setFormState((prev) => ({ ...prev, title: text }))}
                style={[styles.input, { color: theme.text, borderColor: theme.inputBorder, backgroundColor: theme.card }]}
              />

              <Text style={[styles.sectionHeader, { color: theme.text }]}>Category</Text>
              <DropDownPicker
                open={open}
                value={formState.category}
                items={categoryOptions}
                setOpen={setOpen}
                setValue={(callback) =>
                  setFormState((prev) => ({
                    ...prev,
                    category: callback(prev.category),
                  }))
                }
                setItems={() => {}}
                style={{
                  borderColor: theme.inputBorder,
                  backgroundColor: theme.card,
                  marginBottom: 10,
                }}
                textStyle={{ color: theme.text }}
                placeholder="Select a category"
                dropDownContainerStyle={{
                  backgroundColor: theme.card,
                  borderColor: theme.inputBorder,
                }}
                zIndex={1000}
              />

              <Text style={[styles.sectionHeader, { color: theme.text }]}>Description</Text>
              <TextInput
                value={formState.description}
                multiline
                onChangeText={(text) => setFormState((prev) => ({ ...prev, description: text }))}
                style={[styles.input, { color: theme.text, borderColor: theme.inputBorder, backgroundColor: theme.card, minHeight: 100 }]}
              />

              <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSaveEdits}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: theme.primary }]}>{ticket.title}</Text>
              <Text style={[styles.meta, { color: theme.textSecondary }]}>Status: {ticket.status}</Text>
              <Text style={[styles.meta, { color: theme.textSecondary }]}>Category: {ticket.category}</Text>
              <Text style={[styles.meta, { color: theme.textSecondary }]}>
                Submitted: {new Date(ticket.submitted_at).toLocaleString()}
              </Text>

              <Text style={[styles.sectionHeader, { color: theme.text }]}>Description</Text>
              <Text style={[styles.description, { color: theme.text, backgroundColor: theme.card }]}>
                {ticket.description}
              </Text>

              <TouchableOpacity onPress={() => setEditMode(true)} style={[styles.button, { backgroundColor: theme.secondary }]}>
                <Text style={styles.buttonText}>Edit Ticket</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} style={[styles.button, { backgroundColor: '#C62828' }]}>
                <Text style={styles.buttonText}>Delete Ticket</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={[styles.sectionHeader, { color: theme.text }]}>Comments</Text>
          {(ticket.comments || []).map((c) => (
            <View key={c.id} style={[styles.commentCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.commentAuthor, { color: theme.text }]}>{c.author}</Text>
              <Text style={[styles.commentText, { color: theme.text }]}>{c.text}</Text>
              <Text style={[styles.commentTime, { color: theme.textSecondary }]}>{new Date(c.created_at).toLocaleString()}</Text>
            </View>
          ))}

          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                borderColor: theme.inputBorder,
                backgroundColor: theme.card,
                color: theme.text,
              },
            ]}
            multiline
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleAddComment}
          >
            <Text style={styles.buttonText}>Add Comment</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>History</Text>
          {(ticket.history || []).map((h) => (
            <Text key={h.id} style={[styles.meta, { color: theme.textSecondary }]}>
              {h.change} • {new Date(h.date).toLocaleString()}
            </Text>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  meta: { fontSize: 14, marginBottom: 4 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  description: { fontSize: 15, padding: 12, borderRadius: 8, lineHeight: 20 },
  commentCard: { padding: 12, borderRadius: 8, marginBottom: 12 },
  commentAuthor: { fontWeight: '600', marginBottom: 4 },
  commentText: { fontSize: 14, marginBottom: 4 },
  commentTime: { fontSize: 12 },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  button: {
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  suggestionText: {
    fontSize: 15,
    marginTop: 8,
    lineHeight: 20,
  },
});
