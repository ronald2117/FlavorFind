import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert, // Import Alert for dialog functionality
} from "react-native";
import DefaultProfilePic from "../components/DefaultProfilePic";
import Icon from "react-native-vector-icons/Ionicons";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../ThemeContext';

const PostCard = ({ post, currentUserId, context, onReload }) => {
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [scaleValue] = useState(new Animated.Value(1));
  const [saveScaleValue] = useState(new Animated.Value(1));
  const [isSaved, setIsSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 180;
  const isLong = post.text.length > MAX_CHARS;
  const displayText = !expanded && isLong
    ? post.text.slice(0, MAX_CHARS) + "..."
    : post.text;
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      position: "relative",
    },
    card: {
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 15,
      marginVertical: 8,
      borderTopWidth: 1,
      borderTopColor: theme.text,
      flexDirection: "row",
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 8,
    },
    username: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.text,
    },
    postOption: {
      position: "absolute",
      right: 5,
      padding: 5,
    },
    image: {
      width: "100%",
      height: 250,
      marginTop: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    text: {
      fontSize: 15,
      lineHeight: 20,
      marginTop: 5,
      color: theme.text,
      flexWrap: "wrap",
      width: "100%",
    },
    actions: {
      flexDirection: "row",
      paddingTop: 10,
      alignItems: "center",
    },
    actionButton: {
      padding: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    actionText: {
      fontSize: 14,
      color: theme.text,
      marginLeft: 5,
    },
    likedText: {
      fontSize: 14,
      color: "red",
      fontWeight: "bold",
      marginLeft: 5,
    },
  });
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const savedPosts = userDoc.data().savedPosts || [];
          setIsSaved(savedPosts.includes(post.id));
        }
      } catch (error) {
        console.error("Error checking if post is saved:", error);
      }
    };

    checkIfSaved();
  }, [post.id]);

  const handleNavigateToComments = (postId) => {
    navigation.navigate("ViewPost", { postId });
  };

  const handleShare = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        repostedBy: arrayUnion(auth.currentUser.uid),
      });
      alert(`Post ${postId} reposted successfully.`);
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  const handleSave = async (postId) => {
    Animated.sequence([
      Animated.timing(saveScaleValue, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(saveScaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      if (isSaved) {
        await updateDoc(userRef, {
          savedPosts: (post.saves || []).filter((id) => id !== postId),
        });
        setIsSaved(false);
        console.log(`Post ${postId} unsaved.`);
      } else {
        await updateDoc(userRef, {
          savedPosts: arrayUnion(postId),
        });
        setIsSaved(true);
        console.log(`Post ${postId} saved successfully.`);
      }
    } catch (error) {
      console.error("Error saving or unsaving post:", error);
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
      const postRef = doc(db, "posts", post.id);
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
      console.error("Error updating likes:", error);
    }

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
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
      console.error("Error updating liked posts:", error);
    }
  };

  const handlePostOption = () => {
    if (context === "newsfeed") {
      if (post.userId === currentUserId) {
        Alert.alert(
          "Post Options",
          "What would you like to do?",
          [
            {
              text: "Delete Post",
              onPress: () => handleDeletePost(post.id),
              style: "destructive",
            },
            { text: "Cancel", style: "cancel" },
          ],
          { cancelable: true }
        );
      } else {
        Alert.alert(
          "Post Options",
          "What would you like to do?",
          [
            {
              text: "Report Post",
              onPress: () => handleReportPost(post.id),
              style: "default",
            },
            { text: "Cancel", style: "cancel" },
          ],
          { cancelable: true }
        );
      }
    } else if (context == "repost") {
      Alert.alert(
        "Repost Options",
        "What would you like to do?",
        [
          {
            text: "Remove from Reposts",
            onPress: () => handleRemoveRepost(post.id),
            style: "destructive",
          },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      alert("Post deleted successfully.");
      if (onReload) onReload(); // Trigger reload after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post. Please try again.");
    }
  };

  const handleReportPost = (postId) => {
    alert(`Post ${postId} has been reported.`);
  };

  const handleRemoveRepost = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        repostedBy: arrayRemove(auth.currentUser.uid),
      });

      alert("Post removed from your reposts.");

      if (onReload) onReload();
    } catch (error) {
      console.error("Error removing repost:", error);
      alert("Failed to remove the repost. Please try again.");
    }
  };


  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNavigateToComments(post.id)}
    >
      <DefaultProfilePic style={styles.profilePic} stroke={theme.text} />
      <View style={styles.body}>
        <Text style={styles.username}>{post.username}</Text>
        <TouchableOpacity style={styles.postOption} onPress={handlePostOption}>
          <Icon name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.text}>
          {displayText}
          {!expanded && isLong && (
            <Text
              style={{ color: "#007bff", fontWeight: "bold" }}
              onPress={() => setExpanded(true)}
            >
              {" see more"}
            </Text>
          )}
        </Text>
        {post.imageUrl && (
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.actions}>
          {/* Like Button */}
          <TouchableOpacity
            onPress={() => handleLike(post.id)}
            style={styles.actionButton}
          >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Icon
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "red" : "#555"}
              />
            </Animated.View>
            <Text style={isLiked ? styles.likedText : styles.actionText}>
              {likeCount}
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity
            onPress={() => handleNavigateToComments(post.id)}
            style={styles.actionButton}
          >
            <Icon name="chatbubble-outline" size={20} color="#555" />
            <Text style={styles.actionText}>{post.commentCount || 0}</Text>
          </TouchableOpacity>

          {/* Save Button with Animation */}
          <TouchableOpacity
            onPress={() => handleSave(post.id)}
            style={[styles.actionButton, styles.saveButton]}
          >
            <Animated.View style={{ transform: [{ scale: saveScaleValue }] }}>
              <Icon
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? "#FFBA09" : "#555"}
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            onPress={() => handleShare(post.id)}
            style={styles.actionButton}
          >
            <Icon name="paper-plane-outline" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;
