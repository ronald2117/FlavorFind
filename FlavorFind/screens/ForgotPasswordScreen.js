import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleReset = () => {
        if (!email) {
            setError('Email is required');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert('Success', 'Reset link sent to your email.');
                setError('');
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={25} color="white" style={{ marginTop: 30 }} />
            </TouchableOpacity>
            <Text style={styles.title}>Enter your email to reset password</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleReset} >
                <Text style={{ color: '#fff' }}>Send Reset Link</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        height: '100%',
        padding: 15,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 60,
        marginTop: 40,
    },
    input: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 8,
        color: 'white',
        marginBottom: 20,
    },
    error: { color: 'red', marginTop: 10 },
    button: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
});
