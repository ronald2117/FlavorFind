import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo'; 

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Logo width={280} height={300} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 70,
        marginTop: 80,
    },
    buttonContainer: {
        padding: 20,
        margin: 5,
        justifyContent: 'flex-end',
    },
    loginButton: {
        backgroundColor: '#3B3B3B',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
    },
    registerButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700', // Yellow border
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonWrapper: {
        marginVertical: 10, 
    }
});

export default WelcomeScreen;