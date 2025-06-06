import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../ThemeContext";
import FlavorBotLogoWithText from "../components/FlavorBotLogoWithText";
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const FlavorBotChatScreen = () => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([
        {
            role: "system",
            content: "You are FlavorBot, an expert chef and food assistant. Only answer questions related to recipes, cooking, ingredients, or food. Politely refuse to answer anything unrelated to food or cooking.",
        },
        {
            role: "assistant",
            content: "Hi! I'm FlavorBot 🤖. Ask me anything about recipes, cooking tips, or food ideas!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            padding: 20,
            paddingBottom: 0,
        },
        logoContainer: {
            alignItems: "center",
            marginBottom: 10,
        },
        chatContainer: {
            flex: 1,
            marginBottom: 10,
        },
        messageBubble: {
            borderRadius: 12,
            padding: 12,
            marginVertical: 6,
            maxWidth: "80%",
        },
        userBubble: {
            backgroundColor: theme.userBubbleBG,
            alignSelf: "flex-end",
        },
        botBubble: {
            backgroundColor: theme.botBubbleBG,
            alignSelf: "flex-start",
        },
        messageText: {
            color: theme.text,
            fontSize: 16,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.inputBG,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginBottom: Platform.OS === "ios" ? 10 : 0,
        },
        input: {
            flex: 1,
            color: theme.text,
            fontSize: 16,
            paddingVertical: 8,
            backgroundColor: "transparent",
        },
        sendButton: {
            marginLeft: 8,
            backgroundColor: theme.buttonBG,
            borderRadius: 8,
            padding: 8,
            alignItems: "center",
            justifyContent: "center",
        },
        sendButtonText: {
            color: theme.text,
            fontWeight: "bold",
            fontSize: 16,
        },
        loadingContainer: {
            alignItems: "center",
            marginVertical: 10,
        },
    });

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages: [...messages, userMessage],
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer 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`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const botReply = response.data.choices[0].message.content;
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: botReply },
            ]);
        } catch (error) {
            console.log(error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't process your request right now. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <FlavorBotLogoWithText style={{ height: 60 }} />
            </View>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                enableOnAndroid={true}
                extraScrollHeight={118}
            >
                <View style={styles.chatContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd({ animated: true })
                        }
                    >
                        {messages
                            .filter(msg => msg.role !== "system")
                            .map((msg, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.messageBubble,
                                        msg.role === "user" ? styles.userBubble : styles.botBubble,
                                    ]}
                                >
                                    <Text style={styles.messageText}>{msg.content}</Text>
                                </View>
                            ))}
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={theme.text} />
                            </View>
                        )}
                    </ScrollView>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor={theme.placeholder}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        editable={!loading}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={sendMessage}
                        disabled={loading}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default FlavorBotChatScreen;