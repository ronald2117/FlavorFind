import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AiRecipeFormScreen = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipe, setRecipe] = useState('');

    const handleGenerateRecipe = () => {
        // Placeholder for AI recipe generation logic
        setRecipe('Generated recipe will appear here.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI Recipe Generator</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter ingredients (comma-separated)"
                value={ingredients}
                onChangeText={setIngredients}
            />
            <Button title="Generate Recipe" onPress={handleGenerateRecipe} />
            {recipe ? <Text style={styles.recipe}>{recipe}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    recipe: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
});

export default AiRecipeFormScreen;