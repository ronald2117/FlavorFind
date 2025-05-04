import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FlavorBotLogoWithText from '../components/FlavorBotLogoWithText';

const AiRecipeResultScreen = ({ route }) => {
    const { recipe } = route.params;
    return (
        <ScrollView contentContainerStyle={{ padding: 16 }} style={styles.container}>
            <View style={styles.logoContainer}>
                            <FlavorBotLogoWithText />
                        </View>
            <Text style={{ color: '#fff' }}>{recipe}</Text>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    }
});

export default AiRecipeResultScreen;