import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import PostCard from '../components/PostCard';
import DefaultProfilePic from '../components/DefaultProfilePic';
import { Animated } from 'react-native';

const ViewPostScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        setPost({ id: postSnap.id, ...postSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsQuery = query(
        collection(db, 'posts', postId, 'comments'),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(commentsQuery);
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        scale: new Animated.Value(1), // add this
        ...doc.data(),
      }));
      setComments(commentsData);

      const commentCount = querySnapshot.size;
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: commentCount,
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };



  const addComment = async () => {
    if (newComment.trim() === '') return;
    try {
      const commentRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentRef, {
        text: newComment,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName || 'Anonymous',
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const index = comments.findIndex(c => c.id === commentId);
      if (index === -1) return;

      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);

      if (commentSnap.exists()) {
        const commentData = commentSnap.data();
        const userLikes = commentData.userLikes || [];

        if (userLikes.includes(auth.currentUser.uid)) {
          await updateDoc(commentRef, {
            likes: increment(-1),
            userLikes: userLikes.filter(uid => uid !== auth.currentUser.uid),
          });
        } else {
          await updateDoc(commentRef, {
            likes: increment(1),
            userLikes: [...userLikes, auth.currentUser.uid],
          });

          Animated.sequence([
            Animated.timing(comments[index].scale, {
              toValue: 1.5,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(comments[index].scale, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }

        fetchComments();
      }
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="chevron-back-outline" size={24} color="white" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Post Details</Text>
        </View>
        {post && (
          <PostCard post={post} currentUserId={auth.currentUser?.uid} />
        )}

        <Text style={styles.replies}>Replies</Text>
        <FlatList
          data={comments}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <DefaultProfilePic style={styles.commentProfilePicContainer} />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity onPress={() => handleLikeComment(item.id)} style={styles.commentLikeButton}>
                    <Animated.View style={{ transform: [{ scale: item.scale }] }}>
                      <Ionicons
                        name="heart"
                        size={16}
                        color={item.userLikes?.includes(auth.currentUser?.uid) ? "red" : "#555"}
                        style={{ marginLeft: 4 }}
                      />
                    </Animated.View>

                    <Text style={styles.commentLikeCount}>{item.likes || 0}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.commentsList}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.addCommentContainer}
        >
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity onPress={addComment} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  commentsList: {
    padding: 10,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
  },
  commentProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentProfilePicContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    color: 'white',
    marginBottom: 10,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikeText: {
    color: '#555',
    fontSize: 14,
    marginLeft: 5,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
  },
  replies: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 18
  },
  commentLikeCount: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4,
    marginLeft: 3,
  },
});

export default ViewPostScreen;