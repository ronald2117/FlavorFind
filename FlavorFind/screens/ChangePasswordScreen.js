import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { updatePassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';

const ChangePasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
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

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, password);
      alert('Password updated successfully!');
    } catch (error) {
      alert('Error updating password: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text
          style={{
            color: theme.text,
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
          }}
        >
          Update Password
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="New password"
        placeholderTextColor={theme.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
