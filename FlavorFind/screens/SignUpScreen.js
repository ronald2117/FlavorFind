// screens/SignUpScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity, // For better button styling
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Import your Firebase config

function SignUpScreen({ navigation }) { // Added navigation prop
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        // Basic Validation
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true); // Show loading indicator

        try {
            // 1. Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            // 2. Create user document in Firestore
            //    Use user.uid as the document ID
            await setDoc(doc(db, "users", user.uid), {
                username: username.trim(),
                email: user.email,
                role: 'user', // Default role for new sign-ups
                createdAt: serverTimestamp(), // Record the time
                isBanned: false // Default ban status
                // You can add more fields here later, like profilePictureUrl etc.
            });

            // Sign up successful!
            // The onAuthStateChanged listener in App.js will handle navigation
            // No need to explicitly navigate here in this setup

            // Optional: Show a success message (though navigation usually happens quickly)
            // Alert.alert('Success', 'Account created successfully!');

        } catch (error) {
            // Handle Errors
            console.error("Sign up error:", error);
            let errorMessage = 'An error occurred during sign up.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email address is already in use.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (error.code === 'auth/invalid-email') {
                 errorMessage = 'Please enter a valid email address.';
            }
            // You might want to add more specific error handling based on Firebase error codes
            Alert.alert('Sign Up Failed', errorMessage);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Create Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Hides the password
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" style={styles.buttonSpacing} />
                ) : (
                    <TouchableOpacity style={[styles.button, styles.buttonSpacing]} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                )}

                {/* Optional: Add a button to navigate to Sign In Screen */}
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.signInText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Make KeyboardAvoidingView take full height
    },
    scrollContainer: {
        flexGrow: 1, // Allow content to grow and enable scrolling
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa', // Light background color
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#343a40', // Darker text color
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ced4da', // Lighter border color
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff', // White background for inputs
        fontSize: 16,
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        backgroundColor: '#007bff', // Primary blue color
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff', // White text
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSpacing: {
         marginTop: 10, // Add some space above the button/spinner
         marginBottom: 20, // Add space below button
    },
    signInText: {
        marginTop: 15,
        color: '#007bff',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
});

export default SignUpScreen;