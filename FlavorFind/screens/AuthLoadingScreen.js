import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoadingScreen = ({ navigation }) => {
    useEffect(() => {
        const checkAuth = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            navigation.navigate(userToken ? 'App' : 'Auth');
        };

        checkAuth();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AuthLoadingScreen;