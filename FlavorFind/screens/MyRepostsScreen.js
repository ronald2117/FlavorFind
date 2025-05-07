import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import PostCard from '../components/PostCard';
import LoadingScreen from './LoadingScreen';
import EmptyScreen from './EmptyScreen';

export default function MyRepostsScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReposts = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'posts'),
        where('repostedBy', 'array-contains', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching reposts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReposts(); }, []);

  if (loading) return <LoadingScreen />;
  if (posts.length === 0) return <EmptyScreen message="You haven’t reposted anything yet." />;

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard post={item} currentUserId={auth.currentUser.uid} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#000', padding: 10 }
});
