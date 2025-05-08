import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import PostCard from "../components/PostCard";
import LoadingScreen from "./LoadingScreen";
import EmptyScreen from "./EmptyScreen";

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
  if (likedPosts.length === 0)
    return <EmptyScreen message="You haven’t liked any posts yet." />;

  return (
    <View style={styles.container}>
      <FlatList
        data={likedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} currentUserId={auth.currentUser.uid} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the FlatList takes up the full screen and scrolls properly
    backgroundColor: "#000",
  },
  list: {
    padding: 10,
  },
});
