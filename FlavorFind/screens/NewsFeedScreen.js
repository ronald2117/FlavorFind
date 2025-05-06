import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { collection, getDocs, updateDoc, query, orderBy, doc, getDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import PostCard from '../components/PostCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LogoText from '../components/LogoText';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from './LoadingScreen';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
      const postsData = await Promise.all(querySnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        let username = postData.username;
        if (!username && postData.userId) {
          try {
            const userRef = doc(db, 'users', postData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              username = userSnap.data().username || 'Unknown User';
            }
          } catch (userError) {
            console.warn(`Could not fetch user data for post ${postDoc.id}:`, userError);
          }
        }

        return {
          id: postDoc.id,
          ...postData,
          username: username || 'Anonymous',
        };
      }));
      setPosts(postsData);
    } catch (err) {
      console.error("Error fetching posts: ", err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) { // Refetch posts when the screen comes into focus
      fetchPosts();
    }
  }, [isFocused]); // Dependency array includes isFocused

  const handleNavigateToComments = (postId) => {
    navigation.navigate('Comments', { postId });
  };

  const handleLike = (postId) => { console.log('Like:', postId); /* Add Firestore update */ };
  const handleShare = (postId) => { console.log('Share:', postId); /* Add Share logic */ };
  const handleSave = async (postId) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        savedPosts: arrayUnion(postId),
      });
      console.log(`Post ${postId} saved successfully.`);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />; // Show loading screen while fetching posts
  }

  if (error) {
    return <View style={styles.centered}><Text>{error}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LogoText />
        <Ionicons
          name="search"
          size={30}
          color="white"
          onPress={() => navigation.navigate('Search')}
          style={{ marginRight: 15 }}
        />
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onCommentPress={() => handleNavigateToComments(item.id)}
            onLikePress={() => handleLike(item.id)} // Pass handlers
            onSharePress={() => handleShare(item.id)}
            onSavePress={() => handleSave(item.id)}
            currentUserId={auth.currentUser?.uid} // Pass current user ID
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={fetchPosts} // Add pull-to-refresh
        refreshing={loading} // Show refresh indicator while loading
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#111', // Dark background for header
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20, // Add some padding at the bottom
  },
});

export default FeedScreen;