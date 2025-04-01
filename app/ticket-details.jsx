// app/ticket-details.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const mockTicket = {
  id: 'TCK-001',
  title: 'Cannot access Canvas',
  description: 'I cannot log into Canvas even with the correct password.',
  status: 'Open',
  category: 'Login',
  submittedAt: '2025-03-25',
  comments: [
    { id: 1, text: 'We’re looking into it.', author: 'IT Agent', time: '2h ago' },
  ],
};

export default function TicketDetails() {
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const router = useRouter();

  useEffect(() => {
    setTicket(mockTicket);
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      Alert.alert('Please enter a comment.');
      return;
    }

    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'You',
      time: 'Just now',
    };

    setTicket((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));
    setNewComment('');
  };

  if (!ticket) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{ticket.title}</Text>
          <Text style={styles.meta}>Status: {ticket.status}</Text>
          <Text style={styles.meta}>Category: {ticket.category}</Text>
          <Text style={styles.meta}>Submitted: {ticket.submittedAt}</Text>

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>{ticket.description}</Text>

          <Text style={styles.sectionHeader}>Comments</Text>
          {ticket.comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Text style={styles.commentAuthor}>{c.author}</Text>
              <Text style={styles.commentText}>{c.text}</Text>
              <Text style={styles.commentTime}>{c.time}</Text>
            </View>
          ))}

          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleAddComment} accessibilityLabel="Add Comment Button">
            <Text style={styles.buttonText}>Add Comment</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  meta: { fontSize: 14, color: '#555', marginBottom: 4 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
    color: '#444',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
  },
  comment: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  commentAuthor: { fontWeight: '600', color: '#333' },
  commentText: { marginVertical: 4, color: '#444' },
  commentTime: { fontSize: 12, color: '#777' },
  input: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#800000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
