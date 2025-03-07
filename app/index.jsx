import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { Link, router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    //regular vaidation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // logic logic, just need blockchain authorization here.
    Alert.alert('Success', `Logged in with ${email}`);
    console.log('Email:', email, 'Password:', password);
    // home page after this (main area of interest)
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* Maroon background */}
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/400x800/800000/FFFFFF?text=Maroon+Background' }} // could fit the toro mascot here
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Toro IT Support</Text>

          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Link href="/home" style={styles.skipLink}>
            <Text style={styles.skipText}>Skip to next page for now</Text>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', //white overlay
    margin: 20,
    borderRadius: 10,
    width: '80%', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#800000', // Maroon color title
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#DAA520', // gold border to match Toro theme
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#800000', //maroon buttons
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipLink: {
    marginTop: 10,
  },
  skipText: {
    color: '#800000', //skip text is maroon for now (authenication not implemented yet)
    fontSize: 16,
  },
});