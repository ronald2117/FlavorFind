import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { updateEmail } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ChangeEmailScreen = ({ navigation }) => {
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
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
          }}
        >
          Change Email
        </Text>
      </View>
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
    </SafeAreaView>
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
    marginTop: 5,
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
