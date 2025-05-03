import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AiRecipeResultScreen = ({ recipe }) => {

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text>{recipe}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AiRecipeResultScreen;