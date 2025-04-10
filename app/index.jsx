import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useColorScheme,
  Switch,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/Colors';
import { useAuth } from './auth-context';

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required('Username or email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const MAX_ATTEMPTS = 4;

  const loadSavedCredentials = async (setFieldValue) => {
    try {
      const savedIdentifier = await AsyncStorage.getItem('savedIdentifier');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      if (savedIdentifier && savedPassword) {
        setFieldValue('identifier', savedIdentifier);
        setFieldValue('password', savedPassword);
        setRememberMe(true);
      }
    } catch (err) {
      console.log('Failed to load saved credentials', err);
    }
  };

  const handleLoginSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('savedIdentifier', values.identifier);
        await AsyncStorage.setItem('savedPassword', values.password);
      } else {
        await AsyncStorage.removeItem('savedIdentifier');
        await AsyncStorage.removeItem('savedPassword');
      }

      await login(values, { setSubmitting });

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        router.push('https://www.csudh.edu/password/');
        setLoginAttempts(0);
      } else {
        setErrors({
          password: `Login failed. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
        });
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Please check your credentials.',
        });
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
          setFieldValue,
        }) => {
          useEffect(() => {
            loadSavedCredentials(setFieldValue);
          }, []);

          return (
            <>
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
                  autoComplete="username"
                  textContentType="username"
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
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="password"
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={{ color: theme.secondary, marginBottom: 8 }}>
                    {showPassword ? 'Hide' : 'Show'} Password
                  </Text>
                </TouchableOpacity>

                <View style={styles.rememberMe}>
                  <Text style={{ color: theme.text }}>Remember Me</Text>
                  <Switch
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    thumbColor={rememberMe ? theme.primary : '#ccc'}
                  />
                </View>

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

              {/* Full-screen loading overlay */}
              {isSubmitting && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={{ color: theme.text, marginTop: 10 }}>Logging you in...</Text>
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
  rememberMe: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
