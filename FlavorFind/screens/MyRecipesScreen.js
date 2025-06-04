import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import PostCard from "../components/PostCard";
import LoadingScreen from "./LoadingScreen";
import EmptyScreen from "./EmptyScreen";
import { useTheme } from "../ThemeContext";

export default function MyRecipesScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    list: {
      padding: 10,
      flexGrow: 1, // Ensures centering works when FlatList is empty
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      color: theme.placeholder,
      fontSize: 16,
      textAlign: "center",
      paddingVertical: 20,
    },
  });

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "posts"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) return <LoadingScreen />;
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={auth.currentUser.uid}
            context="newsfeed"
            onReload={fetchRecipes}
          />
        )}
        contentContainerStyle={
          items.length === 0
            ? [styles.list, styles.centered]
            : styles.list
        }
        onRefresh={fetchRecipes}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={styles.emptyText}>There is nothing here.</Text>
        }
      />
    </View>
  );
}
