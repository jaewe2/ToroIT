import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './auth-context';
import { Colors } from '@/constants/Colors';

export default function Account() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleLogout = () => {
    console.log('Logout button pressed');
    logout(); // Directly call logout (make sure this is working in auth-context)
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>My Account</Text>

      {user ? (
        <>
          <View style={styles.infoBox}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
            <Text style={[styles.info, { color: theme.text }]}>{user.email}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Username</Text>
            <Text style={[styles.info, { color: theme.text }]}>{user.username}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.logoutButton,
              { borderColor: theme.primary, backgroundColor: theme.card },
            ]}
            onPress={handleLogout}
            accessibilityLabel="Log out"
          >
            <Text style={[styles.logoutText, { color: theme.primary }]}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.primary} />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={[styles.text, { color: theme.textSecondary }]}>Not logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    fontWeight: '500',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderRadius: 10,
    marginTop: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
