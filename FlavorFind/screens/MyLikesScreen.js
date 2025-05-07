import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import PostCard from '../components/PostCard';
import LoadingScreen from './LoadingScreen';
import EmptyScreen from './EmptyScreen';

export default function MyLikesScreen() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedPosts = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'posts'),
        where('likes', 'array-contains', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setLikedPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching liked posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLikedPosts(); }, []);

  if (loading) return <LoadingScreen />;
  if (likedPosts.length === 0) return <EmptyScreen message="You haven’t liked any posts yet." />;

  return (
    <FlatList
      data={likedPosts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard post={item} currentUserId={auth.currentUser.uid} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#000', padding: 10 }
});
