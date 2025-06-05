import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      color: theme.text,
    },
    header: {
      flexDirection: 'row',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 30,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
    },
    optionText: {
      color: theme.text,
      fontSize: 16,
      marginLeft: 10,
    },
  });

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              // No navigation needed!
            } catch (error) {
              alert('Logout failed: ' + error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color={ theme.text } />
        </TouchableOpacity>
        <Text
          style={{
            color: theme.text,
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
          }}
        >
          Settings
        </Text>
      </View>
      <TouchableOpacity style={styles.option} onPress={toggleTheme}>
        <Ionicons name="sunny-outline" size={20} color={ theme.text } />
        <Text style={styles.optionText}>Change Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangeEmail')}>
        <Ionicons name="mail-outline" size={20} color={ theme.text } />
        <Text style={styles.optionText}>Change email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangePassword')}>
        <MaterialIcons name="lock-outline" size={20} color={ theme.text } />
        <Text style={styles.optionText}>Update password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={ theme.text } />
        <Text style={styles.optionText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SettingsScreen;


