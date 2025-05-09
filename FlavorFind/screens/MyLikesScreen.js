import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import PostCard from "../components/PostCard";
import LoadingScreen from "./LoadingScreen";

export default function MyLikesScreen() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedPosts = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "posts"),
        where("likes", "array-contains", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setLikedPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching liked posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <FlatList
        data={likedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} currentUserId={auth.currentUser.uid} />
        )}
        contentContainerStyle={
          likedPosts.length === 0
            ? [styles.list, styles.centered]
            : styles.list
        }
        onRefresh={fetchLikedPosts}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={styles.emptyText}>There is nothing here.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  list: {
    padding: 10,
    flexGrow: 1, // Needed for vertical centering when empty
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 20,
  },
});
