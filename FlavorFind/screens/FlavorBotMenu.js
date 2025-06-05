import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../ThemeContext';

const FlavorBotMenu = () => {
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
    })
    return (
        <View>
            <View style={styles.logoContainer}>
                <FlavorBotLogoWithText style={{ height: 51 }} />
            </View>
        </View>
    )
}

export default FlavorBotMenu
