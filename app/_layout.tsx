// _layout.tsx with ticket-form and ticket-details removed from Tabs
import { Tabs } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './auth-context';

export default function RootLayout() {
  const maroon = '#800000';
  const gold = '#DAA520';

  return (
    <AuthProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: maroon },
          headerTintColor: '#fff',
          tabBarStyle: { backgroundColor: maroon },
          tabBarActiveTintColor: gold,
          tabBarInactiveTintColor: '#fff',
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Login',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: 'Register',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-plus" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chatbot"
          options={{
            title: 'Chatbot',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="comments" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            title: 'Contact',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="call" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'Tickets',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="ticket" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="knowledge-base"
          options={{
            title: 'Help',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="book" size={size} color={color} />
            ),
          }}
        />
        {/* ticket-form and ticket-details are nested pages accessed from within Tickets tab */}
      </Tabs>
    </AuthProvider>
  );
}
