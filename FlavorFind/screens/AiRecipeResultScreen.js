import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import FlavorBotLogoWithText from "../components/FlavorBotLogoWithText";
import * as Clipboard from "expo-clipboard";
import Markdown from "react-native-markdown-display";

const AiRecipeResultScreen = ({ route }) => {
  const { recipe } = route.params;

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(recipe);
      Alert.alert("Copied!", "The recipe has been copied to your clipboard.");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "Failed to copy the recipe. Please try again.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <FlavorBotLogoWithText />
      </View>
      <Markdown style={markdownStyles}>{recipe}</Markdown>
      <TouchableOpacity
        style={styles.copyButton}
        onPress={handleCopyToClipboard}
      >
        <Markdown style={styles.copyButtonText}>Copy Recipe</Markdown>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700", // Gold color for the title
    marginBottom: 20,
    textAlign: "center",
  },
  recipeText: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 24,
    marginBottom: 30,
  },
  copyButton: {
    backgroundColor: "#1E90FF", // Blue button
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  copyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const markdownStyles = {
  body: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 24,
  },
};

export default AiRecipeResultScreen;
