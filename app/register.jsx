import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors } from '@/constants/Colors';
import { useAuth } from './auth-context';
import { router } from 'expo-router';

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .matches(/@toromail\.csudh\.edu$/, 'Must be a @toromail.csudh.edu email')
    .required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const checkAndSetUsername = async (email) => {
    const prefix = email.split('@')[0].slice(0, 4);
    if (!prefix) return;

    setChecking(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/');
      const data = await res.json();
      let candidate = prefix;
      let counter = 1;

      const usernames = new Set(data.map((user) => user.username));
      while (usernames.has(candidate)) {
        counter += 1;
        candidate = `${prefix}${counter}`;
      }

      setUsername(candidate);
    } catch (err) {
      console.error('Username availability check failed:', err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.logoWrap}>
        <Image source={require('../assets/images/toro-mascot.png')} style={styles.logo} />
        <Text style={[styles.title, { color: theme.primary }]}>Register for Toro IT</Text>
      </View>

      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={(values, { setSubmitting }) => {
          register(values, username, { setSubmitting });
        }}
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
          <View style={styles.form}>
            {/* Email */}
            <TextInput
              style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="CSUDH Email"
              placeholderTextColor={theme.textSecondary}
              value={values.email}
              onChangeText={(text) => {
                setFieldValue('email', text);
                checkAndSetUsername(text);
              }}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            {/* Username Preview */}
            {username ? (
              <View style={[styles.usernameBox, { borderColor: theme.primary, backgroundColor: theme.card }]}>
                <Text style={[styles.usernameLabel, { color: theme.primary }]}>Your Toro Username:</Text>
                <Text style={[styles.usernameValue, { color: theme.secondary }]}>{username}</Text>
                {checking && (
                  <Text style={styles.usernameChecking}>Checking availability...</Text>
                )}
              </View>
            ) : null}

            {/* Password */}
            <TextInput
              style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Confirm Password */}
            <TextInput
              style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={theme.textSecondary}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              secureTextEntry
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting || !username || checking}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/')} style={styles.link}>
              <Text style={[styles.linkText, { color: theme.secondary }]}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold' },
  form: {},
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  usernameBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  usernameLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  usernameValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  usernameChecking: {
    fontSize: 12,
    color: '#FFA000',
    marginTop: 4,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: 15,
  },
  error: {
    color: '#C62828',
    fontSize: 12,
    marginBottom: 8,
  },
});

