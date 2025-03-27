
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Picker,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function TicketForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Login');

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    // Simulate submitting the ticket
    Alert.alert('Ticket submitted!', 'Your support request has been received.');
    setTimeout(() => {
      router.replace('/tickets'); // Navigate back to tickets screen
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Submit a Support Ticket</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Brief issue summary"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Login" value="Login" />
            <Picker.Item label="Network" value="Network" />
            <Picker.Item label="Hardware" value="Hardware" />
            <Picker.Item label="Software" value="Software" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue in detail..."
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Ticket</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#800000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
