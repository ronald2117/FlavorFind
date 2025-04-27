import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import LogoText from '../components/LogoText';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewsFeedScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <LogoText/>
                <Ionicons name="search" size={24} color="white" style={styles.searchIcon}/>
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
    }
});

export default NewsFeedScreen;