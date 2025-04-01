// index.jsx (Login Page with UI/UX polish)
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Link } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors } from '@/constants/Colors';
import { useAuth } from './auth-context';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.content}>
          <Image
            source={require('../assets/images/toro-mascot.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to Toro IT Support</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => login(values, { setSubmitting })}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email or Username</Text>
                  <TextInput
                    style={[styles.input, touched.email && errors.email && styles.inputError]}
                    placeholder="Enter your email or username"
                    placeholderTextColor="#999"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Email input"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, touched.password && errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry
                    accessibilityLabel="Password input"
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <Link href="/register" style={styles.registerLink} accessibilityLabel="Go to Register">
                  <Text style={styles.registerText}>Need an account? Register</Text>
                </Link>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  accessibilityLabel="Login button"
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>

                <Link href="/home" style={styles.skipLink} accessibilityLabel="Skip to Home">
                  <Text style={styles.skipText}>Skip to Home Page</Text>
                </Link>
              </>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 10,
    width: '85%',
  },
  mascotImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#b36666',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginBottom: 20,
  },
  registerText: {
    color: Colors.light.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  skipLink: {
    marginTop: 10,
  },
  skipText: {
    color: Colors.light.primary,
    fontSize: 16,
  },
});