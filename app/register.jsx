
import React, { useState } from 'react';
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
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const deriveUsername = (email) => {
    const prefix = email.split('@')[0];
    return prefix.length > 4 ? prefix.slice(0, 4) : prefix;
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
          const uname = deriveUsername(values.email);
          setUsername(uname);
          register(values, uname, { setSubmitting });
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
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.inputBorder, color: theme.text },
              ]}
              placeholder="CSUDH Email"
              placeholderTextColor={theme.textSecondary}
              value={values.email}
              onChangeText={(text) => {
                setFieldValue('email', text);
                setUsername(deriveUsername(text));
              }}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

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
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TextInput
              style={[
                styles.input,
                { borderColor: theme.inputBorder, color: theme.text },
              ]}
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

            {/* Show auto-generated username */}
            {username ? (
              <View style={styles.usernamePreview}>
                <Text style={{ color: theme.textSecondary }}>Username:</Text>
                <Text style={{ color: theme.primary, fontWeight: 'bold' }}> {username}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/')}
              style={styles.link}
            >
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
  usernamePreview: {
    flexDirection: 'row',
    alignItems: 'center',
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
