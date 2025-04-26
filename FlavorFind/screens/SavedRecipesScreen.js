import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SavedRecipesScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Saved Recipes Screen</Text>
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
});

export default SavedRecipesScreen;