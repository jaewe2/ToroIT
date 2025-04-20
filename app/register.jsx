import React, { useState, useCallback } from 'react';
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
import Toast from 'react-native-toast-message';
import debounce from 'lodash.debounce';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const checkAndSetUsername = useCallback(
    debounce(async (email) => {
      if (!email || !email.includes('@')) return;

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
    }, 500),
    []
  );

  const handleRegisterSubmit = async (values, { setSubmitting }) => {
    try {
      Toast.hide();
      await register(values, username, { setSubmitting });

      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'You can now log in.',
      });

      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.logoWrap}>
        <View style={styles.mascotContainer}>
          <Image source={require('../assets/images/toro-mascot.png')} style={styles.logo} />
        </View>
        <Text style={[styles.title, { color: theme.primary }]}>Register for Toro IT</Text>
      </View>

      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegisterSubmit}
      >
        {(formikProps) => {
          const {
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          } = formikProps;

          return (
            <>
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
                  <View
                    style={[
                      styles.usernameBox,
                      { borderColor: theme.primary, backgroundColor: theme.card },
                    ]}
                  >
                    <Text style={[styles.usernameLabel, { color: theme.primary }]}>
                      Your Toro Username:
                    </Text>
                    <Text style={[styles.usernameValue, { color: theme.secondary }]}>
                      {username}
                    </Text>
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
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={{ color: theme.secondary, marginBottom: 8 }}>
                    {showPassword ? 'Hide' : 'Show'} Password
                  </Text>
                </TouchableOpacity>
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
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Text style={{ color: theme.secondary, marginBottom: 8 }}>
                    {showConfirm ? 'Hide' : 'Show'} Confirm Password
                  </Text>
                </TouchableOpacity>
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

              {/* Safe loading overlay outside render variation */}
              {isSubmitting && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={{ color: theme.text, marginTop: 10 }}>
                    Creating your account...
                  </Text>
                </View>
              )}
            </>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 24 },
  mascotContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
