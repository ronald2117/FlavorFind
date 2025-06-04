import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DefaultProfilePic from '../components/DefaultProfilePic';
import MyRecipesScreen from './MyRecipesScreen';
import MyRepostsScreen from './MyRepostsScreen';
import MyLikesScreen from './MyLikesScreen';
import { useTheme } from '../ThemeContext';

const Tab = createMaterialTopTabNavigator();

export default function AccountScreen() {
    const navigation = useNavigation();
    const user = auth.currentUser;
    const { theme, toggleTheme, isDark } = useTheme();

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 15 },
        name: { color: theme.text, fontSize: 24 },
        email: { color: theme.placeholder, fontSize: 14 },
        edit: {
            color: theme.text,
            fontSize: 16,
            fontWeight: 'bold',
        },
        tabBar: { backgroundColor: theme.background },
        tabBarLabel: { fontSize: 14, color: theme.text },
        tabBarIndicator: { backgroundColor: '#1E90FF' },
        profilePic: { width: 60, height: 60, borderRadius: 25, marginRight: 8 },
        editButton: {
            backgroundColor: theme.buttonBG,
            paddingVertical: 8,
            paddingHorizontal: 25,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#757575',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1.0,
            elevation: 2,
            marginTop: 5,
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginLeft: 330 }}>
                    <Ionicons name="settings-outline" size={24} color={theme.text} style={{ margin: 10 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>{user.displayName || 'Username'}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <DefaultProfilePic width={90} height={90} stroke={theme.text}/>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.editButton}>
                        <Text style={styles.edit}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: theme.text,
                    tabBarInactiveTintColor: theme.placeholder,
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabBarLabel,
                    tabBarIndicatorStyle: styles.tabBarIndicator,
                }}>
                <Tab.Screen name="Recipes" component={MyRecipesScreen} />
                <Tab.Screen name="Reposts" component={MyRepostsScreen} />
                <Tab.Screen name="Likes" component={MyLikesScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}
