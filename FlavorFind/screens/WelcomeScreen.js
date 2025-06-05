import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeContext';

const WelcomeScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        logoContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        },
        buttonContainer: {
            padding: 20,
            margin: 5,
            justifyContent: 'flex-end',
        },
        loginButton: {
            backgroundColor: theme.buttonBG,
            borderRadius: 8,
            paddingVertical: 15,
            alignItems: 'center',
        },
        registerButton: {
            backgroundColor: theme.buttonBG,
            borderRadius: 8,
            paddingVertical: 15,
            alignItems: 'center',
            marginBottom: 50,
        },
        buttonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: 'bold',
        },
        buttonWrapper: {
            marginVertical: 10, 
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={theme.mode == 'light' ? require('../assets/welcome-icon.png') : require('../assets/welcome-icon-dark-mode.png')}  width={220} height={220} />
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignIn')}
                        style={styles.loginButton}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        style={styles.registerButton}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default WelcomeScreen;