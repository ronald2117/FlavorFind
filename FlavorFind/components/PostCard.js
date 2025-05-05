// components/PostCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import DefaultProfilePic from '../components/DefaultProfilePic';
import Icon from 'react-native-vector-icons/Ionicons';

const PostCard = ({ post, onCommentPress, onLikePress, onSharePress, onSavePress, currentUserId }) => {
  // Check if the current user has liked the post
  const isLiked = post.likes && currentUserId ? post.likes[currentUserId] === true : false;
  const likeCount = post.likeCount || Object.keys(post.likes || {}).length; // Use likeCount if available

  const isSaved = post.saves && currentUserId ? post.saves[currentUserId] === true : false;

  const commentCount = post.commentCount || 0; // Default to 0 if commentCount is not provided

  return (
    <View style={styles.card}>
      <DefaultProfilePic style={styles.profilePic} />
      <View style={styles.body}>
        <Text style={styles.username}>{post.username}</Text>

        {/* Post Image (Conditional) */}
        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
        )}

        {/* Post Text */}
        <Text style={styles.text}>{post.text}</Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onLikePress} style={styles.actionButton}>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? 'red' : '#555'}
            />
            <Text style={isLiked ? styles.likedText : styles.actionText}>
              {likeCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCommentPress} style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={20} color="#555" />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSharePress} style={styles.actionButton}>
            <Icon name="share-outline" size={20} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSavePress} style={[styles.actionButton, styles.saveButton]}>
            <Icon
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isSaved ? 'green' : '#555'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
    height: 250, // Adjust as needed
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 15,
    color: '#fff',
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
    color: 'blue', // Style for liked state
    fontWeight: 'bold',
    marginLeft: 5,
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