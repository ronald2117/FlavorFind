// components/PostCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// Consider using an icon library like react-native-vector-icons
// import Icon from 'react-native-vector-icons/Ionicons';

const PostCard = ({ post, onCommentPress, onLikePress, onSharePress, onSavePress, currentUserId }) => {
  // Check if the current user has liked the post
  const isLiked = post.likes && currentUserId ? post.likes[currentUserId] === true : false;
  const likeCount = post.likeCount || Object.keys(post.likes || {}).length; // Use likeCount if available

  const isSaved = post.saves && currentUserId ? post.saves[currentUserId] === true : false;

  return (
    <View style={styles.card}>
      {/* Post Header (Optional: Add user avatar and name) */}
      <View style={styles.header}>
          <Text style={styles.username}>{post.username || 'User'}</Text>
          {/* Add timestamp if needed */}
      </View>

      {/* Post Image (Conditional) */}
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      {/* Post Text */}
      <Text style={styles.text}>{post.text}</Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLikePress} style={styles.actionButton}>
          {/* Replace Text with an Icon component */}
          <Text style={isLiked ? styles.likedText : styles.actionText}>
            Like ({likeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCommentPress} style={styles.actionButton}>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSharePress} style={styles.actionButton}>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSavePress} style={[styles.actionButton, styles.saveButton]}>
          <Text style={isSaved ? styles.savedText : styles.actionText}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
      marginBottom: 10,
  },
  username: {
      fontWeight: 'bold',
      fontSize: 16,
  },
  image: {
    width: '100%',
    height: 250, // Adjust as needed
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    padding: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#555',
  },
  likedText: {
    fontSize: 14,
    color: 'blue', // Style for liked state
    fontWeight: 'bold',
  },
  saveButton: {
    // Add specific styling if needed
  },
  savedText: {
      fontSize: 14,
      color: 'green', // Style for saved state
      fontWeight: 'bold',
  },
});

export default PostCard;