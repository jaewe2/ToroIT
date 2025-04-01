
// Updated +not-found.tsx for better UX and style
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">404 - Page Not Found</ThemedText>
        <ThemedText type="default" style={styles.description}>
          The screen you're looking for doesn’t exist or has been moved.
        </ThemedText>
        <Link href="/" style={styles.link} accessibilityLabel="Go to Home">
          <ThemedText type="link">Return to Home Screen</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
  },
});
