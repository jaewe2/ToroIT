import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';

import { knowledgeBaseData } from '../constants/knowledgeBaseData'; 

export default function KnowledgeBaseScreen() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedArticles, setExpandedArticles] = useState({});

  const toggleArticle = (articleTitle) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleTitle]: !prev[articleTitle],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Knowledge Base</Text>
      {knowledgeBaseData.map((category, index) => (
        <View key={index} style={styles.categoryBlock}>
          <TouchableOpacity onPress={() => setActiveCategory(activeCategory === index ? null : index)}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
          </TouchableOpacity>

          {activeCategory === index && (
            <View style={styles.articleList}>
              {category.articles.map((article, i) => (
                <View key={i} style={styles.articleBlock}>
                  <TouchableOpacity onPress={() => toggleArticle(article.title)}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleSummary}>{article.summary}</Text>
                  </TouchableOpacity>
                  {expandedArticles[article.title] && (
                    <View style={styles.articleDetails}>
                      <Text style={styles.articleText}>{article.details}</Text>
                      {article.links?.map((link, idx) => (
                        <TouchableOpacity key={idx} onPress={() => Linking.openURL(link.url)}>
                          <Text style={styles.link}>{link.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', // CSUDH gold
    marginBottom: 16,
    textAlign: 'center'
  },
  categoryBlock: {
    marginBottom: 20,
    backgroundColor: '#4C0000', // CSUDH maroon
    borderRadius: 12,
    padding: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  articleList: {
    paddingLeft: 10,
  },
  articleBlock: {
    backgroundColor: '#111',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
  },
  articleTitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  articleSummary: {
    color: '#ccc',
    fontStyle: 'italic',
  },
  articleDetails: {
    marginTop: 8,
  },
  articleText: {
    color: '#eee',
    marginBottom: 6,
  },
  link: {
    color: '#87cefa',
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
});