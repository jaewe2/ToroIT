import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

// yup validation
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  // blochchain authenication layer later.. added here...
  const handleBlockchainLogin = async (values) => {
    console.log('Blockchain login to be implemented:', values);
    return true; // just make it work for now.
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const blockchainSuccess = await handleBlockchainLogin(values);
      if (!blockchainSuccess) {
        Alert.alert('Error', 'Blockchain authentication failed');
        return;
      }

      Alert.alert('Success', `Logged in with ${values.email}`);
      console.log('Email:', values.email, 'Password:', values.password);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to log in: ' + error.message);
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
          {/* Toro mascot image above the title */}
          <Image
            source={require('../assets/images/toro-mascot.png')} /d
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to Toro IT Support</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <TextInput
                  style={[styles.input, touched.email && errors.email && styles.errorInput]}
                  placeholder="Email or Username"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

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

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Link href="/home" style={styles.skipLink}>
                  <Text style={styles.skipText}>Skip to next page for now</Text>
                </Link>
                <Link href="/register" style={styles.skipLink}>
                  <Text style={styles.skipText}>Need an account? Register</Text>
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
  mascotImage: {
    width: 150, 
    height: 150,
    marginBottom: 20, 
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