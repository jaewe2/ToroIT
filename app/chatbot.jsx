import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const restrictedKeywords = ['politics', 'religion', 'movie', 'game', 'joke', 'damn', 'hell', 'idiot', 'stupid', 'fool'];

const allowedITKeywords = [
  'network', 'wifi', 'ethernet', 'vpn', 'internet', 'connectivity', 'router', 'firewall',
  'projector', 'usb', 'monitor', 'screen', 'keyboard', 'mouse', 'printer', 'laptop', 'computer', 'hardware', 'device',
  'ticket', 'ticketing', 'support ticket', 'issue', 'submit ticket', 'track ticket', 'resolve ticket',
];

const FALLBACK_RESPONSE =
  'I can help with networking (e.g., Wi-Fi, VPN), hardware problems (e.g., projectors, USBs, monitors), and ticketing (e.g., submitting or tracking tickets). Please ask about one of those topics.';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am your Toro IT Support Chatbot. How can I assist you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const scrollViewRef = useRef(null);
  const theme = useColorScheme() === 'dark' ? Colors.dark : Colors.light;

  const containsRestrictedContent = (msg) =>
    restrictedKeywords.some((k) => msg.toLowerCase().includes(k));

  const isITRelated = (msg) =>
    allowedITKeywords.some((k) => msg.toLowerCase().includes(k));

  const moderateContent = async (text) => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/moderations',
        { input: text },
        { headers: { Authorization: `Bearer ${API_KEY}` } }
      );
      return res.data.results[0].flagged;
    } catch (err) {
      console.error('Moderation failed:', err);
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
      setLoading(true);

      const now = Date.now();
      const timeSinceLast = now - lastRequestTime;
      if (timeSinceLast < 2000) await delay(2000 - timeSinceLast);
      setLastRequestTime(Date.now());

      const history = messages
        .slice()
        .reverse()
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }))
        .slice(0, 6);

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful Toro IT support assistant. Only respond to questions about networking, hardware, and ticketing. Politely decline others.',
            },
            ...history,
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices[0].message.content.trim();
      const flaggedReply = await moderateContent(reply);
      if (flaggedReply || containsRestrictedContent(reply)) return FALLBACK_RESPONSE;

      return reply;
    } catch (err) {
      console.error('Chatbot error:', err.message);
      if (err.response?.status === 429 && retryCount < maxRetries) {
        await delay(baseDelay * Math.pow(2, retryCount));
        return getOpenAIResponse(userMessage, retryCount + 1);
      }

      Alert.alert('Error', 'Failed to get a response from the chatbot.');
      return 'Sorry, something went wrong. Please try again.';
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    const botReplyText = await getOpenAIResponse(userMsg.text);

    const botMsg = {
      id: Date.now() + 1,
      text: botReplyText,
      sender: 'bot',
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                {
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  backgroundColor: isUser ? theme.primary : theme.card,
                  borderTopRightRadius: isUser ? 0 : 16,
                  borderTopLeftRadius: isUser ? 16 : 0,
                },
              ]}
            >
              <Text style={[styles.messageText, { color: isUser ? '#fff' : theme.text }]}>
                {msg.text}
              </Text>
            </View>
          );
        })}
        {loading && (
          <View style={[styles.bubble, { backgroundColor: theme.card, alignSelf: 'flex-start' }]}>
            <ActivityIndicator size="small" color={theme.primary} />
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.card }]}
          placeholder="Ask about IT issues (e.g., Wi-Fi, projector)..."
          placeholderTextColor={theme.inputBorder}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 10,
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: '#7A003C', // CSUDH Maroon
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignSelf: 'center',
  },
});
