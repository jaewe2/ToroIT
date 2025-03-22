// app/chatbot.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig.extra.openAIApiKey;

// Simple delay function to wait between requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// List of restricted keywords (e.g., off-topic words and profanity)
const restrictedKeywords = [
  // Off-topic words
  'politics',
  'religion',
  'movie',
  'game',
  'joke',
  // Profanity
  'damn',
  'hell',
  'idiot',
  'stupid',
  'fool',
  // Add more profanity as needed
];

// List of IT-related keywords for allowed topics (networking, hardware, ticketing)
const allowedITKeywords = [
  // Networking
  'network',
  'wifi',
  'ethernet',
  'vpn',
  'internet',
  'connectivity',
  'router',
  'firewall',
  // Hardware (projector, USB, monitor, etc.)
  'projector',
  'usb',
  'monitor',
  'screen',
  'keyboard',
  'mouse',
  'printer',
  'laptop',
  'computer',
  'hardware',
  'device',
  // Ticketing
  'ticket',
  'ticketing',
  'support ticket',
  'issue',
  'submit ticket',
  'track ticket',
  'resolve ticket',
];

// Fallback response for restricted, off-topic, or non-IT messages
const FALLBACK_RESPONSE =
  'I’m here to help with IT support related to networking (e.g., Wi-Fi, VPN), hardware problems (e.g., projectors, USBs, monitors), and ticketing (e.g., submitting or tracking tickets). Please ask a question about one of these topics.';

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
        text: 'Hello! I am your Toro IT Support Chatbot. I can assist with IT-related questions about networking (e.g., Wi-Fi, VPN), hardware problems (e.g., projectors, USBs, monitors), and ticketing (e.g., submitting or tracking tickets). How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: 'https://i.imgur.com/7k12EPD.png',
        },
      },
    ]);
  }, []);

  // Function to check if a message contains restricted content (profanity or off-topic)
  const containsRestrictedContent = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    return restrictedKeywords.some((keyword) => lowerCaseMessage.includes(keyword));
  };

  // Function to check if a message is IT-related (networking, hardware, ticketing)
  const isITRelated = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    return allowedITKeywords.some((keyword) => lowerCaseMessage.includes(keyword));
  };

  // Function to check content with OpenAI's Moderation API
  const moderateContent = async (text) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/moderations',
        {
          input: text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      return response.data.results[0].flagged; // Returns true if content is flagged as inappropriate
    } catch (error) {
      console.error('Error calling Moderation API:', error.response ? error.response.data : error.message);
      return false; // Default to not flagged if the API call fails
    }
  };

  const getOpenAIResponse = async (userMessage, retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds base delay for retries

    // Step 1: Check user input for restricted content (profanity or off-topic)
    if (containsRestrictedContent(userMessage)) {
      return FALLBACK_RESPONSE;
    }

    // Step 2: Check if the user message is IT-related (networking, hardware, ticketing)
    if (!isITRelated(userMessage)) {
      return FALLBACK_RESPONSE;
    }

    // Step 3: Check user input with OpenAI's Moderation API
    const isUserMessageFlagged = await moderateContent(userMessage);
    if (isUserMessageFlagged) {
      return FALLBACK_RESPONSE;
    }

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
            {
              role: 'system',
              content:
                'You are a professional IT support chatbot for Toro IT Support. Only respond to questions about networking (e.g., Wi-Fi, VPN, Ethernet), hardware problems (e.g., projectors, USBs, monitors, keyboards), and ticketing (e.g., submitting or tracking IT support tickets). Do not discuss unrelated topics like politics, entertainment, software development, or personal matters. Maintain a professional and helpful tone, avoiding humor, sarcasm, or casual language. If the user asks about a restricted or off-topic question, respond with: "I’m here to help with IT support related to networking (e.g., Wi-Fi, VPN), hardware problems (e.g., projectors, USBs, monitors), and ticketing (e.g., submitting or tracking tickets). Please ask a question about one of these topics." Examples of allowed questions: "Why is my Wi-Fi not working?", "How do I connect my projector?", "How do I submit a support ticket?" Examples of disallowed questions: "What’s the best movie?", "Tell me a joke.", "How do I write code in Python?"',
            },
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

      // Step 4: Check the chatbot's response with OpenAI's Moderation API
      const isBotResponseFlagged = await moderateContent(botResponse);
      if (isBotResponseFlagged) {
        return FALLBACK_RESPONSE;
      }

      // Step 5: Check the chatbot's response for restricted content
      if (containsRestrictedContent(botResponse)) {
        return FALLBACK_RESPONSE;
      }

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