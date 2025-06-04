import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, 
      padding: 20,
    },
    backButton: {
      marginBottom: 20,
    },
    title: {
      fontSize: 35,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 40,
      marginTop: 90,
    },
    input: {
      backgroundColor: theme.inputBG,
      padding: 15,
      borderRadius: 8,
      color: theme.text,
      marginBottom: 20,
    },
    passwordContainer: {
      backgroundColor: theme.inputBG,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    passwordInput: {
      flex: 1,
      color: 'white',
      borderRadius: 8,
    },
    forgotPassword: {
      alignItems: 'flex-end',
      marginTop: 10,
      marginBottom: 30,
    },
    forgotText: {
      color: theme.background,
      fontSize: 14,
    },
    loginButton: {
      backgroundColor: theme.inputBG,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    loginText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const username = userSnap.data().username;
        await updateProfile(user, {
          displayName: username,
        });
        console.log('Display name updated to:', username);
      } else {
        console.warn('No user data found in Firestore for UID:', user.uid);
      }
    } catch (error) {
      console.error('Sign in failed:', error.message);
      Alert.alert('Login Failed', error.message); // ⬅️ Show error alert
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={25} color="white" style={{ marginTop: 30 }} />
      </TouchableOpacity>

      <Text style={styles.title}>Good to see you{'\n'}again!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons name={secureText ? 'eye-off' : 'eye'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


