import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { updateEmail } from 'firebase/auth';

const ChangeEmailScreen = () => {
  const [email, setEmail] = useState('');

  const handleChangeEmail = async () => {
    try {
      await updateEmail(auth.currentUser, email);
      alert('Email updated successfully!');
    } catch (error) {
      alert('Error updating email: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Change Email</Text>
      <TextInput
        style={styles.input}
        placeholder="New email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
        <Text style={styles.buttonText}>Update Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
