
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import icedCoffeeImg from '../assets/images/iced-coffee.png';

export default function Home() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={icedCoffeeImg}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.title}>Toro IT Support</Text>

        <Link href="/contact" style={styles.button}>
          <Text style={styles.buttonText}>Contact Us</Text>
        </Link>

        <Link href="/tickets" style={styles.button}>
          <Text style={styles.buttonText}>Support Tickets</Text>
        </Link>

        <Link href="/knowledge-base" style={styles.button}>
          <Text style={styles.buttonText}>Knowledge Base</Text>
        </Link>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 80,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  button: {
    height: 60,
    width: 220,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
