import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import FlavorBotLogoWithText from '../components/FlavorBotLogoWithText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const AiRecipeFormScreen = () => {
    const [budget, setBudget] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [preferences, setPreferences] = useState('');
    const [dishType, setDishType] = useState('');
    const [mealTime, setMealTime] = useState('');
    const [cookingMethod, setCookingMethod] = useState('');
    const navigation = useNavigation();

    const generateRecipe = async () => {
        const prompt = `
    You are a professional chef and recipe creator. Your goal is to generate a detailed and delicious recipe based on the user's input.
    
    Here is the user's input:
    - Budget: $${budget}
    - Ingredients available: ${ingredients}
    - Preferences: ${preferences}
    - Dish type: ${dishType}
    - Mealtime: ${mealTime}
    - Cooking method: ${cookingMethod}
    
    Instructions:
    1. Suggest a recipe that matches the budget, ingredients, and preferences.
    2. Give a name to the dish.
    3. List all ingredients needed (including quantities).
    4. Provide step-by-step cooking instructions.
    5. Optionally, include tips or suggestions (like substitutions or garnish ideas).
    
    Make sure the recipe is realistic, budget-conscious, and appealing to the user.
        `;
        try {
            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCmYQzfneMUum4DZ5nLCT6p1Yp9-rbdwdA',
                {
                    contents: [{ parts: [{ text: prompt }] }],
                }
            );

            const recipe = response.data.candidates[0]?.content?.parts[0]?.text || "No recipe found.";
            navigation.navigate('AiResult', { recipe });
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <FlavorBotLogoWithText />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Budget</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="500"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={budget}
                        onChangeText={setBudget}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Ingredients <Text style={styles.smallText}>(Comma-separated)</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="chicken breast, garlic, onions"
                        placeholderTextColor="#ccc"
                        value={ingredients}
                        onChangeText={setIngredients}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Preferences <Text style={styles.smallText}>(e.g. vegetarian, spicy)</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="stir fried"
                        placeholderTextColor="#ccc"
                        value={preferences}
                        onChangeText={setPreferences}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Dish Type</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Filipino"
                        placeholderTextColor="#ccc"
                        value={dishType}
                        onChangeText={setDishType}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Meal Time</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Lunch"
                        placeholderTextColor="#ccc"
                        value={mealTime}
                        onChangeText={setMealTime}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cooking Method</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Grilling"
                        placeholderTextColor="#ccc"
                        value={cookingMethod}
                        onChangeText={setCookingMethod}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <TouchableOpacity style={styles.button} onPress={generateRecipe}>
                        <Text style={styles.buttonText}>Generate Recipe</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 6,
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#aaa',
    },
    input: {
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#fff',
    },
    button: {
        backgroundColor: '#3B3B3B',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AiRecipeFormScreen;