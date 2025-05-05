import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_CHAR = 500;

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      return Alert.alert('Permission Required', 'Allow photo access to upload an image.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}.jpg`);
    const uploadTask = uploadBytesResumable(fileRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        error => {
          blob.close();
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          blob.close();
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageUri) {
      return Alert.alert('Empty Post', 'Add text or an image to create a post.');
    }
    if (!auth.currentUser) {
      return Alert.alert('Not Logged In', 'Please log in to create a post.');
    }

    setUploading(true);
    try {
      let imageUrl = null;
      if (imageUri) imageUrl = await uploadImageAsync(imageUri);

      const postData = {
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName || 'Anonymous',
        text: text.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0,
      };
      await addDoc(collection(db, 'posts'), postData);

      Alert.alert('Success', 'Your recipe post has been created!');
      setText('');
      setImageUri(null);
      setProgress(0);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>New Recipe Post</Text>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Share your recipe..."
            placeholderTextColor="#888"
            value={text}
            onChangeText={t => t.length <= MAX_CHAR && setText(t)}
            multiline
            selectionColor="#B8860B"
          />
          <Text style={styles.charCount}>{text.length}/{MAX_CHAR}</Text>

          <TouchableOpacity
            style={[styles.button, styles.imageButton]}
            onPress={pickImage}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>

          {imageUri ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {uploading && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.postButton, uploading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            {uploading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Post</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
  container: { padding: 20, flexGrow: 1, justifyContent: 'flex-start' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: { textAlign: 'right', marginBottom: 15, color: '#aaa' },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButton: { backgroundColor: '#B8860B' },
  postButton: { backgroundColor: '#8B0000' },
  buttonDisabled: { backgroundColor: '#555' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  imageWrapper: { marginVertical: 15, alignItems: 'center' },
  imagePreview: { width: '100%', height: 200, borderRadius: 8 },
  removeButton: { marginTop: 8 },
  removeText: { color: '#FF6347', fontSize: 14 },
  progressContainer: { marginVertical: 15, alignItems: 'center' },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: { height: 10, backgroundColor: '#B8860B' },
  progressText: { marginTop: 5, color: '#fff' },
});
