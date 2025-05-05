// screens/CreatePostScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage, auth } from '../firebaseConfig'; // Import auth
import { useNavigation } from '@react-navigation/native';

const CreatePostScreen = () => {
  console.log(auth);
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();

  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Or your desired aspect ratio
      quality: 0.7, // Adjust quality for faster uploads
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}.jpg`);
    const uploadTask = uploadBytesResumable(fileRef, blob);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog); // Update progress state
                console.log('Upload is ' + prog + '% done');
            },
            (error) => {
                console.error("Upload error:", error);
                blob.close(); // Close the blob resource
                reject(error);
            },
            async () => {
                // Upload completed successfully, now we can get the download URL
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                blob.close(); // Close the blob resource
                resolve(downloadURL);
            }
        );
    });
  };


  const handlePostSubmit = async () => {
    if (!text && !imageUri) {
      Alert.alert("Empty Post", "Please add some text or an image.");
      return;
    }
    if (!auth.currentUser) {
        Alert.alert("Not Logged In", "You must be logged in to post.");
        // Potentially navigate to login screen
        return;
    }

    setUploading(true);
    let imageUrl = null;

    try {
      // Upload image if selected
      if (imageUri) {
         console.log("Uploading image...");
         imageUrl = await uploadImageAsync(imageUri);
         console.log("Image uploaded:", imageUrl);
      }

      // Add post data to Firestore
      const postData = {
        userId: auth.currentUser.uid,
        // TODO: Get username from user profile or auth state
        username: auth.currentUser.displayName || 'Anonymous',
        text: text,
        imageUrl: imageUrl, // null if no image
        createdAt: serverTimestamp(), // Use server timestamp
        likes: {},
        saves: {},
        likeCount: 0,
        commentCount: 0,
      };

      console.log("Adding document to Firestore with data:", postData);
      const docRef = await addDoc(collection(db, 'posts'), postData);
      console.log("Document written with ID: ", docRef.id);

      setUploading(false);
      setText('');
      setImageUri(null);
      setProgress(0);
      Alert.alert("Success", "Your recipe post has been created!");
      navigation.goBack(); // Go back to the feed

    } catch (error) {
      console.error("Error creating post: ", error);
      setUploading(false);
      setProgress(0);
      Alert.alert("Error", "Could not create post. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Recipe Details / Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Share your recipe steps, ingredients, story..."
        value={text}
        onChangeText={setText}
        multiline
      />

      <Button title="Pick an image from camera roll" onPress={pickImage} disabled={uploading}/>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      {uploading && (
        <View style={styles.progressContainer}>
          <Text>Uploading: {progress}%</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <Button title={uploading ? "Posting..." : "Create Post"} onPress={handlePostSubmit} disabled={uploading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 15,
    minHeight: 100, // Make text area larger
    textAlignVertical: 'top', // Align text to top for multiline
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  progressContainer: {
      alignItems: 'center',
      marginVertical: 15,
  }
});

export default CreatePostScreen;