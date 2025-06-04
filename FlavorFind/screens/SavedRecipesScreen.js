import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import PostCard from "../components/PostCard";
import LoadingScreen from "./LoadingScreen";
import EmptySavedRecipeScreen from "./EmptySavedRecipeScreen";
import { useTheme } from "../ThemeContext";

const SavedRecipesScreen = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: "#f00",
      fontSize: 16,
      textAlign: "center",
    },
    emptyText: {
      color: theme.placeholder,
      fontSize: 16,
      textAlign: "center",
      paddingVertical: 20,
    },
    listContent: {
      padding: 10,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      paddingTop: 45,
      marginLeft: 10,
      fontWeight: 'bold',
    },
    title: {
      color: theme.text,
      fontSize: 24,
    },
  });

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("User not logged in.");
      }

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User data not found.");
      }

      const savedPosts = userSnap.data().savedPosts || [];
      if (savedPosts.length === 0) {
        setSavedRecipes([]);
        return;
      }

      const postsQuery = query(
        collection(db, "posts"),
        where("__name__", "in", savedPosts)
      );
      const querySnapshot = await getDocs(postsQuery);

      const recipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSavedRecipes(recipes);
    } catch (err) {
      console.error("Error fetching saved recipes:", err);
      setError("Failed to load saved recipes. Please try again.");
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

  // if (savedRecipes.length === 0) {
  //   return <EmptySavedRecipeScreen />;
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="white" />
        </TouchableOpacity> */}
        <Text style={styles.title}>Saved Posts</Text>
      </View>
      <FlatList
        data={savedRecipes}
        renderItem={({ item }) => (
          <PostCard post={item} currentUserId={auth.currentUser?.uid} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          savedRecipes.length === 0 && styles.centered, // center "nothing here" text
        ]}
        onRefresh={fetchSavedRecipes}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={styles.emptyText}>There is nothing here.</Text>
        }
      />

    </SafeAreaView>
  );
};

export default SavedRecipesScreen;
