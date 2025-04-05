import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useColorScheme,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors } from '@/constants/Colors';
import { useAuth } from './auth-context';

// Updated validation schema to accept either username or email
const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required('Username or email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [loginAttempts, setLoginAttempts] = useState(0);
  const MAX_ATTEMPTS = 4;

  const handleLoginSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values, { setSubmitting });
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        // Redirect to password reset page after 4 failed attempts
        router.push('https://www.csudh.edu/password/');
        setLoginAttempts(0); // Reset attempts after redirect
      } else {
        setErrors({ password: `Login failed. ${MAX_ATTEMPTS - newAttempts} attempts remaining.` });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.logoWrap}>
        <Image source={require('../assets/images/toro-mascot.png')} style={styles.logo} />
        <Text style={[styles.title, { color: theme.primary }]}>Toro IT Login</Text>
      </View>

      <Formik
        initialValues={{ identifier: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLoginSubmit}
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
          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.inputBorder, color: theme.text },
              ]}
              placeholder="Username or Email"
              placeholderTextColor={theme.textSecondary}
              value={values.identifier}
              onChangeText={handleChange('identifier')}
              onBlur={handleBlur('identifier')}
              autoCapitalize="none"
            />
            {touched.identifier && errors.identifier && (
              <Text style={styles.error}>{errors.identifier}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                { borderColor: theme.inputBorder, color: theme.text },
              ]}
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

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <Link href="/register" style={styles.link}>
              <Text style={[styles.linkText, { color: theme.secondary }]}>
                Need an account? Register
              </Text>
            </Link>
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