import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptySavedRecipeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>No Saved Recipes</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
});

export default EmptySavedRecipeScreen;