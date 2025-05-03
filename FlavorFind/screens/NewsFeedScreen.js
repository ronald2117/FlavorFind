import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

import LogoText from '../components/LogoText';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewsFeedScreen = () => {
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            const snapshot = await getDocs(collection(db, 'posts'));
            const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postList);
        };

        fetchPosts();
    }, []);

    const createPost = async () => {
        if (!postText.trim()) return;
        await addDoc(collection(db, 'posts'), {
            username: 'username', // Replace with real user
            text: postText,
            steps: [],
            hashtags: [],
            imageUrl: '',
            likes: 0,
            comments: 0,
            createdAt: serverTimestamp()
        });
        setPostText('');
    };

    const renderItem = ({ item }) => (
        <View style={styles.post}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.text}>{item.text}</Text>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}
            {item.steps && item.steps.map((step, i) => <Text key={i}>• {step}</Text>)}
            <Text style={styles.hashtags}>{item.hashtags?.join(' ')}</Text>
            <Text style={styles.meta}>❤️ {item.likes}   💬 {item.comments}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <LogoText />
                <Ionicons name="search" size={24} color="white" style={styles.searchIcon} />
            </View>
            <View style={{ flex: 1 }}>

                {/* Feed */}
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    searchIcon: {
        marginRight: 15,
    },
    post: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
    username: { fontWeight: 'bold', marginBottom: 5 },
    text: { marginBottom: 5 },
    image: { height: 200, borderRadius: 10, marginBottom: 10 },
    hashtags: { color: '#888' },
    meta: { color: '#999', fontSize: 12 }
});

export default NewsFeedScreen;