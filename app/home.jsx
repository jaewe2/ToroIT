import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useColorScheme,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function Announcements() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  // Mock data for announcements (IT support–focused)
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Password Policy Update',
      content:
        'Starting May 5, all passwords must be at least 12 characters long and include uppercase, lowercase, numbers, and symbols.',
    },
    {
      id: 2,
      title: 'Scheduled Network Upgrade',
      content:
        'Network maintenance on May 10 from 1:00 AM–3:00 AM. Expect brief connectivity interruptions.',
    },
    {
      id: 3,
      title: 'Phishing Awareness Training',
      content:
        'New mandatory phishing training launched. Complete it by end of month to remain compliant.',
    },
    {
      id: 4,
      title: 'Service Desk Extended Hours',
      content:
        'Service Desk now open 24/7 effective immediately. Submit tickets anytime for critical issues.',
    },
    {
      id: 5,
      title: 'New Self-Service Portal',
      content:
        'We’ve launched a new self-service portal for password resets and software requests. Check it out under IT Tools.',
    },
    {
      id: 6,
      title: 'Server Patch Deployment',
      content:
        'Critical security patches applied May 1–2. Report any issues to support@company.com.',
    },
    {
      id: 7,
      title: 'VPN Maintenance',
      content:
        'VPN will be unavailable May 12 from 11:00 PM–2:00 AM. Plan remote work accordingly.',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const addAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const next = {
      id: Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
    };
    setAnnouncements([next, ...announcements]);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerText, { color: theme.text }]}>Announcements</Text>

        {announcements.map(a => (
          <View
            key={a.id}
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <FontAwesome
                name="bullhorn"
                size={20}
                color={theme.primary}
                style={styles.cardHeaderIcon}
              />
              <Text style={[styles.cardTitle, { color: theme.text }]}>{a.title}</Text>
            </View>
            <Text style={[styles.cardContent, { color: theme.text }]}>
              {a.content}
            </Text>
          </View>
        ))}

        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, backgroundColor: theme.card, color: theme.text },
          ]}
          placeholder="Title"
          placeholderTextColor={theme.placeholder}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, backgroundColor: theme.card, color: theme.text },
          ]}
          placeholder="Content"
          placeholderTextColor={theme.placeholder}
          value={newContent}
          onChangeText={setNewContent}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={addAnnouncement}
        >
          <Text style={styles.buttonText}>Add Announcement</Text>
        </TouchableOpacity>
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
  card: {
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardHeaderIcon: { marginRight: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardContent: { fontSize: 14, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
