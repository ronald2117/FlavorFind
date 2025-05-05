import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewPostScreen = () => {
    return (
        <View style={styles.container}>
            <Text>View Post Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default ViewPostScreen;