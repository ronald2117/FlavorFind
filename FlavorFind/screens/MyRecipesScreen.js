import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import PostCard from "../components/PostCard";
import LoadingScreen from "./LoadingScreen";
import EmptyScreen from "./EmptyScreen";

export default function MyRecipesScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
  if (items.length === 0) return <EmptyScreen message="No recipes yet." />;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PostCard post={item} currentUserId={auth.currentUser.uid} />
        )}
        contentContainerStyle={styles.list}
        onRefresh={fetchRecipes} 
        refreshing={loading} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#000",
  },
  list: {
    padding: 10,
  },
});
