import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import FlavorBotLogoWithText from "../components/FlavorBotLogoWithText";
import * as Clipboard from "expo-clipboard";
import Markdown from "react-native-markdown-display";
import { useTheme } from '../ThemeContext';

const AiRecipeResultScreen = ({ route }) => {
  const { theme } = useTheme();
  const { recipe } = route.params;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      padding: 20,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 20,
      marginTop: 30,
    },
    copyButton: {
      backgroundColor: theme.buttonBG,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    copyButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  const markdownStyles = {
    body: {
      color: theme.text,
      fontSize: 16,
      lineHeight: 24,
    },
  };

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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FlavorBotLogoWithText />
      </View>
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
    >
      <Markdown style={markdownStyles}>{recipe}</Markdown>
      <TouchableOpacity
        style={styles.copyButton}
        onPress={handleCopyToClipboard}
      >
        <Text style={styles.copyButtonText}>Copy Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

export default AiRecipeResultScreen;
