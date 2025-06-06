import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useTheme } from "../ThemeContext";
import FlavorBotLogoWithText from "../components/FlavorBotLogoWithText";

const AiRecipeFormScreen = () => {
  const [budget, setBudget] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState("");
  const [dishType, setDishType] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [cookingMethod, setCookingMethod] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigation = useNavigation();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingBottom: 0,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      color: theme.text,
      fontSize: 16,
      marginBottom: 6,
      fontWeight: "bold",
    },
    smallText: {
      fontSize: 12,
      fontWeight: "normal",
      color: theme.placeholder,
    },
    input: {
      backgroundColor: theme.inputBG,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
    },
    button: {
      backgroundColor: theme.buttonBG,
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: "center",
    },
    buttonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    loadingText: {
      color: theme.text,
      fontSize: 18,
      marginTop: 10,
    },
  });

  const generateRecipe = async () => {
    const prompt = `
    You are a professional chef and recipe creator. Your goal is to generate a detailed and delicious recipe based on the user's input.
    
    Here is the user's input:
    - Budget: ₱${budget}.
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
    6. Talk to the user in a friendly and engaging manner.
    
    Make sure the recipe is realistic, budget-conscious, and appealing to the user.
    `;

    setLoading(true); // Show loading indicator
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3-8b-8192",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
        }
      );

      const recipe = response.data.choices[0].message.content;
      setLoading(false); // Hide loading indicator
      navigation.navigate("AiResult", { recipe });
    } catch (error) {
      console.error("Error fetching recipe from Groq:", error);
      setLoading(false); // Hide loading indicator
      Alert.alert("Error", "Failed to generate the recipe. Please try again.");
    }
  };

  if (loading) {
    // Render loading screen while generating recipe
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={styles.loadingText}>Generating your recipe...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <FlavorBotLogoWithText style={{ height: 51 }}/>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="500"
            placeholderTextColor={theme.placeholder}
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
            placeholderTextColor={theme.placeholder}
            value={ingredients}
            onChangeText={setIngredients}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Preferences{" "}
            <Text style={styles.smallText}>(e.g. vegetarian, spicy)</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="vegetarian, without oil"
            placeholderTextColor={theme.placeholder}
            value={preferences}
            onChangeText={setPreferences}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Filipino"
            placeholderTextColor={theme.placeholder}
            value={dishType}
            onChangeText={setDishType}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meal Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Lunch"
            placeholderTextColor={theme.placeholder}
            value={mealTime}
            onChangeText={setMealTime}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cooking Method</Text>
          <TextInput
            style={styles.input}
            placeholder="Grilling"
            placeholderTextColor={theme.placeholder}
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

const AiRecipeResultScreen = ({ route }) => {
  const { recipe } = route.params;
  const { theme } = useTheme();

  const resultStyles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
    },
    recipeText: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
    },
  });

  return (
    <ScrollView contentContainerStyle={resultStyles.container}>
      <Text style={resultStyles.title}>Generated Recipe</Text>
      <Text style={resultStyles.recipeText}>{recipe}</Text>
    </ScrollView>
  );
};

export default AiRecipeFormScreen;
export { AiRecipeResultScreen };
