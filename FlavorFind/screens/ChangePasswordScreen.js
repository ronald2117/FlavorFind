import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { updatePassword } from 'firebase/auth';

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, password);
      alert('Password updated successfully!');
    } catch (error) {
      alert('Error updating password: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;

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
