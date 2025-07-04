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
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';

const MAX_CHAR = 500;

// Cloudinary Configuration
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dtt8pyj8o/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'react_native_unsigned'; 

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    flex: { flex: 1 },
    container: { padding: 20, flexGrow: 1, justifyContent: 'flex-start' },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: theme.text },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text },
    input: {
      borderWidth: 1,
      borderColor: theme.placeholder,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.inputBG,
      color: theme.text,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    charCount: { textAlign: 'right', marginBottom: 15, color: theme.placeholder },
    button: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    imageButton: { backgroundColor: theme.buttonBG },
    postButton: { backgroundColor: theme.buttonBG },
    buttonDisabled: { backgroundColor: theme.buttonBG },
    buttonText: { color: theme.text, fontSize: 16, fontWeight: '600' },
    imageWrapper: { marginVertical: 15, alignItems: 'center' },
    imagePreview: { width: '100%', height: 200, borderRadius: 8 },
    removeButton: { marginTop: 8 },
    removeText: { color: '#FF6347', fontSize: 14 },
    progressContainer: { marginVertical: 15, alignItems: 'center' },
    progressText: { marginTop: 5, color: theme.text },
  });

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

  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok && data.secure_url) {
        return data.secure_url; // Return the uploaded image URL
      } else {
        throw new Error(data.error?.message || 'Unknown Cloudinary error');
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw error;
    }
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
      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      const postData = {
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName || 'Anonymous',
        text: text.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0,
        comments: [],
        visibility: isPublic ? 'public' : 'private',
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

          {/* Visibility Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ color: theme.text, fontSize: 16, marginRight: 10 }}>
              {isPublic ? 'Public' : 'Private'}
            </Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              thumbColor={isPublic ? theme.buttonBG : theme.placeholder}
              trackColor={{ false: theme.placeholder, true: theme.buttonBG }}
            />
            <Text style={{ color: theme.placeholder, marginLeft: 10, fontSize: 13 }}>
              {isPublic
                ? 'Everyone can see this post'
                : 'Only you can see this post'}
            </Text>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Share your recipe..."
            placeholderTextColor={theme.placeholder}
            value={text}
            onChangeText={(t) => t.length <= MAX_CHAR && setText(t)}
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
              <ActivityIndicator size="large" color={theme.text} />
              <Text style={styles.progressText}>Uploading...</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.postButton, uploading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Post</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
