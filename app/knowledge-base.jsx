// KnowledgeBaseScreen.jsx

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { knowledgeBaseData } from '../constants/knowledgeBaseData';

export default function KnowledgeBaseScreen() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedArticles, setExpandedArticles] = useState({});
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const toggleArticle = (title) => {
    setExpandedArticles(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerText, { color: theme.text }]}>
          Knowledge Base
        </Text>

        {knowledgeBaseData.map((category, idx) => {
          const isOpen = activeCategory === idx;
          return (
            <View
              key={idx}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setActiveCategory(isOpen ? null : idx)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryTitle, { color: theme.primary }]}>
                  {category.category}
                </Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.articleList}>
                  {category.articles.map((article, i) => (
                    <View
                      key={i}
                      style={[
                        styles.articleCard,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <TouchableOpacity onPress={() => toggleArticle(article.title)} activeOpacity={0.7}>
                        <Text
                          style={[
                            styles.articleTitle,
                            {
                              color: colorScheme === 'dark'
                                ? theme.text
                                : '#333333',
                            },
                          ]}
                        >
                          {article.title}
                        </Text>
                        <Text
                          style={[
                            styles.articleSummary,
                            {
                              color: colorScheme === 'dark'
                                ? theme.placeholder
                                : '#555555',
                            },
                          ]}
                        >
                          {article.summary}
                        </Text>
                      </TouchableOpacity>

                      {expandedArticles[article.title] && (
                        <View style={styles.articleDetails}>
                          <Text
                            style={[
                              styles.articleText,
                              {
                                color: colorScheme === 'dark'
                                  ? theme.text
                                  : '#333333',
                              },
                            ]}
                          >
                            {article.details}
                          </Text>
                          {article.links?.map((link, j) => (
                            <TouchableOpacity
                              key={j}
                              onPress={() => Linking.openURL(link.url)}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.link,
                                  { color: theme.primary },
                                ]}
                              >
                                {link.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    padding: 16,
    flexGrow: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  articleList: {
    marginTop: 12,
  },
  articleCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
      },
      android: { elevation: 1 },
    }),
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  articleSummary: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
  },
  articleDetails: {
    marginTop: 8,
    paddingLeft: 8,
  },
  articleText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  link: {
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
});
