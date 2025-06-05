import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useTheme } from '../ThemeContext';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scroll: {
      padding: 20,
    },
    back: {
      marginBottom: 20,
    },
    welcome: {
      color: theme.text,
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 100,
    },
    logo: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    sub: {
      color: theme.text,
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    input: {
      backgroundColor: theme.inputBG,
      color: theme.text,
      padding: 14,
      borderRadius: 8,
      marginBottom: 20,
    },
    inputRow: {
      flexDirection: 'row',
      backgroundColor: theme.inputBG,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    flexInput: {
      flex: 1,
      color: '#fff',
    },
    button: {
      backgroundColor: theme.buttonBG,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonSpace: {
      marginTop: 10,
    },
  });

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        username: username.trim(),
        email: cred.user.email,
        role: 'user',
        createdAt: serverTimestamp(),
        isBanned: false,
      });

      await updateProfile(cred.user, {
        displayName: username.trim(),
      });

    } catch (err) {
      console.error(err);
      let msg = 'Sign up failed.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email already in use.';
      if (err.code === 'auth/weak-password') msg = 'Password too weak.';
      if (err.code === 'auth/invalid-email') msg = 'Invalid email.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={25} color="white" style={{ marginTop: 30 }} />
          </TouchableOpacity>

          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.logo}>
            <Image source={theme.mode == 'dark' ? require('../assets/logo-horizontal-dm.png') : require('../assets/logo-horizontal-lm.png')} width={250} height={80} />
          </Text>
          <Text style={styles.sub}>Register to get started.</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.text}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.text}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.flexInput}
              placeholder="Password"
              placeholderTextColor={theme.text}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.flexInput}
              placeholder="Confirm Password"
              placeholderTextColor={theme.text}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)}>
              <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={styles.buttonSpace} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
