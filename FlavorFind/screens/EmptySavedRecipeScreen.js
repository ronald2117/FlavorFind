import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

const EmptySavedRecipeScreen = () => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: theme.text,
            fontSize: 18,
        },
    });
    return (
        <View style={styles.container}>
            <Text style={styles.text}>No Saved Recipes</Text>
        </View>
    );
};



export default EmptySavedRecipeScreen;