import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../ThemeContext";

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const { theme, toggleTheme, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 20 },
    header: { flexDirection: "row", alignItems: "center" },
    card: {
      marginTop: 190,
      backgroundColor: theme.inputBG,
      borderRadius: 10,
      padding: 20,
    },
    label: { color: theme.placeholder },
    input: {
      color: theme.text,
      borderBottomColor: theme.text,
      borderBottomWidth: 1,
      marginBottom: 15,
    },
    submitButton: {
      backgroundColor: theme.buttonBG,
      marginTop: 20,
      padding: 15,
      alignItems: "center",
      borderRadius: 6,
    },
    submitText: { color: theme.text },
  });

  const handleSubmit = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        username,
      });
      Alert.alert("Profile updated!");
    } catch (error) {
      Alert.alert("Error updating profile", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text
          style={{
            color: theme.text,
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
          }}
        >
          Edit profile
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="New username"
          placeholderTextColor={theme.placeholder}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
