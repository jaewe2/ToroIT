// app/(tabs)/chatbot.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig.extra.openAIApiKey;

// Simple delay function to wait between requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  useEffect(() => {
    // Check if the API key is loaded
    if (!API_KEY) {
      console.error('OpenAI API Key is missing. Please set EXPO_PUBLIC_OPENAI_API_KEY in your .env file.');
      Alert.alert('Error', 'Chatbot API key is missing. Please contact support.');
    } else {
      console.log('OpenAI API Key loaded successfully:', API_KEY);
    }

    // Initialize the chat with a welcome message
    setMessages([
      {
        _id: '1',
        text: 'Hello! I am your Toro Support Chatbot. How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: 'https://i.imgur.com/7k12EPD.png',
        },
      },
    ]);
  }, []);

  const getOpenAIResponse = async (userMessage, retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds base delay for retries

    try {
      setIsTyping(true);

      // Enforce a minimum delay between requests to avoid rate limits
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      const minDelayBetweenRequests = 2000; // 2 seconds (adjust based on your rate limit)
      if (timeSinceLastRequest < minDelayBetweenRequests) {
        await delay(minDelayBetweenRequests - timeSinceLastRequest);
      }

      setLastRequestTime(Date.now());

      const messageHistory = messages
        .slice()
        .reverse()
        .map((msg) => ({
          role: msg.user._id === 1 ? 'user' : 'assistant',
          content: msg.text,
        }));

      messageHistory.push({ role: 'user', content: userMessage });

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...messageHistory,
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const botResponse = response.data.choices[0].message.content.trim();
      return botResponse;
    } catch (error) {
      console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);

      // Handle 429 (Too Many Requests) with retry logic
      if (error.response && error.response.status === 429 && retryCount < maxRetries) {
        const retryDelay = baseDelay * Math.pow(2, retryCount); // Exponential backoff: 2s, 4s, 8s
        console.log(`Rate limit hit. Retrying in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
        await delay(retryDelay);
        return getOpenAIResponse(userMessage, retryCount + 1); // Retry the request
      }

      // If max retries are exceeded or it's a different error, show an error message
      Alert.alert('Error', 'Failed to get a response from the chatbot. Please try again later.');
      return 'Sorry, I encountered an error. Please try again.';
    } finally {
      setIsTyping(false);
    }
  };

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

    const userMessage = newMessages[0].text;
    const botResponseText = await getOpenAIResponse(userMessage);

    const botResponse = {
      _id: Math.random().toString(36).substring(7),
      text: botResponseText,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Chatbot',
        avatar: 'https://i.imgur.com/7k12EPD.png',
      },
    };
    setMessages((previousMessages) => GiftedChat.append(previousMessages, [botResponse]));
  }, [messages]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        isTyping={isTyping}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});