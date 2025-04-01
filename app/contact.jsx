// contact.jsx — restructured with better visual hierarchy and accessibility
import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Appearance } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ContactScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleLink = (url) => Linking.openURL(url);
  const handleEmail = (email) => Linking.openURL(`mailto:${email}`);
  const handleCall = (number) => Linking.openURL(`tel:${number}`);

  const ContactRow = ({ icon, label, onPress }) => (
    <TouchableOpacity
      style={styles.contactRow}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <FontAwesome name={icon} size={20} color={theme.primary} style={styles.icon} />
      <Text style={[styles.link, { color: theme.primary }]}>{label}</Text>
    </TouchableOpacity>
  );

  const Section = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: theme.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: theme.text }]}>CSUDH IT Support</Text>

        <Section title="IT Call Center">
          <ContactRow icon="phone" label="310-243-2500" onPress={() => handleCall('3102432500')} />
          <Text style={[styles.text, { color: theme.text }]}>Option #1: Login Issues (MYCSUDH, Email, Canvas)</Text>
        </Section>

        <Section title="Online Help Desk">
          <ContactRow icon="globe" label="csudh.service-now.com" onPress={() => handleLink('https://csudh.service-now.com')} />
        </Section>

        <Section title="Ask Teddy">
          <Text style={[styles.text, { color: theme.text }]}>Click "Ask Teddy" on the Help Desk page and select "Connect with an Agent"</Text>
          <ContactRow icon="external-link" label="Go to Help Desk" onPress={() => handleLink('https://csudh.service-now.com')} />
        </Section>

        <Section title="Toro Welcome & Information Center">
          <ContactRow icon="phone" label="310-243-3645" onPress={() => handleCall('3102433645')} />
          <ContactRow icon="envelope" label="info@csudh.edu" onPress={() => handleEmail('info@csudh.edu')} />
        </Section>

        <Section title="Toro CARE">
          <ContactRow icon="phone" label="310-243-3527" onPress={() => handleCall('3102433527')} />
          <ContactRow icon="envelope" label="torocare@csudh.edu" onPress={() => handleEmail('torocare@csudh.edu')} />
        </Section>

        <Section title="Toro Learning & Testing Center (TLTC)">
          <ContactRow icon="phone" label="310-243-3827" onPress={() => handleCall('3102433827')} />
        </Section>

        <Section title="Admissions">
          <ContactRow icon="phone" label="310-243-3645" onPress={() => handleCall('3102433645')} />
          <ContactRow icon="envelope" label="admissions@csudh.edu" onPress={() => handleEmail('admissions@csudh.edu')} />
        </Section>

        <Section title="Academic Technology">
          <ContactRow icon="phone" label="310-243-3176" onPress={() => handleCall('3102433176')} />
          <Text style={[styles.text, { color: theme.text }]}>Location: North (Old) Library Room 5723</Text>
          <Text style={[styles.text, { color: theme.text }]}>Hours: Monday–Friday, 8 AM–5 PM</Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  icon: {
    marginRight: 10,
  },
});