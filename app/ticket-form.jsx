import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router'; // ✅ correct hook
import { Colors } from '@/constants/Colors';

const STORAGE_KEY = 'USER_TICKETS';

export default function TicketDetails() {
  const params = useLocalSearchParams(); // ✅ as object
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const theme = useColorScheme() === 'dark' ? Colors.dark : Colors.light;

  const loadTicket = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const tickets = stored ? JSON.parse(stored) : [];

      console.log('Looking for ticket ID:', id);
      const found = tickets.find((t) => t.id === id);
      if (found) {
        setTicket(found);
      } else {
        console.warn('Ticket not found for ID:', id);
      }
    } catch (err) {
      console.error('Error loading ticket:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const tickets = stored ? JSON.parse(stored) : [];

      const updatedTickets = tickets.map((t) => {
        if (t.id === ticket.id) {
          const updatedComments = [
            ...(t.comments || []),
            {
              id: Date.now(),
              text: newComment,
              author: 'You',
              time: 'Just now',
            },
          ];
          t.comments = updatedComments;
          setTicket({ ...t });
        }
        return t;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTickets));
      setNewComment('');
    } catch (err) {
      console.error('Error saving comment:', err);
    }
  };

  useEffect(() => {
    if (id) loadTicket();
    else console.warn('No ID in query params');
  }, [id]);

  if (!ticket) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Loading or ticket not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: theme.primary }]}>{ticket.title}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>Status: {ticket.status}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>Category: {ticket.category}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>Submitted: {ticket.submittedAt}</Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>Description</Text>
          <Text style={[styles.description, { color: theme.text, backgroundColor: theme.card }]}>
            {ticket.description}
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>Comments</Text>
          {(ticket.comments || []).map((c) => (
            <View key={c.id} style={[styles.commentCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.commentAuthor, { color: theme.text }]}>{c.author}</Text>
              <Text style={[styles.commentText, { color: theme.text }]}>{c.text}</Text>
              <Text style={[styles.commentTime, { color: theme.textSecondary }]}>{c.time}</Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    padding: 12,
    borderRadius: 8,
    lineHeight: 20,
  },
  commentCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentAuthor: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
  },
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
