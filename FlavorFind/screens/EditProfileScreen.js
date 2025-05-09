import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
// import * as ImagePicker from 'expo-image-picker';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState("");
  // const [image, setImage] = useState(null);
  // const [uploading, setUploading] = useState(false);

  // const pickImage = async (fromCamera = false) => {
  //   let result;

  //   if (fromCamera) {
  //     const permission = await ImagePicker.requestCameraPermissionsAsync();
  //     if (!permission.granted) {
  //       alert('Camera permission is required!');
  //       return;
  //     }
  //     result = await ImagePicker.launchCameraAsync();
  //   } else {
  //     result = await ImagePicker.launchImageLibraryAsync();
  //   }

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };

  // const uploadImageAsync = async (uri) => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
  //   const fileRef = ref(storage, `profileImages/${auth.currentUser.uid}.jpg`);
  //   await uploadBytes(fileRef, blob);
  //   return await getDownloadURL(fileRef);
  // };

  const handleSubmit = async () => {
    // setUploading(true);
    try {
      // let imageUrl = null;
      // if (image) {
      //   imageUrl = await uploadImageAsync(image);
      // }

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        username,
        // ...(imageUrl && { photoURL: imageUrl }),
      });

      Alert.alert("Profile updated!");
    } catch (error) {
      Alert.alert("Error updating profile", error.message);
    } finally {
      // setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", padding: 20 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
          }}
        >
          Edit profile
        </Text>
      </View>

      <View
        style={{
          marginTop: 190,
          backgroundColor: "#1e1e1e",
          borderRadius: 10,
          padding: 20,
        }}
      >
        {/* <TouchableOpacity
          onPress={() =>
            Alert.alert('Choose image', '', [
              { text: 'Choose existing photo', onPress: () => pickImage(false) },
              { text: 'Use camera', onPress: () => pickImage(true) },
              { text: 'Cancel', style: 'cancel' },
            ])
          }
          style={{ alignItems: 'flex-end' }}
        >
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity> */}

        <Text style={{ color: "gray" }}>Username</Text>
        <TextInput
          placeholder="@username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          style={{
            color: "white",
            borderBottomColor: "#333",
            borderBottomWidth: 1,
            marginBottom: 15,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: "#333",
          marginTop: 20,
          padding: 15,
          alignItems: "center",
          borderRadius: 6,
        }}
        // disabled={uploading}
      >
        <Text style={{ color: "white" }}>
          {/* uploading ? 'Submitting...' : */ "Submit"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
  },
});
