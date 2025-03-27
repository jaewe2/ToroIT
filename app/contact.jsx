
import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Appearance } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function ContactScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleLink = (url) => {
    Linking.openURL(url);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: theme.text }]}>CSUDH IT Support</Text>

        <Section title="IT Call Center">
          <Text style={[styles.text, { color: theme.text }]}>Phone: 310-243-2500</Text>
          <Text style={[styles.text, { color: theme.text }]}>Option #1: Login Issues (MYCSUDH, Email, Canvas)</Text>
        </Section>

        <Section title="Online Help Desk">
          <TouchableOpacity onPress={() => handleLink('https://csudh.service-now.com')}>
            <Text style={[styles.link, { color: theme.primary }]}>csudh.service-now.com</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Ask Teddy">
          <Text style={[styles.text, { color: theme.text }]}>
            Click the "Ask Teddy" tab at the bottom of the Help Desk page and choose "Connect with an Agent"
          </Text>
        </Section>

        <Section title="Toro Welcome & Information Center">
          <Text style={[styles.text, { color: theme.text }]}>Phone: 310-243-3645</Text>
          <TouchableOpacity onPress={() => handleEmail('info@csudh.edu')}>
            <Text style={[styles.link, { color: theme.primary }]}>info@csudh.edu</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Toro CARE">
          <Text style={[styles.text, { color: theme.text }]}>Phone: 310-243-3527</Text>
          <TouchableOpacity onPress={() => handleEmail('torocare@csudh.edu')}>
            <Text style={[styles.link, { color: theme.primary }]}>torocare@csudh.edu</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Toro Learning & Testing Center (TLTC)">
          <Text style={[styles.text, { color: theme.text }]}>Phone: 310-243-3827</Text>
        </Section>

        <Section title="Admissions">
          <Text style={[styles.text, { color: theme.text }]}>Phone: 310-243-3645</Text>
          <TouchableOpacity onPress={() => handleEmail('admissions@csudh.edu')}>
            <Text style={[styles.link, { color: theme.primary }]}>admissions@csudh.edu</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Academic Technology">
          <Text style={[styles.text, { color: theme.text }]}>Phone: 310-243-3176</Text>
          <Text style={[styles.text, { color: theme.text }]}>Location: North (Old) Library Room 5723</Text>
          <Text style={[styles.text, { color: theme.text }]}>Hours: Monday–Friday, 8 AM–5 PM</Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#800000',
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
