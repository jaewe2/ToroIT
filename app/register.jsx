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
import { Formik } from 'formik';
import * as Yup from 'yup';

// yup validation form
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
  const [fetchedUsername, setFetchedUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  //4 chars of the prefix for username
  const deriveUsernameFromEmail = (email) => {
    try {
      const prefix = email.split('@')[0];
      const username = prefix.length > 4 ? prefix.substring(0, 4) : prefix;
      setFetchedUsername(username);
      setUsernameError('');
    } catch (error) {
      setFetchedUsername('');
      setUsernameError('Error deriving username: ' + error.message);
    }
  };

  // email change and deriving username
  const handleEmailChange = (email, setFieldValue) => {
    setFieldValue('email', email);
    if (email && email.endsWith('@toromail.csudh.edu')) {
      deriveUsernameFromEmail(email);
    } else {
      setFetchedUsername('');
      setUsernameError('');
    }
  };

  // registeration logic later
  const handleRegister = async (values, { setSubmitting }) => {
    try {
      if (!fetchedUsername) {
        Alert.alert('Error', 'Username could not be derived. Please try again.');
        return;
      }

      
      const registrationData = {
        email: values.email,
        username: fetchedUsername,
        password: values.password,
      };
      console.log('Registration data:', registrationData);
      Alert.alert('Success', 'Registration successful! Please log in.');
      router.replace('/'); // back to login page
    } catch (error) {
      Alert.alert('Error', 'Registration failed: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/400x800/800000/FFFFFF?text=Maroon+Background' }}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Register for Toro IT Support</Text>

          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
              <>
                <TextInput
                  style={[styles.input, touched.email && (errors.email || usernameError) && styles.errorInput]}
                  placeholder="Email (must be @toromail.csudh.edu)"
                  value={values.email}
                  onChangeText={(text) => handleEmailChange(text, setFieldValue)}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  placeholder="Username (auto-filled)"
                  value={fetchedUsername}
                  editable={false}
                  placeholderTextColor="#666"
                />

                <TextInput
                  style={[styles.input, touched.password && errors.password && styles.errorInput]}
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <TextInput
                  style={[styles.input, touched.confirmPassword && errors.confirmPassword && styles.errorInput]}
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
                {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <Link href="/" style={styles.skipLink}>
                  <Text style={styles.skipText}>Back to Login</Text>
                </Link>
              </>
            )}
          </Formik>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White overlay
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
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#DAA520', // Gold border to match Toro theme
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0', // Light gray to indicate it's disabled
    color: '#666',
  },
  errorInput: {
    borderColor: '#ff0000', // Red border for errors
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#800000', // Maroon buttons
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#b36666', // Lighter maroon when disabled
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
    color: '#800000', // Skip text is maroon
    fontSize: 16,
  },
});