import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

const LoadingScreen = () => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.text} />
        </View>
    );
};

export default LoadingScreen;