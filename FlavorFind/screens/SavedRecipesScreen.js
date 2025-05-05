import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import PostCard from '../components/PostCard';
import LoadingScreen from './LoadingScreen';
import EmptySavedRecipeScreen from './EmptySavedRecipeScreen';

const SavedRecipesScreen = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not logged in.');
      }

      const savedQuery = query(
        collection(db, 'posts'),
        where(`saves.${userId}`, '==', true) // Fetch posts saved by the current user
      );
      const querySnapshot = await getDocs(savedQuery);

      const recipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSavedRecipes(recipes);
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setError('Failed to load saved recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <EmptySavedRecipeScreen/>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedRecipes}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onCommentPress={() => Alert.alert('Comments', 'Navigate to comments.')}
            onLikePress={() => Alert.alert('Like', 'Like functionality not implemented.')}
            onSharePress={() => Alert.alert('Share', 'Share functionality not implemented.')}
            onSavePress={() => Alert.alert('Save', 'Save functionality not implemented.')}
            currentUserId={auth.currentUser?.uid}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f00',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
});

export default SavedRecipesScreen;