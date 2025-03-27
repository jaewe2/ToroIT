
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const mockArticles = [
  {
    id: 'KB001',
    title: 'How to reset your CSUDH password',
    content: 'Visit password.csudh.edu and follow the steps to reset your password...',
  },
  {
    id: 'KB002',
    title: 'Connecting to CSUDH Wi-Fi',
    content: 'Use your MyCSUDH credentials to log into the CSUDH wireless network...',
  },
  {
    id: 'KB003',
    title: 'Using Canvas on Mobile',
    content: 'Download the Canvas app and use your school login to sign in...',
  },
];

export default function KnowledgeBase() {
  const [query, setQuery] = useState('');

  const filtered = mockArticles.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Knowledge Base</Text>
      <TextInput
        style={styles.search}
        placeholder="Search FAQs or articles..."
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.noResults}>No matching articles found.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.article}>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleContent}>{item.content}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
  list: {
    paddingBottom: 20,
  },
  article: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  articleContent: {
    fontSize: 14,
    color: '#555',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#888',
  },
});
