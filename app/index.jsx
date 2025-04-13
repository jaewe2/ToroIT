
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
  Linking,
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

      const success = await login(values);

      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
        setLoginAttempts(0);
        router.replace('/home');
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          Toast.show({
            type: 'error',
            text1: 'Too Many Failed Attempts',
            text2: 'Please reset your password.',
          });
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts;
          setErrors({
            password: `Incorrect password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
          });
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: `${remaining} attempt${remaining === 1 ? '' : 's'} left before reset.`,
          });
        }
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'An unexpected error occurred.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openForgotPassword = () => {
    Linking.openURL('https://www.csudh.edu/password/');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.logoWrap}>
        <View style={styles.mascotContainer}>
          <Image
            source={require('../assets/images/toro-mascot.png')}
            style={styles.logo}
          />
        </View>
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

                {loginAttempts > 0 && loginAttempts < MAX_ATTEMPTS && (
                  <Text style={{ color: theme.secondary, marginBottom: 8 }}>
                    {MAX_ATTEMPTS - loginAttempts} attempt
                    {MAX_ATTEMPTS - loginAttempts === 1 ? '' : 's'} remaining.
                  </Text>
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

                <TouchableOpacity onPress={openForgotPassword} style={styles.link}>
                  <Text style={[styles.linkText, { color: theme.secondary }]}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              {isSubmitting && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={{ color: theme.text, marginTop: 10 }}>
                    Logging you in...
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
    marginTop: 12,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: 15,
    textDecorationLine: 'underline',
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
