// knowledge-base.jsx (Refined for search UX and list clarity)
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';

export default function KnowledgeBaseScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [search, setSearch] = useState('');

  const articles = [
    { id: '1', title: 'Resetting Your Password', summary: 'Steps to reset your MYCSUDH password.' },
    { id: '2', title: 'Connecting to Campus Wi-Fi', summary: 'Guide to connect devices to ToroNet.' },
    { id: '3', title: 'Canvas Troubleshooting', summary: 'Fix common Canvas issues.' },
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={[styles.articleCard, { backgroundColor: theme.card }]}
      accessibilityLabel={`Help Article: ${item.title}`}
      onPress={() => {/* Navigate to article detail */}}
    >
      <Text style={[styles.articleTitle, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.articleSummary, { color: theme.textSecondary }]}>{item.summary}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Knowledge Base</Text>
      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.input, color: theme.text }]}
        placeholder="Search articles..."
        placeholderTextColor={theme.textSecondary}
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search articles input"
      />
      <FlatList
        data={filteredArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.textSecondary }]}>No articles found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchInput: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  articleCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  articleSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
