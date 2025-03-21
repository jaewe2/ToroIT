// app/register.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors } from '../constants/Colors';
import { useAuth } from './auth-context';

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .matches(/@toromail\.csudh\.edu$/, 'Email must be a valid @toromail.csudh.edu address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function Register() {
  const { register } = useAuth();
  const [fetchedUsername, setFetchedUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const deriveUsernameFromEmail = (email) => {
    try {
      const prefix = email.split('@')[0];
      const username = prefix.length > 4 ? prefix.substring(0, 4) : prefix;
      return { username, error: null };
    } catch (error) {
      return { username: '', error: 'Error deriving username: ' + error.message };
    }
  };

  const handleEmailChange = (email, setFieldValue) => {
    setFieldValue('email', email);
    if (email && email.endsWith('@toromail.csudh.edu')) {
      const { username, error } = deriveUsernameFromEmail(email);
      setFetchedUsername(username);
      setUsernameError(error || '');
    } else {
      setFetchedUsername('');
      setUsernameError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.content}>
          <Text style={styles.title}>Register for Toro IT Support</Text>

          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={(values, { setSubmitting }) =>
              register(values, fetchedUsername, { setSubmitting })
            }
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              isSubmitting,
            }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email (must be @toromail.csudh.edu)</Text>
                  <TextInput
                    style={[styles.input, (touched.email && (errors.email || usernameError)) && styles.inputError]}
                    placeholder="Email (must be @toromail.csudh.edu)"
                    value={values.email}
                    onChangeText={(text) => handleEmailChange(text, setFieldValue)}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    accessibilityLabel="Email input"
                  />
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username (auto-filled)</Text>
                  <TextInput
                    style={[styles.input, usernameError && styles.inputError]}
                    placeholder="Username (auto-filled)"
                    value={fetchedUsername}
                    editable={false}
                    accessibilityLabel="Username (auto-filled)"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, touched.password && errors.password && styles.inputError]}
                    placeholder="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry
                    accessibilityLabel="Password input"
                  />
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={[styles.input, touched.confirmPassword && errors.confirmPassword && styles.inputError]}
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    secureTextEntry
                    accessibilityLabel="Confirm password input"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  accessibilityLabel="Register button"
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Register</Text>
                  )}
                </TouchableOpacity>

                <Link href="/index" style={styles.skipLink}>
                  <Text style={styles.skipText}>Back to Login</Text>
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
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
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
  skipLink: {
    marginTop: 10,
  },
  skipText: {
    color: Colors.light.primary,
    fontSize: 16,
  },
});