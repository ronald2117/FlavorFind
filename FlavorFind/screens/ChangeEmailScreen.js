import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { updateEmail } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext'; // <-- Import useTheme

const ChangeEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
    },
    input: {
      backgroundColor: theme.inputBG,
      color: theme.text,
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
      marginTop: 5,
    },
    button: {
      backgroundColor: theme.buttonBG,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.text,
      fontWeight: '600',
    },
    backButton: {
      marginBottom: 15,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 15,
    },
  });

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
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "bold", marginLeft: 5 }}>
          Change Email
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="New email"
        placeholderTextColor={theme.placeholder}
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
