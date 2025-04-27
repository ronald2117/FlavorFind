import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const AccountScreen = () => {
    const navigation = useNavigation(); // Access the navigation object

    const handleLogout = () => {
        const auth = getAuth(); // Get the Firebase auth instance
        signOut(auth)
            .then(() => {
                navigation.replace('Welcome');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Account Screen</Text>
            <Button title="Log Out" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AccountScreen;