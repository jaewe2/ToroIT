import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Appearance } from 'react-native';

export default function OrdersScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const mockOrders = [
    { id: '1', item: 'Espresso', date: '2025-03-20', price: 3.50 },
    { id: '2', item: 'Latte', date: '2025-03-19', price: 4.00 },
    { id: '3', item: 'Cappuccino', date: '2025-03-18', price: 4.50 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Your Orders</Text>
      {mockOrders.length === 0 ? (
        <Text style={[styles.text, { color: theme.text }]}>No orders yet.</Text>
      ) : (
        <FlatList
          data={mockOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={[styles.orderText, { color: theme.text }]}>
                {item.item} - ${item.price.toFixed(2)}
              </Text>
              <Text style={[styles.orderDate, { color: theme.text }]}>
                Ordered on: {item.date}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    marginTop: 5,
  },
});