// app/home.jsx
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
        <Text style={styles.title}>Coffee Shop</Text>
        <Link href="/menu" style={styles.button}>
          <Text style={styles.buttonText}>Our Menu</Text>
        </Link>
        <Link href="/contact" style={styles.button}>
          <Text style={styles.buttonText}>Contact Us</Text>
        </Link>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 120,
  },
  button: {
    height: 60,
    width: 150,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6,
    marginBottom: 50,
    marginHorizontal: 'auto',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
});