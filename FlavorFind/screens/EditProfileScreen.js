import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../ThemeContext";
import * as ImagePicker from "expo-image-picker";
import DefaultProfilePic from "../components/DefaultProfilePic";

// Cloudinary config
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtt8pyj8o/image/upload"; // Replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = "react_native_unsigned"; // Replace with your preset

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { theme } = useTheme();
  const [currentPhotoURL, setCurrentPhotoURL] = useState(null);

  useEffect(() => {
    const fetchPhotoURL = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentPhotoURL(userSnap.data().photoURL || null);
        }
      } catch (e) {
        setCurrentPhotoURL(null);
      }
    };
    fetchPhotoURL();
  }, []);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 20 },
    header: { flexDirection: "row", alignItems: "center" },
    card: {
      marginTop: 60,
      backgroundColor: theme.inputBG,
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
    },
    label: { color: theme.placeholder, alignSelf: "flex-start" },
    input: {
      color: theme.text,
      borderBottomColor: theme.text,
      borderBottomWidth: 1,
      marginBottom: 15,
      width: "100%",
    },
    profilePic: {
      width: 80,
      height: 80,
      borderRadius: 50,
      margin: 5,
      backgroundColor: theme.card,
    },
    uploadBtn: {
      backgroundColor: theme.buttonBG,
      borderRadius: 6,
      alignItems: 'center',
    },
    uploadBtnText: { color: theme.text },
    submitButton: {
      backgroundColor: theme.buttonBG,
      marginTop: 20,
      padding: 15,
      alignItems: "center",
      borderRadius: 6,
    },
    submitText: { color: theme.text },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert(
        "Permission Required",
        "Allow photo access to upload a profile picture."
      );
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: `profile_${Date.now()}.jpg`,
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    if (response.ok && data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    let photoURL = null;
    try {
      if (profilePic) {
        photoURL = await uploadImageToCloudinary(profilePic);
      }
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        username,
        ...(photoURL && { photoURL }),
      });
      Alert.alert("Profile updated!");
      setProfilePic(null);
    } catch (error) {
      Alert.alert("Error updating profile", error.message);
    } finally {
      setUploading(false);
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
        {/* Profile Picture Upload Option */}
        <TouchableOpacity onPress={pickImage} disabled={uploading} style={{ marginBottom: 10 }}> 
          <View style={styles.uploadBtn}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : currentPhotoURL ? (
            <Image source={{ uri: currentPhotoURL }} style={styles.profilePic} />
          ) : (
            <DefaultProfilePic style={styles.profilePic} />
          )}
            <Text style={styles.uploadBtnText}>Change Profile Picture</Text>
          </View>
        </TouchableOpacity>
        {uploading && (
          <ActivityIndicator
            color={theme.text}
            style={{ marginTop: 10 }}
          />
        )}
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="New username"
          placeholderTextColor={theme.placeholder}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={uploading}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
