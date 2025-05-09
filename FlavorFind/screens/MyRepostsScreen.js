import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import PostCard from "../components/PostCard";
import LoadingScreen from "./LoadingScreen";

export default function MyRepostsScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReposts = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "posts"),
        where("repostedBy", "array-contains", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching reposts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReposts();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} currentUserId={auth.currentUser.uid} context="repost" />
        )}
        contentContainerStyle={
          posts.length === 0
            ? [styles.list, styles.centered]
            : styles.list
        }
        onRefresh={fetchReposts}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven’t reposted anything yet.</Text>
        }
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
    flexGrow: 1,
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
