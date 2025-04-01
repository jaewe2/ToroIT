// app/chatbot.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const restrictedKeywords = ['politics', 'religion', 'movie', 'game', 'joke', 'damn', 'hell', 'idiot', 'stupid', 'fool'];

const allowedITKeywords = [
  'network', 'wifi', 'ethernet', 'vpn', 'internet', 'connectivity', 'router', 'firewall',
  'projector', 'usb', 'monitor', 'screen', 'keyboard', 'mouse', 'printer', 'laptop', 'computer', 'hardware', 'device',
  'ticket', 'ticketing', 'support ticket', 'issue', 'submit ticket', 'track ticket', 'resolve ticket',
];

const FALLBACK_RESPONSE =
  'I’m here to help with IT support related to networking (e.g., Wi-Fi, VPN), hardware problems (e.g., projectors, USBs, monitors), and ticketing (e.g., submitting or tracking tickets). Please ask a question about one of these topics.';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  useEffect(() => {
    if (!API_KEY) {
      Alert.alert('Error', 'Chatbot API key is missing. Please contact support.');
      console.error('OpenAI API Key missing.');
    }

    setMessages([{
      _id: '1',
      text: 'Hello! I am your Toro IT Support Chatbot. I can help with networking, hardware issues, and support ticket tracking. How can I assist you today?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Chatbot',
        avatar: 'https://i.imgur.com/7k12EPD.png',
      },
    }]);
  }, []);

  const containsRestrictedContent = (message) =>
    restrictedKeywords.some((keyword) => message.toLowerCase().includes(keyword));

  const isITRelated = (message) =>
    allowedITKeywords.some((keyword) => message.toLowerCase().includes(keyword));

  const moderateContent = async (text) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/moderations',
        { input: text },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      return response.data.results[0].flagged;
    } catch (error) {
      console.error('Moderation error:', error.message);
      return false;
    }
  };

  const getOpenAIResponse = async (userMessage, retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 2000;

    if (containsRestrictedContent(userMessage) || !isITRelated(userMessage)) {
      return FALLBACK_RESPONSE;
    }

    const flagged = await moderateContent(userMessage);
    if (flagged) return FALLBACK_RESPONSE;

    try {
      setIsTyping(true);

      const now = Date.now();
      const timeSinceLast = now - lastRequestTime;
      if (timeSinceLast < 2000) await delay(2000 - timeSinceLast);

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
              content: 'You are a helpful IT support chatbot for Toro. Only answer questions related to networking, hardware, and ticketing. Do not answer anything else.',
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

      if (await moderateContent(botResponse) || containsRestrictedContent(botResponse)) {
        return FALLBACK_RESPONSE;
      }

      return botResponse;
    } catch (error) {
      console.error('Chatbot error:', error.message);
      if (error.response?.status === 429 && retryCount < maxRetries) {
        const delayTime = baseDelay * Math.pow(2, retryCount);
        await delay(delayTime);
        return getOpenAIResponse(userMessage, retryCount + 1);
      }

      Alert.alert('Error', 'Failed to get a chatbot response.');
      return 'Sorry, something went wrong. Please try again.';
    } finally {
      setIsTyping(false);
    }
  };

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));

    const userMessage = newMessages[0].text;
    const botText = await getOpenAIResponse(userMessage);

    const botMessage = {
      _id: Math.random().toString(36).substring(7),
      text: botText,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Chatbot',
        avatar: 'https://i.imgur.com/7k12EPD.png',
      },
    };

    setMessages((prev) => GiftedChat.append(prev, [botMessage]));
  }, [messages]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{ _id: 1 }}
        isTyping={isTyping}
        placeholder="Ask about IT issues (e.g., Wi-Fi, projector)..."
        renderUsernameOnMessage
        alwaysShowSend
        showAvatarForEveryMessage
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
