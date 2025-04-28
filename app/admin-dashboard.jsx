// app/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './auth-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import AdminUserRoleScreen from './AdminUserRoleScreen';  // ↪️ match actual filename

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const userName = user?.username || 'Admin';

  const [currentView, setCurrentView] = useState('home');
  const [analytics, setAnalytics] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentView === 'analytics') {
      fetchAnalytics();
    } else if (currentView === 'activity') {
      fetchActivityLogs();
    }
  }, [currentView]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/analytics/');
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setAnalytics(await res.json());
    } catch (e) {
      console.error(e);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/activity-log/');
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setActivityLogs(await res.json());
    } catch (e) {
      console.error(e);
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const AnalyticsItem = ({ label, value }) => (
    <View style={[styles.analyticsCard, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}>
      <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.analyticsValue, { color: theme.text }]}>{value}</Text>
    </View>
  );

  const renderHome = () => (
    <>
      <Text style={[styles.headerText, { color: theme.text }]}>
        Welcome, {userName}!
      </Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}
        onPress={() => setCurrentView('analytics')}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="analytics-outline" size={24} color={theme.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>Analytics</Text>
        </View>
        <Text style={[styles.cardContent, { color: theme.text }]}>
          Tap to view analytics metrics.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}
        onPress={() => router.push('/admin-tickets')}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="file-tray-full-outline" size={24} color={theme.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>Manage Tickets</Text>
        </View>
        <Text style={[styles.cardContent, { color: theme.text }]}>
          View and manage all support tickets.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}
        onPress={() => setCurrentView('roles')}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="people-outline" size={24} color={theme.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>Manage User Roles</Text>
        </View>
        <Text style={[styles.cardContent, { color: theme.text }]}>
          View and assign roles to users.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}
        onPress={() => setCurrentView('activity')}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="list-outline" size={24} color={theme.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>Activity Log</Text>
        </View>
        <Text style={[styles.cardContent, { color: theme.text }]}>
          Tap to view ticket activities.
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderAnalytics = () => (
    <>
      <TouchableOpacity onPress={() => setCurrentView('home')}>
        <Text style={[styles.backText, { color: theme.primary }]}>← Back to Dashboard</Text>
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: theme.text }]}>Analytics Overview</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 30 }} />
      ) : analytics ? (
        <View style={styles.analyticsContainer}>
          <AnalyticsItem label="Total Tickets" value={analytics.total_tickets} />
          <AnalyticsItem label="Open Tickets" value={analytics.open_tickets} />
          <AnalyticsItem label="Closed Tickets" value={analytics.closed_tickets} />
          <AnalyticsItem label="Total Users" value={analytics.total_users} />
        </View>
      ) : (
        <Text style={{ textAlign:'center', marginTop:20, color:theme.textSecondary }}>
          Failed to load analytics.
        </Text>
      )}
    </>
  );

  const renderActivityLog = () => (
    <>
      <TouchableOpacity onPress={() => setCurrentView('home')}>
        <Text style={[styles.backText, { color: theme.primary }]}>← Back to Dashboard</Text>
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: theme.text }]}>Activity Log</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop:30 }} />
      ) : (
        <View style={{marginTop:20}}>
          {activityLogs.length > 0 ? (
            activityLogs.map((log, i) => (
              <View
                key={i}
                style={[styles.logItem, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}
              >
                <Text style={[styles.logChange, { color: theme.text }]}>{log.change}</Text>
                <Text style={[styles.logTimestamp, { color: theme.textSecondary }]}>
                  {new Date(log.date).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign:'center', marginTop:20, color:theme.textSecondary }}>
              No activity logs yet.
            </Text>
          )}
        </View>
      )}
    </>
  );

  const renderRoles = () => (
    <>
      <TouchableOpacity onPress={() => setCurrentView('home')}>
        <Text style={[styles.backText, { color: theme.primary }]}>← Back to Dashboard</Text>
      </TouchableOpacity>
      <AdminUserRoleScreen />
    </>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {currentView === 'home'
          ? renderHome()
          : currentView === 'analytics'
          ? renderAnalytics()
          : currentView === 'roles'
          ? renderRoles()
          : renderActivityLog()}
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
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 3 },
    }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardHeaderIcon: { marginRight: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardContent: { fontSize: 14, lineHeight: 20 },
  backText: { fontSize: 16, fontWeight: '600', marginBottom: 20 },
  analyticsContainer: { marginTop: 20 },
  analyticsCard: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  analyticsLabel: { fontSize: 16, marginBottom: 8 },
  analyticsValue: { fontSize: 24, fontWeight: 'bold' },
  logItem: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  logChange: { fontSize: 16, fontWeight: '500' },
  logTimestamp: { fontSize: 12, marginTop: 4 },
});
