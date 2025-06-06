import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import FlavorBotLogoWithText from '../components/FlavorBotLogoWithText';

const FlavorBotMenu = ({ navigation }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            paddingBottom: 0,
            backgroundColor: theme.background,
        },
        logoContainer: {
            alignItems: "center",
            marginBottom: 20,
        },
        button: {
            backgroundColor: theme.inputBG,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            margin: 15,
        },
        buttonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: 'bold',
        },
    })
return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <FlavorBotLogoWithText style={{ height: 51 }} />
        </View>
        <View style={styles.buttonsContainer}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                Welcome to FlavorBot!
            </Text>
            <Text style={{ color: theme.text, fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 20 }}>
                Please select an option from the menu below.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AiChat')}>
                <Text style={styles.buttonText}>
                    🗨️ Chat with me
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AiForm')}>
                <Text style={styles.buttonText}>
                    😋 Generate Recipes
                </Text>
            </TouchableOpacity>
        </View>
    </View>
)
}

export default FlavorBotMenu
