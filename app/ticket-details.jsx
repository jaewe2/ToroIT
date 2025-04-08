import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, useColorScheme,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function TicketDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [formState, setFormState] = useState({ title: '', category: '', description: '' });
  const theme = useColorScheme() === 'dark' ? Colors.dark : Colors.light;

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`);
      const data = await res.json();
      setTicket(data);
      setFormState({
        title: data.title,
        category: data.category,
        description: data.description,
      });
    } catch (err) {
      console.error('Failed to load ticket:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/comment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setEditMode(false);
        fetchTicket();
      }
    } catch (err) {
      console.error('Failed to update ticket:', err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) return;
  
    try {
      console.log('Sending DELETE to:', `http://127.0.0.1:8000/api/tickets/${id}/`);
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': 'admin',
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Status:', res.status);
      const body = await res.text();
      console.log('Response:', body);
  
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
          {editMode ? (
            <>
              <TextInput
                value={formState.title}
                onChangeText={(text) => setFormState((prev) => ({ ...prev, title: text }))}
                style={[styles.input, { color: theme.text, borderColor: theme.inputBorder, backgroundColor: theme.card }]}
              />
              <TextInput
                value={formState.category}
                onChangeText={(text) => setFormState((prev) => ({ ...prev, category: text }))}
                style={[styles.input, { color: theme.text, borderColor: theme.inputBorder, backgroundColor: theme.card }]}
              />
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
              <Text style={[styles.meta, { color: theme.textSecondary }]}>Submitted: {ticket.submitted_at}</Text>

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
              <Text style={[styles.commentTime, { color: theme.textSecondary }]}>{c.created_at}</Text>
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
              {h.change} • {h.date}
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
});