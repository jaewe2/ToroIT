import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from './auth-context';
import { Colors } from '@/constants/Colors';

export default function Account() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleLogout = () => {
    logout();
  };

  const handleGoToAdmin = () => {
    router.push('/admin-dashboard');   // << Make sure file is app/admin-dashboard.jsx
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

          <View style={styles.infoBox}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Role</Text>
            <View style={styles.roleBadge}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>{user.role}</Text>
            </View>
          </View>

          {user.role === 'admin' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleGoToAdmin}
            >
              <Text style={styles.buttonText}>Go to Admin Dashboard</Text>
            </TouchableOpacity>
          )}

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
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  roleBadge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
