import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import FlavorBotLogoWithText from '../components/FlavorBotLogoWithText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AiRecipeFormScreen = () => {
    const [budget, setBudget] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [preferences, setPreferences] = useState('');
    const [dishType, setDishType] = useState('');
    const [mealTime, setMealTime] = useState('');
    const [cookingMethod, setCookingMethod] = useState('');
    const navigation = useNavigation();

    const handleSubmit = () => {
        navigation.navigate('Result', {
          budget,
          ingredients,
          preferences,
          dishType,
          mealTime,
          cookingMethod,
        });
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
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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