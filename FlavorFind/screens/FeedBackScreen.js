import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const MAX_CHAR = 300;

const FeedBackScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const styles = StyleSheet.create({
        safe: { flex: 1, backgroundColor: theme.background },
        container: { padding: 20, flexGrow: 1, justifyContent: 'flex-start' },
        title: {
            color: theme.text,
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
            marginBottom: 20,
            fontWeight: 700,
        },
        label: { fontSize: 16, fontWeight: 600, marginBottom: 8, color: theme.text },
        input: {
            borderWidth: 1,
            borderColor: theme.placeholder,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: theme.inputBG,
            color: theme.text,
            minHeight: 80,
            textAlignVertical: 'top',
        },
        charCount: { textAlign: 'right', marginBottom: 15, color: theme.placeholder },
        button: {
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
            backgroundColor: theme.buttonBG,
        },
        buttonText: { color: theme.text, fontSize: 16, fontWeight: '600' },
        starsRow: { flexDirection: 'row', marginBottom: 18 },
        star: { marginHorizontal: 4 },
        starSelected: { color: '#FFD700' },
        starUnselected: { color: theme.placeholder },
    });

    const handleSubmit = async () => {
        if (!rating) {
            return Alert.alert('Rating Required', 'Please rate the app.');
        }
        if (!feedback.trim()) {
            return Alert.alert('Feedback Required', 'Please enter your feedback.');
        }
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'feedback'), {
                userId: auth.currentUser?.uid || null,
                username: auth.currentUser?.displayName || 'Anonymous',
                feedback: feedback.trim(),
                rating,
                createdAt: serverTimestamp(),
            });
            Alert.alert('Thank you!', 'Your feedback has been submitted.');
            setFeedback('');
            setRating(0);
        } catch (error) {
            Alert.alert('Error', 'Could not submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back-outline" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Rate & Feedback</Text>

                    </View>

                    <Text style={styles.label}>How would you rate our app?</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                disabled={submitting}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={star <= rating ? 'star' : 'star-outline'}
                                    size={32}
                                    style={styles.star}
                                    color={star <= rating ? '#FFD700' : theme.placeholder}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Your Feedback</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tell us what you think..."
                        placeholderTextColor={theme.placeholder}
                        value={feedback}
                        onChangeText={t => t.length <= MAX_CHAR && setFeedback(t)}
                        multiline
                        editable={!submitting}
                    />
                    <Text style={styles.charCount}>{feedback.length}/{MAX_CHAR}</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={submitting || !feedback.trim() || !rating}
                    >
                        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit Feedback'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default FeedBackScreen;