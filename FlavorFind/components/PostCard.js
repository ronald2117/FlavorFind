import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import DefaultProfilePic from '../components/DefaultProfilePic';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, updateDoc, arrayUnion,} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const PostCard = ({ post, currentUserId }) => {
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [scaleValue] = useState(new Animated.Value(1)); 
  const navigation = useNavigation();

  const handleNavigateToComments = (postId) => {
    navigation.navigate('ViewPost', { postId });
  };
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

  const handleLike = async () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5, 
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    try {
      const postRef = doc(db, 'posts', post.id);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: post.likes.filter((id) => id !== currentUserId),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUserId),
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      if (isLiked) {
      await updateDoc(userRef, {
        likedPosts: post.likes.filter((id) => id !== post.id),
      });
      } else {
      await updateDoc(userRef, {
        likedPosts: arrayUnion(post.id),
      });
      }
    } catch (error) {
      console.error('Error updating liked posts:', error);
    }
  };

  return (
    <View style={styles.card}>
      <DefaultProfilePic style={styles.profilePic} />
      <View style={styles.body}>
        <Text style={styles.username}>{post.username}</Text>
        <Text style={styles.text}>{post.text}</Text>
        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleLike(post.id)} style={styles.actionButton}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? 'red' : '#555'}
              />
            </Animated.View>
            <Text style={isLiked ? styles.likedText : styles.actionText}>
              {likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleNavigateToComments(post.id)} style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={20} color="#555" />
            <Text style={styles.actionText}>{post.commentCount || 0}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => handleShare(post.id)} style={styles.actionButton}>
            <Icon name="share-outline" size={20} color="#555" />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={() => handleSave(post.id)} style={[styles.actionButton, styles.saveButton]}>
            <Icon
              name={post.saves?.includes(currentUserId) ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={post.saves?.includes(currentUserId) ? 'green' : '#555'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  card: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 5,
    color: '#fff',
    flexWrap: 'wrap',
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  likedText: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  saveButton: {
    // Add specific styling if needed
  },
});

export default PostCard;